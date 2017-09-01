/**
 * Created by Indexyz on 2017/4/11.
 */
"use strict";
const profileService = require("../../../Db/Service/profileService");
const errors = require("./Errors");

module.exports.post = function* (req, res, next) {
    let {accessToken, clientToken} = req.body;

    const profile = yield profileService.getProfile(accessToken, clientToken);
    if (!profile) return errors.makeError(res, errors.ForbiddenOperationExceptionUserToken);
    res.status(204).send()
};