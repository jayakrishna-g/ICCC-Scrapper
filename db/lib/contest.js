var contestModel = require('../model/contest')


module.exports.addcontest = (contestDetails , callback) => {
    var newcontest = new contestModel(contestDetails)
    newcontest.save(function (err) {
        callback(err,newcontest)
    })
}

module.exports.updatecontest = (contestDetails , callback) => {
    
    contestModel.findById(contestDetails._id , function (err,contest) {
        if(contestDetails._id)
        {
            delete contestDetails._id
        }
        for(var k in contestDetails)
        {
            contest[k]=contestDetails[k]
        }
        contest.save(function(err) {
            callback(err,contest)
        })
    })
}

module.exports.getAllcontests = (callback) => {
    contestModel.find({},function (err,contests) {
        callback(err,contests)
    })
}

module.exports.getSinglecontestDetails = (query,callback) => {
    contestModel.findOne(query,function (err,contest) {
        callback(err,contest)
    })
}