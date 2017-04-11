/**
 * Created by Indexyz on 2017/4/11.
 */
'use strict';
const db = require("mongoose");
const userSchema = require('../../../Db/Schema/User');
const errors = require("./Errors");

module.exports.post = (req, res, next) => {
    let token = req.body.accessToken,
        uuid = req.body.clientToken,
        userModel = db.model('users', userSchema);
    userModel.findOne(uuid ? {
        "profile.UUID": uuid,
        "profile.Token": token
    } : { "profile.Token": token }, (err, doc) => {
        if (err || !doc) { res.status(403).send(errors.ForbiddenOperationExceptionUserToken) }
        res.status(204).send();
    })
};