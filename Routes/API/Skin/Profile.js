/**
 * Created by Indexyz on 2017/4/15.
 */
'use strict';

const profileService = require("../../../Db/Service/profileService");
const userService = require("../../../Db/Service/userService");

module.exports.get = (req, res, next) => {
    let username = req.params.username;
    profileService.getProfileByUserName(username, profile => {
        if (!profile) { return res.status(401).send({"errno": "1", "msg": "User not found."}) }
        userService.getProfileOwner(profile._id, user => {
            res.send({
                player_name: profile.UserName,
                last_update: user.skin ? undefined : user.skin.lastUpdate.getTime(),
                model_preference: ["default", "cape", user.skin.slim ? "slim" : null].filter(item => item !== null),
                skins: {
                    "default": user.skin.skin,
                    slim: user.skin.slim,
                    cap: user.skin.cap,
                },
                cap: user.skin.cap
            })
        })
    })
};