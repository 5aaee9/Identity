/**
 * Created by Indexyz on 2017/4/10.
 */
'use strict';
/**
 * Created by Indexyz on 2017/4/7.
 */
const db = require("mongoose");
const userSchema = require("../../Db/Schema/User");

module.exports.get = (req, res, next) => {
    res.render("auth/login", {
        "info": req.query.info
    })
};

module.exports.post = (req, res, next) => {
    let username = req.body.username,
        password = req.body.password,
        userModel = db.model('users', userSchema);

    if (!username || !password) { res.render("auth/login", {"e": "请填写全部的信息"}); return }

    console.log(username); console.log(password);
    userModel.findOne({
        username: username,
        password: userSchema.getSaltedPassword(password)
    }, (err, doc) => {
        if (err || !doc) { res.render("auth/login", {"e": "用户信息未找到"}); return }
        req.session.user = doc;
        if (!req.query.redirect){
            res.redirect("/")
        } else {
            res.redirect(req.query.redirect)
        }
    })
};