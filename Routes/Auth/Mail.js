/**
 * Created by Indexyz on 2017/4/10.
 */
'use strict';

const db = require("mongoose");
const userSchema = require('../../Db/Schema/User');

module.exports.get = (req, res, next) => {
    let code = req.query.code;
    if (!code) { res.redirect("/"); return }
    let userModel = db.model('users', userSchema);
    // console.log(code);
    userModel.findOne({ "emailToken": code }, (err, doc) => {
        if (!doc || err) { res.redirect("/"); return }
        doc.emailToken = "";
        doc.save();
        return res.redirect("/auth/login?info=%E9%82%AE%E7%AE%B1%E9%AA%8C%E8%AF%81%E6%88%90%E5%8A%9F%20%E8%AF%B7%E7%99%BB%E9%99%86");
    })
};