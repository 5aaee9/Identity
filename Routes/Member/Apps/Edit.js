/**
 * Created by Indexyz on 2017/5/21.
 */
const db = require('mongoose');
const apps = require('../../../Db/Schema/Application');
const dbEnum = require('../../../Define/Db');
const userAuth = require('../../../Db/Schema/UserAuth');

let appModel = db.model(dbEnum.Db.APPS_DB, apps),
    userAuthModel = db.model(dbEnum.Db.APP_USER_DB, userAuth);

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

module.exports.post = (req, res, next) => {
    console.log(req.file)
    res.send("1")
};