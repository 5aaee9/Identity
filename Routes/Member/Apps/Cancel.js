/**
 * Created by Indexyz on 2017/5/14.
 */
'use strict';

const db = require('mongoose');
const dbName = require('../../../Define/Db');
const userAuth = require('../../../Db/Schema/UserAuth');

let userAuthModel = db.model(dbName.Db.APP_USER_DB, userAuth);

module.exports.get = (req, res, next) => {
    let appId = req.params["appId"];
    userAuthModel.findOne({
        _id: appId
    }, (err, doc) => {
        if (err) { return next(err) }
        userAuthModel.remove({
            _id: appId
        }, err => {
            if (err) { return next(err) }
            res.redirect('/member/apps')
        })
    })
};