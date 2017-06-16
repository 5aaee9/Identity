/**
 * Created by Indexyz on 2017/4/11.
 */
"use strict";
const profileService = require("../../../Db/Service/profileService");
const errors = require("./Errors");

module.exports.post = (req, res, next) => {
    let accessToken = req.body.accessToken,
        clientToken = req.body.clientToken;

    profileService.getProfile(accessToken, clientToken, profile => {
        if (!profile) return errors.makeError(res, errors.ForbiddenOperationExceptionUserToken)
        res.status(204).send()
    })
};