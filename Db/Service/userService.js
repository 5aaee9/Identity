/**
 * Created by Indexyz on 2017/6/17.
 */

const db = require("mongoose");
const dbDefine = require("../../Define/Db");
const userS = require("../Schema/User");
const profileS = require("../Schema/Profile");
const Promise = require('bluebird');
const profileService = require("./profileService");

let profileModel = db.model(dbDefine.Db.PROFILE_DB, profileS),
    userModel = db.model(dbDefine.Db.USER_DB, userS);

module.exports.create = (username, email, password, next) => {
    let user = new userModel({
        password: password,
        email: email
    });

    let profile = new profileModel({});
    profile.cinit(username);
    profile.save(err => {
        if (err) { return next(err) }
        user.cinit(profile);
        user.save(err => {
            if (err) { return next(err) }
            else return next(null, user);
        })
    })
};


module.exports.login = (email, password, callback) => {
    userModel.findOne({
        email: {
            $regex: new RegExp("^" + String(email) + "$", "i")
        },
        password: userS.getSaltedPassword(password)
    }).then(doc => {
        callback(null, doc)
    }, err => callback(err))
};


module.exports.getProfile = (user, callback) => {
    profileModel.findOne({
        _id: user.selectProfile
    }).then(profile => {
        callback(profile)
    }, (err) => {
        throw err
    })
};


module.exports.makeDocment = (user, callback) => {
    let backDoc;
    profileModel.findOne({
        _id: user.selectProfile
    }).then(doc => {
        backDoc = {
            accessToken: doc.accessToken,
            clientToken: doc.clientToken,
            selectedProfile: {
                id: doc.ProfileID,
                name: doc.UserName
            },
            availableProfiles: []
        };
    }).then(() => {
        function makePromise(profileId){
            return new Promise(resolve => {
                profileModel.findOne({
                    _id: profileId
                }).then(doc => {
                    resolve({
                        id: doc.ProfileID,
                        name: doc.UserName
                    })
                })
            })
        }

        return Promise.all(user.profile.map(item => makePromise(item)))
    }).then((res) => {
        backDoc["availableProfiles"] = res;
        callback(backDoc)
    })
};


module.exports.getProfileOwner = (profileId, callback) => {
    userModel.findOne({
        profile: profileId
    }).then(doc => callback(doc))
};


module.exports.hasProfile = (user, profileId, callback) => {
    function makePromise(profileId){
        return new Promise(resolve => {
            profileModel.findOne({
                _id: profileId
            }).then(doc => {
                resolve(doc.ProfileID)
            })
        })
    }
    Promise.all(user.profile.map(item => makePromise(item)))
        .then(res => {
            if (res.indexOf(profileId) !== -1){
                profileService.getProfileByProfileId(profileId, callback)
            } else {
                callback(null)
            }
        })
};


module.exports.foundByEmail = (email, callback) => {
    userModel.findOne({
        email: {
            $regex: new RegExp("^" + String(email) + "$", "i")
        }
    }).then(doc => {
        callback(null, doc)
    }, err => callback(err))
};

module.exports.findById = (id, callback) => {
    userModel.findOne({
        _id: id
    }).then(doc => {
        callback(null, doc)
    }, err => callback(err))
};