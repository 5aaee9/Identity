const profileService = require("../../../Db/Service/profileService");



const db = require("mongoose");
const userSchema = require("../../../Db/Schema/User");
const DbDefine = require("../../../Define/Db").Db;
const errors = require("../Mojang/Errors");


let userModel = db.model(DbDefine.USER_DB, userSchema);

module.exports.joinserver = (req, res, next) => {
    let accessToken = req.body.accessToken,
        selectedProfile = req.body.selectedProfile,
        serverId = req.body.serverId;

    profileService.getProfileByProfileId(selectedProfile, profile => {
        if (!profile || profile.accessToken !== accessToken) return errors.makeError(res, errors.ForbiddenOperationExceptionUserAccount)
        req.db.redis.set(serverId, selectedProfile, (err, msg) => {
            res.status(204).send()
        })
    })
};

module.exports.hasjoinserver = (req, res, next) => {
    req.db.redis.get(req.query.serverId, (err, reply) => {
        if (err) { return res.status(204).send() }
        profileService.getProfileByProfileId(reply, profile => {
            if (!profile) { return res.status(204).send() }
            res.send({
                id: profile.accessToken,
                name: profile.UserName
            })
        })
    });

};