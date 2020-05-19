const moongoose = require('mongoose')

let PersonalDetails = new moongoose.Schema({
    Name : String,
    RollNumber : String,
    College: String,
    Stream : String,
    YearofStudy : String,
    Email : String
} , {_id : false});

let ProblemSchema = new moongoose.Schema({
    PID : String,
    Score : String,
    TimeTaken : String
} , {_id : false});

let ContestDetails = new moongoose.Schema({
    ContestID : String ,
    Rank : Number,
    Problems : [ProblemSchema],
    Score : Number ,
    Rating : Number ,
    Volatility : Number,
} , {_id : false});

let playerschema = new moongoose.Schema({
    Handle : String,
    PersonalDetails : PersonalDetails,
    ContestDetails : [ContestDetails],
    Deleted : Boolean
});


module.exports = moongoose.model('player',playerschema)