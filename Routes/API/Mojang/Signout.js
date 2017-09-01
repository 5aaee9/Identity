/**
 * Created by Indexyz on 2017/4/11.
 */
"use strict";
const userService = require("../../../Db/Service/userService");
const errors = require("./Errors");

module.exports.post = function* (req, res, next) {
    let {username, password} = req.body;
    const user = yield userService.login(username, password);
    if (!user) {
        return errors.makeError(res, errors.ForbiddenOperationExceptionUserAccount)
    }
    const profile = yield userService.getProfile(user);
    if (!profile) {
        return errors.makeError(res. errors.ForbiddenOperationExceptionUserAccount)
    }

    profile.refresh();
    yield profile.save();
    res.status(204).send()
};