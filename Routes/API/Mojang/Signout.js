/**
 * Created by Indexyz on 2017/4/11.
 */
"use strict";
const userService = require("../../../Db/Service/userService");
const errors = require("./Errors");

module.exports.post = (req, res, next) => {
    let username = req.body.username,
        password = req.body.password;

    userService.login(username, password, (err, user) => {
        if (!user) { return errors.makeError(res, errors.ForbiddenOperationExceptionUserAccount) }
        userService.getProfile(user, profile => {
            profile.refresh();
            profile.save(err => {
                if (err) { return errors.makeError(res, errors.ServerProblem) }
                res.status(204).send()
            })
        })
    })

};