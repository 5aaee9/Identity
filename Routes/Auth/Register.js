/**
 * Created by Indexyz on 2017/4/10.
 */
"use strict";
const userService = require("../../Db/Service/userService");

module.exports.get = (req, res, next) => {
    res.render("auth/register")
};

module.exports.post = function* (req, res, next) {
    let {username, password, email} = req.body;

    if (!username && !password && !email) { res.status(401).render("auth/register", {"e": "请填写全部的信息"}); return; }
    if (username.length < 3
        || !/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email.toString())
        || password.length < 6) {
        res.status(401).render("auth/register", {"e": "数据检验出错"}); return;
    }

    try {
        const user = yield userService.create(username, email, password);
        yield user.sendCodeMail(req.protocol + "://" + req.get("host"));
        res.render("auth/mailed", {
            "mail": user.email
        })
    } catch (err){
        if (err){ return res.render("auth/register", {"e": err.message}); }
    }
};