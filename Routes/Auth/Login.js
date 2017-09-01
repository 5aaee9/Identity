/**
 * Created by Indexyz on 2017/4/10.
 */
"use strict";
/**
 * Created by Indexyz on 2017/4/7.
 */
const db = require("mongoose");
const userSchema = require("../../Db/Schema/User");
const userService = require("../../Db/Service/userService");

let userModel = db.model(require('../../Define/Db').Db.USER_DB, userSchema);


module.exports.get = (req, res, next) => {
    res.render("auth/login", {
        "info": req.query.info
    })
};

module.exports.post = function* (req, res, next)  {
    let {email, password} = req.body;

    if (!email || !password) { res.render("auth/login", {"e": "请填写全部的信息"}); return }

    const user = yield userService.login(email, password);

    if (!user) { return res.render("auth/login", {"e": "用户名或密码错误"}); }
    req.session.user = user;
    if (!req.query.redirect){
        res.redirect("/")
    } else {
        res.redirect(req.query.redirect)
    }
};