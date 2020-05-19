const moongoose = require('mongoose')
const problemschema = new moongoose.Schema({
    ContestID : String,
    StartTime : String,
    EndTime : String,
    Link : String
})
module.exports = moongoose.model('problems',problemschema)