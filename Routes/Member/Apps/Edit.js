/**
 * Created by Indexyz on 2017/5/21.
 */
const db = require('mongoose');
const apps = require('../../../Db/Schema/Application');
const dbEnum = require('../../../Define/Db');
const userAuth = require('../../../Db/Schema/UserAuth');
const grid = require('gridfs-stream');
const fs = require("fs");

let appModel = db.model(dbEnum.Db.APPS_DB, apps),
    userAuthModel = db.model(dbEnum.Db.APP_USER_DB, userAuth);

grid.mongo = db.mongo;
let gfs = grid(db.connection.db);

module.exports.get = (req, res, next) => {
    let appId = req.params["appId"];
    appModel.findOne({
        _id: appId
    }, (err, doc) => {
        userAuthModel.count({
            app: appId
        }, (err, count) => {
            if (err || !doc) { res.redirect("/member/apps") }
            res.render('member/apps/edit', {
                app: doc,
                userCount: count
            })
        })
    })
};


let uploadFile = (file, func) => {
    let writeStream = gfs.createWriteStream({
        filename: file.filename + ".png",
        mode: 'w',
        content_type: file.mimetype
    });
    writeStream.on('close', filen => {
        fs.unlink(file.path, err => {
            func(err, filen)
        })
    });
    fs.createReadStream(file.path).pipe(writeStream);
};

module.exports.post = (req, res, next) => {
    let appName = req.body["appname"],
        homepage = req.body["homepage"],
        callback = req.body["callback"],
        appId = req.params["appId"];

    let _event = fileId => {
        appModel.findOne({
            _id: appId,
            owner: req.session.user._id
        }, (err, doc) => {
            if (err || !doc) { return res.redirect("/member/apps") }
            doc.image = fileId;
            doc.name = appName;
            doc.homePage = homepage;
            doc.redirectUri = callback;
            doc.save(err => {
                if (err) { return next(err) }
                res.redirect("/member/apps?success=" + encodeURIComponent("修改成功: " + doc.name))
            });
        })
    };

    if (req.file) {
        uploadFile(req.file, (err, file) => {
            _event(file._id)
        })
    } else {
        _event()
    }
};