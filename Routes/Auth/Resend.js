/**
 * Created by Indexyz on 2017/4/10.
 */
'use strict';

const db = require("mongoose");
const userSchema = require('../../Db/Schema/User');

module.exports.get = (req, res, next) => {
    let email = req.query.mail;
    if (!email) { res.redirect("/auth/register"); return }
    let userModel = db.model('users', userSchema);
    userModel.findOne({
        email: email
    }, (err, doc) => {
        if (!doc.emailToken) { res.redirect("/"); return }
        if (err) { res.redirect("/auth/register"); return }
        doc.sendMail(req.protocol + '://' + req.get('host'), err => {
            if (err) { res.redirect("/auth/register"); return }
            res.render("auth/mailed", {
                "mail": doc.email
            })
        })
    })
};