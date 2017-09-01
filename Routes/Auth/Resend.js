/**
 * Created by Indexyz on 2017/4/10.
 */
"use strict";

const userService = require("../../Db/Service/userService");

module.exports.get = function* (req, res, next) {
    let email = req.query.mail;

    if (!email) { res.redirect("/auth/register"); return }

    const user = yield userService.foundByEmail(email);

    if (!user) { return res.redirect("/auth/register") }
    if (!user.emailToken) { return res.redirect("/") }

    yield user.sendCodeMail(req.protocol + "://" + req.get("host"));
    res.render("auth/mailed", {
        "mail": user.email
    })
};