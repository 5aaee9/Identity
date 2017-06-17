const profileService = require("../../../Db/Service/profileService");
const Promise = require('bluebird');


module.exports.username2uuid = (req, res, next) => {
    profileService.getProfileByUserName(req.params["userName"], profile => {
        if (!profile) return res.status(204).send();
        res.send({
            id: profile.ProfileID,
            name: profile.UserName
        })
    })
};

module.exports.uuid2username = (req, res, next) => {
    profileService.getProfileByProfileId(req.params["uuid"], profile => {
        if (!profile) return res.status(204).send();
        res.send([
            {
                name: profile.UserName
            }
        ].concat(profile.userNameHistory))
    });
};

module.exports.name2uuids = (req, res, next) => {
    let names = [];

    if (req.body !== "" || req.body !== "{}")
        names = String(req.body).split(",");
    else
        names = [];

    function makePromise(username) {
        return new Promise(resolve => {
            profileService.getProfileByUserName(username, profile => {
                if (profile) {
                    resolve({
                        id: profile.ProfileID,
                        name: profile.UserName,
                        legacy: true
                    })
                } else {
                    resolve()
                }
            })
        })
    }

    Promise.all(names.map(item => makePromise(item)))
        .then(data => {
            return Promise.filter(data, item => {
                return Boolean(item)
            })
        })
        .then(data => {
            res.send(data)
        })
};