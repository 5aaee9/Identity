/**
 * Created by Indexyz on 2017/4/15.
 */
'use strict';
const db = require('mongoose');
const grid = require('gridfs-stream');

const profileService = require("../../../Db/Service/profileService");
const userService = require("../../../Db/Service/userService");

const DEFAULT_SKIN = "https://public.hyperworld.xyz/Gamer/Minecraft/public.png"

grid.mongo = db.mongo;

module.exports.get = (req, res, next) => {
    if (!req.params.fileId || req.params.fileId === "undefined"){
        return res.status(404).send();
    }
    res.redirect('/resources/' + req.params.fileId)
};

function* getSkin(username) {
    const profile = yield profileService.getProfileByUserName(username);
    if (!profile) { throw new Error("user not found") }
    const user = yield userService.getProfileOwner(profile._id);
    return user.skin
}

module.exports.getSkin = function* (req, res, next) {
    try {
        const skin = yield getSkin(req.params.username);
        res.redirect('/resources/' + skin.skin)
    } catch (err) {
        return res.sendStatus(404)
    }
};

module.exports.getSkinByUUID = function* (req, res, next) {
    const profile = yield profileService.getProfileByProfileId(req.params.profileId)

    if (!profile){
        res.redirect(DEFAULT_SKIN)
    } else {
        const user = yield userService.getProfileOwner(profile._id);

        if (!user.skin.skin){
            return res.redirect(DEFAULT_SKIN)
        }
        const gfs = grid(db.connection.db);
        gfs.exist({
            _id: db.Types.ObjectId(user.skin.skin)
        }, (err, found) => {
            if (!found || err) { res.status(404).send(); return }
            // res.setHeader("Content-disposition", "attachment;");
            gfs.createReadStream({
                _id: db.Types.ObjectId(user.skin.skin)
            }).pipe(res);
        })
    }
};

module.exports.getCup = function* (req, res, next) {
    try {
        const skin = yield getSkin(req.params.username);
        res.redirect('/resources/' + skin.cap)
    } catch (err) {
        return res.sendStatus(404)
    }
};