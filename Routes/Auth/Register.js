/**
 * Created by Indexyz on 2017/4/10.
 */
"use strict";
const userService = require("../../Db/Service/userService");

module.exports.get = (req, res, next) => {
    if (process.env['DISABLE_REGISTER'] === 'true'){
        return res.status(403).render("auth/disable");
    }

    res.render("auth/register")
};

module.exports.post = (req, res, next) => {
    let username = req.body.username,
        password = req.body.password,
        email    = req.body.email;

    if (process.env['DISABLE_REGISTER'] === 'true'){
        return res.status(403).render("auth/disable");
    }

    if (!username && !password && !email) { res.status(401).render("auth/register", {"e": "请填写全部的信息"}); return; }
    if (username.length < 3
        || !/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email.toString())
        || password.length < 6) {
        res.status(401).render("auth/register", {"e": "数据检验出错"}); return;
    }

    userService.create(username, email, password, (err, user) => {
        if (err){ res.render("auth/register", {"e": err.message}); return; }
        user.sendCodeMail(req.protocol + "://" + req.get("host"), err => {
            if (err){ res.render("auth/register", {"e": err.message}); return; }
            res.render("auth/mailed", {
                "mail": user.email
            })
        })
    })
};