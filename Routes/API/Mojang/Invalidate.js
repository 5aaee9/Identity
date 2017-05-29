/**
 * Created by Indexyz on 2017/4/11.
 */
"use strict";
const db = require("mongoose");
const userSchema = require("../../../Db/Schema/User");

module.exports.post = (req, res, next) => {
    let token = req.body.accessToken,
        uuid = req.body.clientToken,
        userModel = db.model("users", userSchema);
    userModel.findOne({
        "profile.UUID": uuid,
        "profile.Token": token
    }, (err, doc) => {
        if (!doc || err) { return res.status(204).send() }
        doc.refresh();
        doc.refresh();
        doc.save(err => {
            res.status(204).send()
        })
    })
};