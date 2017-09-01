/**
 * Created by Indexyz on 2017/6/17.
 */

const db = require("mongoose");
const dbDefine = require("../../Define/Db");
const userS = require("../Schema/User");
const profileS = require("../Schema/Profile");
const dateHelper = require("../../Utils/DateTime");

let profileModel = db.model(dbDefine.Db.PROFILE_DB, profileS),
    userModel = db.model(dbDefine.Db.USER_DB, userS);

module.exports.create = function* (username, email, password) {
    let user = new userModel({
        password: password,
        email: email
    });
    let profile = new profileModel({});
    profile.cinit(username);
    yield profile.save();
    user.cinit(profile);
    yield user.save();
    return user
};


module.exports.login = function* (email, password) {
    return yield userModel.findOne({
        email: {
            $regex: new RegExp("^" + String(email) + "$", "i")
        },
        password: userS.getSaltedPassword(password)
    })
};


module.exports.getProfile = function* (user) {
    return yield profileModel.findOne({
        _id: user.selectProfile
    })
};


module.exports.makeDocment = function* (user) {
    const profile = yield profileModel.findOne({
        _id: user.selectProfile
    });

    const backDoc = {
        accessToken: profile.accessToken,
        clientToken: profile.clientToken,
        selectedProfile: {
            id: profile.ProfileID,
            name: profile.UserName
        },
        availableProfiles: []
    };

    const profileList = new Set([]);
    for (const profile of user.profile) {
        const user = yield profileModel.findOne({_id: profile});
        profileList.add({
            id: user.ProfileID,
            name: user.UserName,
        })
    }

    backDoc["availableProfiles"] = [...profileList];

    return backDoc
};


module.exports.getProfileOwner = function* (profileId)  {
    return yield userModel.findOne({
        profile: profileId
    })
};


module.exports.hasProfile = function* (user, profileId) {
    for (const id of user.profile) {
        const profile = yield profileModel.findOne({_id: id});
        if (profile.ProfileID === profileId) {
            return profile
        }
    }
    return null;
};


module.exports.foundByEmail = function* (email) {
    return yield userModel.findOne({
        email: {
            $regex: new RegExp("^" + String(email) + "$", "i")
        }
    })
};

module.exports.findById = function* (id) {
    return yield userModel.findOne({
        _id: id
    })
};

function* deleteUserProfiles(user) {
    for (const profile of user.profile) {
        yield profileModel.remove({_id: profile})
    }
}


module.exports.removeExpire = function* () {
    const expireUsers = yield userModel.find({
        join: {
            $lte: dateHelper.getPreDay(new Date())
        },
        emailToken: {
            $ne: ""
        }
    });

    for (const user of expireUsers) {
        yield deleteUserProfiles(user);
        yield userModel.remove({_id: user.id})
    }

    return expireUsers
};