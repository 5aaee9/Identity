/**
 * Created by Indexyz on 2017/4/15.
 */
'use strict';
const db = require('mongoose');
const userSchema = require('../../../Db/Schema/User');
const grid = require('gridfs-stream');

grid.mongo = db.mongo;

module.exports.get = (req, res, next) => {
    let gfs = grid(db.connection.db);
    if (!req.params.fileId || req.params.fileId === "undefined"){
        return res.sendStatus(404);
    }
    gfs.exist({
        _id: db.Types.ObjectId(req.params.fileId)
    }, (err, found) => {
        if (!found || err) { res.status(404).send(); return }
        // res.setHeader('Content-disposition', 'attachment;');

        gfs.createReadStream({
            _id: db.Types.ObjectId(req.params.fileId)
        }).pipe(res);
    })
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
        res.redirect('/api/skin/textures/' + doc.skin)
    })
};

module.exports.getCup = (req, res, next) => {
    getSkin(req.params.username, (err, doc) => {
        if (err) { return res.sendStatus(404) }
        res.redirect('/api/skin/textures/' + doc.cap)
    })
};