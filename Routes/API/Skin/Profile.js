/**
 * Created by Indexyz on 2017/4/15.
 */
'use strict';
const db = require('mongoose');
const userSchema = require('../../../Db/Schema/User');

module.exports.get = (req, res, next) => {
    let username = req.params.username,
        userModel = db.model('users', userSchema);

    userModel.findOne({
        username: username
    }, (err, doc) => {
        if (err || !doc) { res.status(401).send({"errno": "1", "msg": "User not found."}); return }
        res.send({
            player_name: doc.username,
            last_update: doc.skin ? undefined : doc.skin.lastUpdate.getTime(),
            model_preference: ["default", "cape"],
            skins: {
                "default": doc.skin.skin,
                cap: doc.skin.cap
            },
            cap: doc.skin.cap
        })
    })

};