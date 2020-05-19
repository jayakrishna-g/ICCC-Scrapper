const moongoose = require('mongoose')
const config = require('./config')

module.exports.connect = function() {
    var options = {useUnifiedTopology: true, useNewUrlParser: true}
    moongoose.connect(config.dburl, options)
    var db=moongoose.connection
    db.on('connected' , () => {
        console.log('mongodb connected')
    })
    db.on('disconnected' , () => {
        console.log('mongodb disconnected')
    })
}

module.exports.disconnect = function() {
    moongoose.disconnect();
}