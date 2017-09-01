/**
 * Created by Indexyz on 2017/9/1.
 */

const profileService = require("../../../Db/Service/profileService");

const errors = require("../Errors");

module.exports.post = function* (req, res, next) {
    let {accessToken, selectedProfile, serverId} = req.body,
        server = "Unknown" || req.params["server"];

    const profile = yield profileService.getProfileByProfileId(selectedProfile);

    if (!profile || profile.accessToken !== accessToken) {
        return errors.makeError(res, errors.ForbiddenOperationExceptionUserAccount);
    }

    const msg = yield req.db.redis.setAsync(serverId, selectedProfile);
    yield profileService.loginServer(profile, "${player} joined " + server + " Server", req.headers['x-forwarded-for'] || req.ip);
    res.status(204).send()
};
