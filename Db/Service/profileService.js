/**
 * Created by Indexyz on 2017/6/17.
 */
const db = require("mongoose");
const dbDefine = require("../../Define/Db");
const userS = require("../Schema/User");
const profileS = require("../Schema/Profile");

const userService = require("./userService");
const logService = require("./logService");

let profileModel = db.model(dbDefine.Db.PROFILE_DB, profileS),
    userModel = db.model(dbDefine.Db.USER_DB, userS);


module.exports.invalid = (accessToken, clientToken, callback) => {
    profileModel.findOne({
        accessToken: accessToken,
        clientToken: clientToken
    }).then(doc => {
        if (!doc) { return callback(new Error("No doc found")) }
        doc.refresh();
        doc.save(callback)
    })
};


module.exports.getProfile = (accessToken, clientToken, callback) => {
    profileModel.findOne({
        accessToken: accessToken,
        clientToken: clientToken
    }).then(doc => {
        callback(doc);
    })
};

module.exports.getProfileByProfileId = (profileId, callback) => {
    profileModel.findOne({
        ProfileID: profileId
    }).then(doc => callback(doc));
};

module.exports.getProfileByUserName = (username, callback) => {
    profileModel.findOne({
        UserName: username
    }).then(doc => callback(doc))
};


module.exports.getProfileById = (id, callback) => {
    profileModel.findOne({
        _id: id
    }).then(doc => callback(doc))
};

module.exports.loginServer = (profile, message, ip, callback) => {
    userService.getProfileOwner(profile._id, user => {
        if (!user) return callback(new Error("No user found"));
        logService.loginLog(message, user, profile, ip, err => {
            if (err) return callback(err);
            callback()
        })
    })
};