const moongoose = require('mongoose')
const problemschema = new moongoose.Schema({
    ProblemID : Number,
    ContestID : String,
    Slug : String,
    Name : String,
    Accuracy : String,
    Score : Number
})
module.exports = moongoose.model('problems',problemschema)