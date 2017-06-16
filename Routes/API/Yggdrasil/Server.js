const db = require("mongoose");
const userSchema = require("../../../Db/Schema/User");
const DbDefine = require("../../../Define/Db").Db;
const errors = require("../Mojang/Errors");

let userModel = db.model(DbDefine.USER_DB, userSchema);

module.exports.joinserver = (req, res, next) => {
    let accessToken = req.body.accessToken,
        selectedProfile = req.body.selectedProfile,
        serverId = req.body.serverId;

    userModel.findOne({
        "profile.UserID": selectedProfile,
        "profile.Token": accessToken
    }).then((doc) => {
        if (!doc) { return res.status(403).send(errors.ForbiddenOperationExceptionUserAccount); }
        req.db.redis.set(serverId, selectedProfile, (err, msg) => {
            // console.log("a")
            res.status(204).send()
        })
    }, (err) => {
        return res.status(403).send(errors.ForbiddenOperationExceptionUserAccount);
    });

    // console.log(req.body)
    // console.log(req)
};

module.exports.hasjoinserver = (req, res, next) => {
    req.db.redis.get(req.query.serverId, (err, reply) => {
        if (err) { return res.status(204).send() }
        userModel.findOne({
            "profile.UserID": reply
        }).then(doc => {
            if (!doc) { return res.status(204).send() }
            res.send({
                id: doc.profile.Token,
                name: doc.username
            })
        })
    });

};