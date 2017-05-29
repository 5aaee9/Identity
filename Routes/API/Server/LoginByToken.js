/**
 * Created by Indexyz on 2017/4/11.
 */
'use strict';
const db = require('mongoose');
const logSchema = require("../../../Db/Schema/Log");
const userSchema = require("../../../Db/Schema/User");
const dbDefine = require("../../../Define/Db").Db;

module.exports.post = (req, res, next) => {
    let logModel = db.model(dbDefine.LOGS_DB, logSchema),
        userModel = db.model(dbDefine.USER_DB, userSchema),
        token = req.body.token,
        ip = req.body.ip,
        message = req.body.message;
    if (!token || !ip || !message){
        res.status(412).send({error: "Precondition Failed"}); return;
    }
    userModel.findOne({"profile.authToken": token}, (err, doc) => {
        if (err){ res.status(500).send({"error": err.message}); return }
        if (!doc){ res.status(401).send({"error": "accessToken is error" }); return }
        new logModel({
            log: message.replace("${player}", doc.username),
            user: doc._id,
            ip: ip,
            type: logSchema.TYPES.SERVER
        }).save(err => {
            if (err) { next(err); return }
            res.send({
                userName: doc.username,
                userID: doc.profile.UserID
            })
        })
    })
};