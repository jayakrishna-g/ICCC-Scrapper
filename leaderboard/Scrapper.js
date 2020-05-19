const puppeteer = require('puppeteer');
const async = require('async');
const util = require('util');
let user = {
    'Name': String,
    'Handle':String,
    'TotalScore':String,
    'ProblemsSolved':Number,
    'EffectiveTime':String,
    'Problems': [{
        'PID' : String,
        'Score' : String,
        'TimeTaken' : String
    }],
    'Rank': Number
} ;
module.exports.scrap = async (url,callback) => {
    const browser = await puppeteer.launch({headless: false});
    url = url +'leaderboard/page/'
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
    let pagenum = 1;
    let leaderboard = [];
    while(true)
    {
        await page1.goto(url + pagenum);
        await page1.waitForSelector('table.nice-table-2');
        const result = await page1.$$eval('table.nice-table-2 tr', rows => {
            return Array.from(rows, row => {
              const columns = row.querySelectorAll('td');
              return Array.from(columns, column => column.innerText.split('\n'));
            });
        });
        const curpage = await page1.$eval('#current-page' , e => e.innerHTML);
        if(curpage!=pagenum)
        {
            leaderboard.shift();
            callback(leaderboard);
            await page1.close();
            await browser.close();
            break;
        }
        if(leaderboard.length ==0)
        {
            user['Name'] = 'Name';
            user['Handle'] = 'Handle';
            user['TotalScore'] = result[0][1][0].split('(')[0].split(')')[0];
            user['ProblemsSolved'] = result[0][1][1].split('(')[0].split(')')[0];
            user['EffectiveTime'] = result[0][2][0];
            user['Rank'] = 'Rank';
            user['Problems'] = [];
            for(let i=3;i<result[0].length;i++)
            {
                user['Problems'].push({
                    'PID' : result[0][i][0],
                    'Score': result[0][i][2].split('(')[0].split(')')[0],
                    'TimeTaken' : String
                });
            }
            // console.log(user.Problems);
            leaderboard.push(JSON.parse(JSON.stringify(user)));
        }
        for(let i=1;i<result.length;i++)
        {
            user['Name'] = result[i][0][2];
            user['Handle'] = result[i][0][3];
            user['Rank'] = parseInt(result[i][0][0].split('.')[0]);
            user['ProblemsSolved'] = parseInt(result[i][1][1].split('(')[1].split(')')[0]);
            user['EffectiveTime'] = result[i][2][0];
            user['TotalScore'] = result[i][1][0];
            for(let j=3;j<result[i].length;j++)
            {
                user['Problems'][j-3].Score = result[i][j][0];
                user['Problems'][j-3].TimeTaken = result[i][j][1];
            }
            if(leaderboard[leaderboard.length-1].TotalScore==user.TotalScore && leaderboard[leaderboard.length-1].EffectiveTime == user.EffectiveTime)
            {
                user.Rank = leaderboard[leaderboard.length-1].Rank;
            }
            leaderboard.push(JSON.parse(JSON.stringify(user)));
        }
        pagenum++;
    }
    // console.log(util.inspect(leaderboard,{maxArraylength :null}));
}

// scrap('https://www.hackerearth.com/challenges/college/icc-contest-1/', (res) =>{
//     // console.log(res);
// });