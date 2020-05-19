var playerModel = require('../model/player')


module.exports.addPlayer = (playerDetails , callback) => {
    var newPlayer = new playerModel(playerDetails)
    newPlayer.save(function (err) {
        callback(err,newPlayer)
    })
}

module.exports.updatePlayer = (playerDetails , callback) => {
    
    playerModel.findById(playerDetails._id , function (err,player) {
        if(playerDetails._id)
        {
            delete playerDetails._id
        }
        for(var k in playerDetails)
        {
            player[k]=playerDetails[k]
        }
        player.save(function(err) {
            callback(err,player)
        })
    })
}

module.exports.getAllPlayers = (callback) => {
    playerModel.find({},function (err,players) {
        callback(err,players)
    })
}

module.exports.getSinglePlayerDetails = (query,callback) => {
    playerModel.findOne(query,function (err,player) {
        callback(err,player)
    })
}