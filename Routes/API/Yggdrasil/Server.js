const profileService = require("../../../Db/Service/profileService");

const errors = require("../Mojang/Errors");

module.exports.joinserver = (req, res, next) => {
    let accessToken = req.body.accessToken,
        selectedProfile = req.body.selectedProfile,
        serverId = req.body.serverId,
        server = "Unknown" || req.params["server"];
    profileService.getProfileByProfileId(selectedProfile, profile => {
        if (!profile || profile.accessToken !== accessToken) return errors.makeError(res, errors.ForbiddenOperationExceptionUserAccount);
        req.db.redis.set(serverId, selectedProfile, (err, msg) => {
            profileService.loginServer(profile, "${player} joined " + server + " Server", req.headers['x-forwarded-for'] || req.ip, () => {
                res.status(204).send()
            })
        })
    })
};

module.exports.hasjoinserver = (req, res, next) => {
    req.db.redis.get(req.query.serverId, (err, reply) => {
        if (err || !reply) { return res.status(204).send() }
        profileService.getProfileByProfileId(reply, profile => {
            if (profile.UserName !== req.query.username ) { return res.status(204).send() }
            if (!profile) { return res.status(204).send() }
            res.send({
                id: profile.ProfileID,
                name: profile.UserName
            })
        })
    });

};