
const puppeteer = require('puppeteer');
const fs = require('fs');
const { url } = require('inspector');
var userAgent = require('user-agents');

var links = ['https://www.agweb.com'];
var visited_links = new Map();
// var new_links2 = new Map();
var depth = 2;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

(async() => {
    const browser = await puppeteer.launch({ headless: false });
      
    const page = await browser.newPage();
    await page.setUserAgent(userAgent.toString())
    // await page.setUserAgent(
    //     'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
    //    )

    for (let j = 0; j < depth; j++) {
        new_links = new Map()
        var count = 0;
        for await (let link of links) {
            
            if (visited_links.has(link)) {
                continue
            }

            await page.goto(link, {waitUntil: 'networkidle0', timeout: 10});

            visited_links.set(link, true)

            const inner_html = await page.$eval('html', element => element.innerHTML);
            fs.writeFile(`html/${link.replace(/\//g,'-')}.html`, inner_html, (err) => {
                // In case of a error throw err.
                if (err) throw err;
            })

            const articles = await page.evaluate(() => {
                let titleLinks = document.querySelectorAll('a');

                titleLinks = [...titleLinks];

                let articles = titleLinks.map(link => link.getAttribute('href'));
                
                let abs_url = []
                for  (let idx in articles) {
                    doc = articles[idx]
                    
                    if ( doc != null && (!doc.includes('#')) && doc.includes('/') ) {
                        if (!doc.includes(document.baseURI)) {
                            doc = new URL(doc, document.baseURI).href
                        }
                        
                        // if (doc.match('http[s]://*.vnexpress.net')) {
                        abs_url.push(doc)
                        // }
                    }
                }
                return abs_url;
            });

            // console.log(articles.length)
            for await (let url of articles) {
                if (!visited_links.has(url)) {
                    new_links.set(url, true)
                    // console.log('NOT EXIST', url)
                } else {
                    // console.log('EXIST', url)
                }
            }
            console.log(++count, link, new_links.size);
        }            
        links = new_links.keys()
       
    }

    await sleep(20000);

    // console.log(html)
    await browser.close();
})();




async function scrollToBottom() {
    await new Promise(resolve => {
      const distance = 100; // should be less than or equal to window.innerHeight
      const delay = 100;
      const timer = setInterval(() => {
        document.scrollingElement.scrollBy(0, distance);
        if (document.scrollingElement.scrollTop + window.innerHeight >= document.scrollingElement.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, delay);
    });
  }
  
// (async() => {
//     // Mở trình duyệt mới và tới trang của kenh14
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();
//     await page.goto('https://vnexpress.net', {waitUntil: 'load', timeout: 0});

//     // Chạy đoạn JavaScript trong hàm này, đưa kết quả vào biến article
//     const articles = await page.evaluate(() => {
//         let titleLinks = document.querySelectorAll('a');
//         titleLinks = [...titleLinks];
//         let articles = titleLinks.map(link => ({
//             // title: link.getAttribute('title'),
//             url: link.getAttribute('href')
//         }));
//         return articles;
//     });
    
//     Object.size = function(obj) {
//         var size = 0,
//           key;
//         for (key in obj) {
//           if (obj.hasOwnProperty(key)) size++;
//         }
//         return size;
//     };
    
//     // for (let i = 0 ; i < depth; i++) {
//     //    
//     // }
//     for (let j = 0; j < Object.size(articles); j++){
//         if(!links.includes(articles[j]['url']) && !articles[j]['url'].includes(';') && articles[j]['url'].length > 2) {
//             if (!articles[j]['url'].includes('vnexpress.net')) {
//                 articles[j]['url'] = 'https://vnexpress.net'.concat(articles[j]['url'])
//             }
//             links.push(articles[j]['url'])
//             console.log(articles[j]['url'])
//             links.push('\n')
//         }
//         const browser = await puppeteer.launch({ headless: true });
//         const page = await browser.newPage();
        
    //     await page.goto("${articles[j]['url']}", {waitUntil: 'load', timeout: 0});

    //     // Chạy đoạn JavaScript trong hàm này, đưa kết quả vào biến article
    //     const urls = await page.evaluate(() => {
    //         let titleLinks = document.querySelectorAll('a');
    //         titleLinks = [...titleLinks];
    //         let urls = titleLinks.map(link => ({
    //             url: link.getAttribute('href')
    //         }));
    //         for (let j = 0; j < Object.size(articles); j++){
    //             links.push(urls[j]['url'])
    //         }
    //     });
//     }

    // fs.writeFile('Output.txt', links, (err) => { 
      
    //     // In case of a error throw err. 
    //     if (err) throw err; 
    // })
    
//     // In ra kết quả và đóng trình duyệt
//     // console.log(articles[0]['url']);
//     await browser.close();
// })();

// function name(params) {
    
// }
