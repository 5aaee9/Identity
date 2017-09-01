/**
 * Created by Indexyz on 2017/9/1.
 */
const profileService = require("../../../Db/Service/profileService");

const errors = require("../Errors");

module.exports.get = function* (req, res, next) {
    const reply = yield req.db.redis.getAsync(req.query.serverId);
    if (!reply) { return res.status(204).send() }
    const profile = yield profileService.getProfileByProfileId(reply);

    if (profile.UserName !== req.query.username ) { return res.status(204).send() }
    if (!profile) { return res.status(204).send() }
    res.send({
        id: profile.ProfileID,
        name: profile.UserName
    })
};