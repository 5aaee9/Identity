'use strict';

const config = require('../Config');
const mongoose = require('mongoose');

function getUrl() {
    let mongodbUri = 'mongodb://';
    if (!process.env.MONGODB_PORT_27017_TCP_ADDR) {
        if (config.db_auth){
            mongodbUri += `${config.db_username}:${config.db_password}@${config.db_host}:${config.db_port}/${config.db_name}`
        } else {
            mongodbUri += `${config.db_host}:${config.db_port}/${config.db_name}`
        }
    } else {
        if (process.env.MONGODB_USERNAME) {
            mongodbUri += process.env.MONGODB_USERNAME;
            if (process.env.MONGODB_PASSWORD) {
                mongodbUri += ":" + process.env.MONGODB_PASSWORD
            }
            mongodbUri += "@";
        }
        mongodbUri += (process.env.MONGODB_PORT_27017_TCP_ADDR || '1.2.3.4')
            + ":" + (process.env.MONGODB_PORT_27017_TCP_PORT || 27017)
            + '/' + (process.env.MONGODB_INSTANCE_NAME || 'test');
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