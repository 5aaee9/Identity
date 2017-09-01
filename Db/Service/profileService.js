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


module.exports.invalid = function* (accessToken, clientToken) {
    const profile = yield profileModel.findOne({
        accessToken: accessToken,
        clientToken: clientToken
    });
    if (profile) {
        profile.refresh();
        yield profile.save()
    }
};


module.exports.getProfile = function* (accessToken, clientToken) {
    return yield profileModel.findOne({
        accessToken: accessToken,
        clientToken: clientToken
    })
};

module.exports.getProfileByProfileId = function* (profileId) {
    return yield profileModel.findOne({
        ProfileID: profileId
    })
};

module.exports.getProfileByUserName = function* (username) {
    return yield profileModel.findOne({
        UserName: username
    })
};


module.exports.getProfileById = function* (id) {
    return yield profileModel.findOne({
        _id: id
    })
};

module.exports.loginServer = function* (profile, message, ip) {
    const user = yield userService.getProfileOwner(profile._id);
    if (!user) return new Error("No user found");
    yield logService.loginLog(message, user, profile, ip)
};