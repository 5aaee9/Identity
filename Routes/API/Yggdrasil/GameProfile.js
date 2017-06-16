const db = require("mongoose");
const userSchema = require("../../../Db/Schema/User");
const DbDefine = require("../../../Define/Db").Db;
const errors = require("../Mojang/Errors");

let userModel = db.model(DbDefine.USER_DB, userSchema);

module.exports.username2uuid = (req, res, next) => {
    userModel.findOne({
        username: req.params["userName"]
    }).then((doc) => {
        if (!doc) { return res.status(204).send() }
        res.send({
            id: doc.profile.UserID,
            name: doc.username
        })
    })
};

module.exports.uuid2username = (req, res, next) => {
    userModel.findOne({
        "profile.UserID": req.params["uuid"]
    }).then(doc => {
        if (!doc) { return res.status(204).send() }
        res.send([
            {
                name: username
            }
        ])
    })
};

module.exports.name2uuids = (req, res, next) => {
    let names = JSON.parse(req.body);
    names.map(x => {
        userModel.findOne({
            username: x
        }).then(u => {
            if (!u) { return null }
            return {
                id: u.profile.UserID,
                name: u.username,
                legacy: true
            }
        })
    }).then(x => {
        res.send(x)
    })
};