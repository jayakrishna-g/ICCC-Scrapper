const async = require('async');
const db = require('../db/lib/player');
const Scrapper = require('./Scrapper');
let player = {
    Handle : String,
    PersonalDetails : {
        Name : String,
        RollNumber : String,
        College: String,
        Stream : String,
        YearofStudy : Number,
        Email : String
        },
    ContestDetails : [],
    Deleted : Boolean
};
module.exports. work = async (url,callback) => {
    Scrapper.scrap(url,(res) => {
        async.each(res,(item,next) => {
            let cd = {
                ContestID : url.split('-')[2].split('/')[0],
                Rank : item.Rank,
                Problems : item.Problems,
                Score : item.Score,
                Rating : 1200,
                Volatility : 90
            };
            db.getSinglePlayerDetails({Handle : item.Handle} , (err,player1) => {
                if(player1){
                    player1.PersonalDetails.Name = item.Name;
                    let n = player1.ContestDetails.length-1;
                    cd.Rating = player1.ContestDetails[n].Rating;
                    cd.Volatility = player1.ContestDetails[n].Volatility;
                    player1.ContestDetails.push(JSON.parse(JSON.stringify(cd)));
                    db.updatePlayer(player1,(err,res) => {
                        next(err);
                    })
                }
                else {
                    player.PersonalDetails = {
                        Name : item.Name,
                        RollNumber : "NA",
                        College : "NA",
                        Stream : "NA",
                        YearofStudy : "NA",
                        Email : "NA"
                    };
                    player.Handle = item.Handle;
                    player.Deleted = false;
                    player.TimesPlayed = 0;
                    player.ContestDetails = cd;
                    db.addPlayer(player,() => {
                        next(err);
                    });
                }
            });
        }
        ,
        () => {
            async.concat(res, (item,next) => {
                db.getSinglePlayerDetails({Handle : item.Handle} , (err,player1) => {
                    next(err,[player1]);
                });
            } , (err,curres) => {
                callback(err,res,curres);
            });
        });
    });    
}
