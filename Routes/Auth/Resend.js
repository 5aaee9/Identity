/**
 * Created by Indexyz on 2017/4/10.
 */
"use strict";

const userService = require("../../Db/Service/userService");

module.exports.get = (req, res, next) => {
    let email = req.query.mail;

    if (!email) { res.redirect("/auth/register"); return }

    userService.foundByEmail(email, (err, user) => {
        if (!user) { return res.redirect("/auth/register") }
        if (!user.emailToken) { return res.redirect("/") }
        if (err) { return res.redirect("/auth/register") }

        user.sendCodeMail(req.protocol + "://" + req.get("host"), err => {
            res.render("auth/mailed", {
                "mail": user.email
            })
        })
    })
};