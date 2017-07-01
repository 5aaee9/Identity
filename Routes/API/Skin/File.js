/**
 * Created by Indexyz on 2017/4/15.
 */
'use strict';
const db = require('mongoose');
const grid = require('gridfs-stream');

const profileService = require("../../../Db/Service/profileService");
const userService = require("../../../Db/Service/userService");

grid.mongo = db.mongo;

module.exports.get = (req, res, next) => {
    if (!req.params.fileId || req.params.fileId === "undefined"){
        return res.status(404).send();
    }
    res.redirect('/resources/' + req.params.fileId)
};

let getSkin = (username, func) => {

    profileService.getProfileByUserName(username, profile => {
        if (!profile) { return func(new Error("user not found")) }
        userService.getProfileOwner(profile._id, user => {
            func(null, user.skin)
        })
    });
};

module.exports.getSkin = (req, res, next) => {
    getSkin(req.params.username, (err, doc) => {
        if (err) { return res.sendStatus(404) }
        res.redirect('/resources/' + doc.skin)
    })
};

module.exports.getSkinByUUID = (req, res, next) => {
    profileService.getProfileByProfileId(req.params.profileId, profile => {
        if (!profile){
            res.redirect("https://public.hyperworld.xyz/Gamer/Minecraft/public.png")
        } else {
            userService.getProfileOwner(profile._id, user => {
                if (!user.skin.skin){
                    return res.redirect("https://public.hyperworld.xyz/Gamer/Minecraft/public.png")
                }
                let gfs = grid(db.connection.db);
                gfs.exist({
                    _id: db.Types.ObjectId(user.skin.skin)
                }, (err, found) => {
                    if (!found || err) { res.status(404).send(); return }
                    // res.setHeader("Content-disposition", "attachment;");
                    gfs.createReadStream({
                        _id: db.Types.ObjectId(user.skin.skin)
                    }).pipe(res);
                })
            })
        }
    })
};

module.exports.getCup = (req, res, next) => {
    getSkin(req.params.username, (err, doc) => {
        if (err) { return res.sendStatus(404) }
        res.redirect('/resources/' + doc.cap)
    })
};