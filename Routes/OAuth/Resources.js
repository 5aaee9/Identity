/**
 * Created by Indexyz on 2017/5/1.
 */

const makeError = require('./Error');
const typeEnum = require('../../Define/OAuth').scope;
const dbEnum = require('../../Define/Db').Db;
const db = require('mongoose');
const userSchema = require('../../Db/Schema/User');
const appSchema = require('../../Db/Schema/Application');
const userAuthSchema = require('../../Db/Schema/UserAuth');
const grid = require('gridfs-stream');
const fs = require("fs");

let userModel = db.model(dbEnum.USER_DB, userSchema),
    appModel = db.model(dbEnum.APPS_DB, appSchema),
    userAuthModel = db.model(dbEnum.APP_USER_DB, userAuthSchema),

    gfs = grid(db.connection.db, db);

module.exports.get = (req, res, next) => {
    if (req.resType === typeEnum.GET_LOGIN){
        userSchema.findOne({
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
        filename: req.file.filename + ".png",
        mode: 'w',
        content_type: req.file.mimetype
    });
    writeStream.on('close', filen => {
        fs.unlink(req.file.path, err => {
            if (err) { return makeError(req, makeError.Types.SERVER_ERROR) }
            userModel.findOne({
                _id: req.doc.user
            }, (err, doc) => {
                if (err || !doc) { return makeError(res, makeError.Types.INVALID_TOKEN) }
                let actions = {
                    "cap": () => { doc.skin.cap = filen._id },
                    "skin": () => { doc.skin.skin = filen._id },
                    "slim": () => { doc.skin.slim = filen._id }
                };
                actions[req.skinType]();
                doc.save(err => {
                    if (err) { return makeError(res, makeError.Types.SERVER_ERROR) }
                    res.status(204).send()
                })
            })
        })
    });
    fs.createReadStream(req.file.path).pipe(writeStream);
};