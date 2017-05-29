"use strict";

const configFile = require('../Config');
const mongoose = require('mongoose');

function getUrl(config) {
    if (!config) config = configFile;
    let mongodbUri = 'mongodb://';
    if (config.db_auth){
        mongodbUri += `${config.db_username}:${config.db_password}@${config.db_host}:${config.db_port}/${config.db_name}`
    } else {
        mongodbUri += `${config.db_host}:${config.db_port}/${config.db_name}`
    }
    return mongodbUri
}

function connect(func) {
    mongoose.connect(getUrl());
    let db = mongoose.connection;
    db.once('open', () => {
        func(db)
    })
}

module.exports = connect;
module.exports.getUrl = getUrl;
