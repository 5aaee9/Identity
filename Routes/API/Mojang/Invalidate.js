/**
 * Created by Indexyz on 2017/4/11.
 */
"use strict";
const profileService = require("../../../Db/Service/profileService");

module.exports.post = function* (req, res, next) {
    const {accessToken, clientToken} = req.body;
    yield profileService.invalid(accessToken, clientToken);
    res.status(204).send()
};