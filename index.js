const db = require('./db/connect');
const lb = require('./leaderboard/leaderboard');
const update = require('./updateRating');
const async = require('async');
const player = require('./db/lib/player')
db.connect();
const workALL = async (url,callback) => {
    lb.work(url,(err,resl,prev) => {
        console.log(prev);
        const newRating = update.update(prev);
        console.log(prev);
        console.log(newRating);
        // async.each(newRating, (item,next) => {
        //     player.getSinglePlayerDetails({Handle : item.Handle},(err,res)=>{
        //         // console.log(JSON.stringify(res));
        //         res.ContestDetails[item.TimesPlayed - 1].Rating = item.Rating;
        //         res.ContestDetails[item.TimesPlayed - 1].Volatility = item.Volatility;                
        //         // console.log(JSON.stringify(res));
        //         // console.log(JSON.stringify(item));
        //         player.updatePlayer(res,(err,jk)=>{
        //             next(err);
        //         })
        //     })
        // }, (err) => {
        //     callback();
        //     return true;
        // })
    })
}

workALL(
  "https://www.hackerearth.com/challenges/college/league-of-coders-test-draft-3/",
  () => {
    console.log("Done");
  }
);