var problemModel = require('../model/problem')


module.exports.addproblem = (problemDetails , callback) => {
    var newproblem = new problemModel(problemDetails)
    newproblem.save(function (err) {
        callback(err,newproblem)
    })
}

module.exports.updateproblem = (problemDetails , callback) => {
    
    problemModel.findById(problemDetails._id , function (err,problem) {
        if(problemDetails._id)
        {
            delete problemDetails._id
        }
        for(var k in problemDetails)
        {
            problem[k]=problemDetails[k]
        }
        problem.save(function(err) {
            callback(err,problem)
        })
    })
}

module.exports.getAllproblems = (callback) => {
    problemModel.find({},function (err,problems) {
        callback(err,problems)
    })
}

module.exports.getSingleproblemDetails = (query,callback) => {
    problemModel.findOne(query,function (err,problem) {
        callback(err,problem)
    })
}