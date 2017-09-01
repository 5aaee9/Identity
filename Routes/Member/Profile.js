/**
 * Created by Indexyz on 2017/4/11.
 */
"use strict";
const userService = require("../../Db/Service/userService");
const Promise = require('bluebird');
const i18n = require("../../i18n");

module.exports.get = (req, res, next) => {
    res.render("member/profile");
};

module.exports.post = function* (req, res, next) {
    let {type} = req.body;

    const user = yield userService.findById(req.session.user._id);
    const profile = yield userService.getProfile(user);

    function resolve(message) {
        res.render("member/profile", {
            info: message
        })
    }

    function reject(message) {
        res.status(400).render("member/profile", {
            e: message
        })
    }

    switch (type) {
        case "changeUserName": {
            const {username} = req.body;
            if (username.length < 3) return reject(i18n.__("member.error.usernameMissChar"));
            profile.UserName = username;
            yield profile.save();
            resolve(i18n.__("editSuccess"));
            break;
        }
        case "modifyPassword": {
            let {oldPassword, newPassword} = req.body;
            if (newPassword.length < 3) return reject(i18n.__("member.error.passwordMissChar"));
            if (!user.comparePassword(oldPassword)) {
                return reject(i18n.__("member.error.errorPassword"))
            }
            user.password = newPassword;
            yield user.save();
            resolve(i18n.__("editSuccess"));
            break;
        }
        default: {
            reject(i18n.__("member.error.noMethodFound"));
            break;
        }
    }

};
