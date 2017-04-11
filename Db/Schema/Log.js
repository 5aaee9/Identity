'use strict';
const mongoose = require('mongoose');

let LogSchema = mongoose.Schema({
    date: { type: Date, default: Date.now, require: true },
    log: { type: String, require: true },
    user: { type: String, require: true },
    ip: String,
    type: { type: String, require: true }
});

module.exports = LogSchema;

module.exports.TYPES = {
    SERVER: "LoginAtServer",
    CLIENT: "LoginAtClient",
    REFRESH: "ClientRefresh"
};