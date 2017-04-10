/**
 * Created by Indexyz on 2017/4/10.
 */
'use strict';
const db = require("mongoose");
const mail = require('../../Utils/Mail');
const userSchema = require("../../Db/Schema/User");

module.exports.get = (req, res, next) => {
    res.render("auth/register")
};

module.exports.post = (req, res, next) => {
    let username = req.body.username,
        password = req.body.password,
        email    = req.body.email;
    if (!username && !password && !email) { res.render("auth/register", {"e": "请填写全部的信息"}); return; }
    if (username.length < 3
        || !/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email.toString())
        || password.length < 6) {
        res.render("auth/register", {"e": "数据检验出错"}); return;
    }
    let userModel = db.model('users', userSchema);
    let user = new userModel({
        username: username,
        password: password,
        email: email
    });
    user.generatorEmailToken();
    user.generatorID();
    user.refresh();
    user.refreshSession();
    user.save(err => {
        if (err){ res.render("auth/register", {"e": err.message}); return; }
        user.sendMail(req.protocol + '://' + req.get('host'), err => {
            if (err){ res.render("auth/register", {"e": err.message}); return; }
            res.render("auth/mailed", {
                "mail": user.email
            })
        })
    })
};