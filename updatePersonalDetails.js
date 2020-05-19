const csv = require('csvtojson');
const csvPath = './icccDetails.csv';
const async = require('async');
const db = require('./db/connect');
const user = require('./db/lib/player');

db.connect();

const work = async (callback) => {
    const res = await csv().fromFile(csvPath);
    async.each(res , (item,next) => {
        const handle = item.Handle.split('@')[1];
        console.log(handle);
        user.getSinglePlayerDetails({Handle : handle} , (err,player) => {
            if(err)
            console.log(err);
            if(player)
            {
                for(s in item)
                {
                    if(s== 'Handle')
                    continue;
                    player.PersonalDetails[s] = item[s];
                }
                console.log(player);
                user.updatePlayer(player,(err,up_res) => {
                    if(err)
                    console.log(player);
                    next(err);
                })
            }
            else
            next(err);
        });
    } , (err) => {
        callback(err);
    });
}

work((err) => {
    if(err)
    console.log(err);
    else
    console.log('Done');
})

