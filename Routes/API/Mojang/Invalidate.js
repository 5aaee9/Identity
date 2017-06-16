/**
 * Created by Indexyz on 2017/4/11.
 */
"use strict";
const profileService = require("../../../Db/Service/profileService");

module.exports.post = (req, res, next) => {
    profileService.invalid(req.body.accessToken, req.body.clientToken, err => {
        res.status(204).send()
    })
};