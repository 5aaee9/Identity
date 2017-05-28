/**
 * Created by Indexyz on 2017/5/21.
 */

const db = require("mongoose");
const apps = require("../../../Db/Schema/Application");
const dbEnum = require("../../../Define/Db");
const userAuth = require("../../../Db/Schema/UserAuth");

let appModel = db.model(dbEnum.Db.APPS_DB, apps),
    userAuthModel = db.model(dbEnum.Db.APP_USER_DB, userAuth);

module.exports.get = (req, res, next) => {
    let appId = req.params["appId"];
    appModel.remove({
        _id: appId,
        owner: req.session.user._id
    }, err => {
        if (err) { return next(err) }
        userAuthModel.remove({
            app: appId
        }, err => {
            if (err) { return next(err) }
            res.redirect("/member/apps?success=" + encodeURIComponent("删除成功"))
        })
    })
};