/**
 * Created by Indexyz on 2017/9/1.
 */
const profileService = require("../../../Db/Service/profileService");

const errors = require("../Errors");

module.exports.get = function* (req, res, next) {
    const {uuid} = req.params;
    const profile = yield profileService.getProfileByProfileId(uuid);
    if (!profile) {
        return res.send(204);
    }
    res.send(profileService.getDocment(profile));
};