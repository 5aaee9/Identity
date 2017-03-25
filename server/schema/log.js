var mongoose = require('mongoose');

var LogSchema = mongoose.Schema({
    date: { type: Date, default: Date.now, require: true },
    log: { type: String, require: true },
    user: { type: String, require: true },
    ip: String
})

module.exports = LogSchema