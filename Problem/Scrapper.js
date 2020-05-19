const puppeteer = require('puppeteer');
module.exports.scrap = async (url,callback) => {
    const browser = await puppeteer.launch({headless: false});
    url = url +'problems/'
    let page1 = await browser.newPage();
    await page1.setRequestInterception(true);    
    page1.on('request', (req) => {
        if ( req.resourceType() == 'image' || req.resourceType() == 'font' || req.resourceType() == 'other' || req.resourceType() == 'fetch') {
            req.abort();
        }
        else {
            req.continue();
        }
    });
    const wait = page1.waitForNavigation();
    await page1.goto('https://www.hackerearth.com/login/');
    await page1.type('#id_login','coding.cmrcet@gmail.com');
    await page1.type('#id_password','THIS@asd01');
    await page1.click('input.track-login');
    await page1.goto(url);
    const result = await page1.$$eval('table.nice-table-2 tr', rows => {
        return Array.from(rows, row => {
          const columns = row.querySelectorAll('td');
          return Array.from(columns, column => column.innerText.split('\n'));
        });
    });
    const result1 = await page1.$$eval('td.prob a', rows => {
        return Array.from(rows , row => row.href);
    });
    let ret=[];
    for(let i=1;i<result.length;i++)
    {
        ret.push({
            ProblemID  : i,
            ContestID : url.split('-')[2].split('/')[0],
            Name : result[i][0][0],
            Accuracy : result[i][1][0],
            Score : result[i][2][0],
            Slug : result1[i-1].split('algorithm/')[1].split('/')[0]
        });
    }
    callback(ret)
    await browser.close()
}

// scrap('https://www.hackerearth.com/challenges/college/icc-contest-10/',(res) => {
//     console.log(res)
//     console.log('dome');
// })