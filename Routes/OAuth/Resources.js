/**
 * Created by Indexyz on 2017/5/1.
 */

const makeError = require("./Error");
const typeEnum = require("../../Define/OAuth").scope;
const dbEnum = require("../../Define/Db").Db;
const db = require("mongoose");
const userSchema = require("../../Db/Schema/User");
const appSchema = require("../../Db/Schema/Application");
const userAuthSchema = require("../../Db/Schema/UserAuth");
const fs = require("fs");
const stringUtils = require("../../Utils/String");
const Gridfs = require("gridfs-stream");

let gfs = new Gridfs(db.connection.db, db.mongo);
let userModel = db.model(dbEnum.USER_DB, userSchema),
    appModel = db.model(dbEnum.APPS_DB, appSchema),
    userAuthModel = db.model(dbEnum.APP_USER_DB, userAuthSchema);

module.exports.get = (req, res, next) => {
    if (req.resType === typeEnum.GET_LOGIN){
        userModel.findOne({
            _id: req.doc.user
        }, (err, user) => {
            if (err || !user) { return makeError(res, makeError.Types.INVALID_TOKEN) }
            return res.send(user.profile)
        })
    } else {
        return makeError(res, makeError.Types.INVALID_REQUEST)
    }

};


module.exports.upload = (req, res, next) => {
    let writeStream = gfs.createWriteStream({
        filename: stringUtils.randomString(10) + ".png",
        mode: "w"
    });

    writeStream.on("close", file => {
        if (file.length >= 1024 * 64) {
            gfs.remove({
                _id: file._id
            }, err => {
                res.status(406).send({
                    error: "Body too big"
                })
            })
        } else {
            userModel.findOne({
                _id: req.doc.user
            }, (err, doc) => {
                if (err || !doc) { return makeError(res, makeError.Types.INVALID_REQUEST) }
                doc.skin[req.skinType] = file._id;
                doc.save(err => {
                    if (err) { return makeError(res, makeError.Types.SERVER_ERROR) }
                    res.status(204).send()
                })
            })
        }
    });

    req.pipe(writeStream);
};