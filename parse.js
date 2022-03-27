
const puppeteer = require('puppeteer');
const fs = require('fs');
const { url } = require('inspector');

var links = ['https://vnexpress.net'];
var visited_links = new Map();
// var new_links2 = new Map();
var depth = 4;


// visited_link
// links = [vnexpress.net]
// depth=3 


// for i in range depth
// new link =[]
//  for link in links:
//      if link not in visited_link then goto link 
//             -> get HTML -> hbase 
//             -> get a -> new_links
//             -> add link -> visited_link
//  links = new_links

(async() => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();


    for (let j = 0; j < depth; j++) {
        new_links = new Map()
        var count = 0;
        for await (let link of links) {
            
            if (visited_links.has(link)) {
                continue
            }

            await page.goto(link, {waitUntil: 'domcontentloaded', timeout: 0});
            
            visited_links.set(link, true)

            const articles = await page.evaluate(() => {
                // return new Promise(async (resolve, reject) => {
                //     try {
                
 
                fs.writeFile('html/{$link}', document.innerHTML, (err) => { 
                    // In case of a error throw err. 
                    if (err) throw err; 
                })
                let titleLinks = document.querySelectorAll('a');
                titleLinks = [...titleLinks];

                let articles = titleLinks.map(link => link.getAttribute('href'));
                
                let abs_url = []
                
                for  (let idx in articles) {
                    doc = articles[idx]
                    
                    if ( doc != null && (!doc.includes('#')) && (!doc.includes('commentid')) && doc.includes('/') && doc.length > 2) {
                        if (!doc.includes(document.baseURI)) {
                            doc = new URL(doc, document.baseURI).href
                        }
                        
                        if (doc.includes(document.baseURI)) {
                            abs_url.push(doc)
                        }

                    }
                }
                //         return resolve(abs_url);
                //     } catch (e) {
                //         return reject(e);
                //     }
                // })
                
                
                return abs_url;
            });

            for await (let url of articles) {
                if (!visited_links.has(url)) {
                    new_links.set(url, true)
                    // console.log(url)
                    // new_links.push('\n')

                }
            }
            console.log(++count, link, new_links.size);
        }            
        links = new_links.keys()
       
    }
    console.log(html)
    await browser.close();

})();

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
