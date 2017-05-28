/**
 * Created by Indexyz on 2017/4/11.
 */
"use strict";
const db = require("mongoose");
const userSchema = require("../../../Db/Schema/User");
const errors = require("./Errors");

module.exports.post = (req, res, next) => {
    let username = req.body.username,
        password = req.body.password,
        userModel = db.model("users", userSchema);

    userModel.findOne({
        email: username,
        password: userSchema.getSaltedPassword(password)
    }, (err, doc) => {
        if (err || !doc) { res.status(403).send(errors.ForbiddenOperationExceptionUserAccount); return }
        doc.refresh();
        doc.save(err => {
            if (err) { res.status(500).send(errors.ServerProblem); return }
            res.status(204).send()
        })
    })
};