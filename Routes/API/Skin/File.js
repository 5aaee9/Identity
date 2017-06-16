/**
 * Created by Indexyz on 2017/4/15.
 */
'use strict';
const db = require('mongoose');
const grid = require('gridfs-stream');

const profileService = require("../../../Db/Service/profileService");
const userService = require("../../../Db/Service/userService");

grid.mongo = db.mongo;

module.exports.get = (req, res, next) => {
    if (!req.params.fileId || req.params.fileId === "undefined"){
        return res.sendStatus(404);
    }
    res.redirect('/resources/' + req.params.fileId)
};

let getSkin = (username, func) => {

    profileService.getProfileByUserName(username, profile => {
        if (!profile) { return func(new Error("user not found")) }
        userService.getProfileOwner(profile._id, user => {
            func(null, user.skin)
        })
    });
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