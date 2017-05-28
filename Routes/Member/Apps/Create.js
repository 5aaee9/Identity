/**
 * Created by Indexyz on 2017/5/14.
 */
const db = require("mongoose");
const apps = require("../../../Db/Schema/Application");
const dbEnum = require("../../../Define/Db");
const stringHelper = require("../../../Utils/String");
module.exports.get = (req, res, next) => {
    res.render("member/apps/create", {
        e: req.query.e
    })
};

module.exports.post = (req, res, next) => {
    console.log(req.body);
    let appName = req.body["appname"],
        homepage = req.body["homepage"],
        callback = req.body["callback"],
        appModel = db.model(dbEnum.Db.APPS_DB, apps);
    if (appName == ""){ return res.render("member/apps/create", { e: "应用名未填写" }) }
    appModel.findOne({
        name: appName
    }, (err, doc) => {
        if (err || doc) { return res.render("member/apps/create", { e: "应用名重复"}) }
        let app = new appModel({
            name: appName,
            homePage: homepage,
            redirectUri: callback,
            owner: req.session.user._id,
            client_id: stringHelper.randomString(32),
            client_secret: stringHelper.randomString(64)
        });
        app.save(err => {
            if (err) { return next(err) }
            res.redirect("/member/apps?success=" + encodeURIComponent("创建应用"))
        })
    })

};