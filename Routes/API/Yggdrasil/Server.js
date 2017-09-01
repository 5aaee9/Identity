const profileService = require("../../../Db/Service/profileService");

const errors = require("../Mojang/Errors");

module.exports.joinserver = function* (req, res, next) {
    let {accessToken, selectedProfile, serverId} = req.body,
        server = "Unknown" || req.params["server"];

    const profile = yield profileService.getProfileByProfileId(selectedProfile);

    if (!profile || profile.accessToken !== accessToken) return errors.makeError(res, errors.ForbiddenOperationExceptionUserAccount);

    const msg = yield req.db.redis.setAsync(serverId, selectedProfile);
    yield profileService.loginServer(profile, "${player} joined " + server + " Server", req.headers['x-forwarded-for'] || req.ip)
    res.status(204).send()
};

module.exports.hasjoinserver = function* (req, res, next) {
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