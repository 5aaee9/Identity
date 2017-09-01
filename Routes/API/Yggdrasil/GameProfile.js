const profileService = require("../../../Db/Service/profileService");
const Promise = require('bluebird');


module.exports.username2uuid = function* (req, res, next) {
    const profile = yield profileService.getProfileByUserName(req.params["userName"]);
    if (!profile) return res.status(204).send();
    res.send({
        id: profile.ProfileID,
        name: profile.UserName
    })
};

module.exports.uuid2username = function* (req, res, next) {
    const profile = yield profileService.getProfileByProfileId(req.params["uuid"]);

    if (!profile) return res.status(204).send();
    res.send([
        {
            name: profile.UserName
        }
    ].concat(profile.userNameHistory))
};

module.exports.name2uuids = function* (req, res, next) {
    let names = [];

    if (req.body !== "" || req.body !== "{}")
        names = String(req.body).split(",");
    else
        names = [];

    let profileSet = new Set([]);
    for (const item of names) {
        const profile = yield profileService.getProfileByUserName(item);
        if (profile) {
            profileSet.add({
                id: profile.ProfileID,
                name: profile.UserName,
                legacy: true,
            })
        }
    }

    res.send([...profileSet])
};