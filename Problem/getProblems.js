const scrapper = require('./Scrapper')
const async = require('async')
const problemLib = require('../db/lib/problem')
const connect = require('../db/connect')

connect.connect();

const work = (url,cb) => {
    scrapper.scrap(url, (res) => {
        async.each(res , (item,next) => {
            problemLib.addproblem(item,(err,resp)=>{
                next();
            })
        }, err => cb())
    });
}

work('https://www.hackerearth.com/challenges/college/icc-contest-10/',() =>{
    console.log('done')
})