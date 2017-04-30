/**
 * Created by Indexyz on 2017/4/15.
 */
'use strict';
const db = require('mongoose');
const userSchema = require('../../../Db/Schema/User');
const grid = require('gridfs-stream');

grid.mongo = db.mongo;

module.exports.get = (req, res, next) => {
    if (!req.params.fileId || req.params.fileId === "undefined"){
        return res.sendStatus(404);
    }
    res.redirect('/resources/' + req.params.fileId)
};

let getSkin = (username, func) => {
    let userModel = db.model('users', userSchema);
    userModel.findOne({
        username: username
    }, (err, doc) => {
        func(err, doc.skin)
    })
};

module.exports.getSkin = (req, res, next) => {
    getSkin(req.params.username, (err, doc) => {
        if (err) { return res.sendStatus(404) }
        res.redirect('/resources/' + doc.skin)
    })
};

module.exports.getCup = (req, res, next) => {
    getSkin(req.params.username, (err, doc) => {
        if (err) { return res.sendStatus(404) }
        res.redirect('/resources/' + doc.cap)
    })
};