/**
 * Created by Indexyz on 2017/9/1.
 */
const profileService = require("../../../Db/Service/profileService");

const errors = require("../Errors");

const BIGGEST_FETCH = 10;

module.exports.post = function* (req, res, next) {
    let names = [];

    if (req.body !== "" || req.body !== "{}")
        names = String(req.body).split(",");
    else
        names = [];

    if (names.length >= BIGGEST_FETCH) {
        return errors.makeError(res, errors.ForbiddenOperationBiggestLength);
    }

    let profileSet = new Set([]);
    for (const item of names) {
        const profile = yield profileService.getProfileByUserName(item);
        if (profile !== null) {
            profileSet.add(profileService.getDocment(profile))
        }
    }

    res.send([...profileSet])
};