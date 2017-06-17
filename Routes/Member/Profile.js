/**
 * Created by Indexyz on 2017/4/11.
 */
"use strict";
const db = require("mongoose");
const userSchema = require("../../Db/Schema/User");
const userService = require("../../Db/Service/userService");
const Promise = require('bluebird');

module.exports.get = (req, res, next) => {
    let userModel = db.model("users", userSchema);
    userModel.findOne({
        _id: req.session.user._id
    }, (err, doc) => {
        if (err) { next(err); return }
        res.render("member/profile", {
            user: doc
        })
    });
};

module.exports.post = (req, res, next) => {
    let type = req.body.type;

    userService.findById(req.session.user._id, (err, user) => {
        userService.getProfile(user, profile => {
            new Promise((resolve, reject) => {
                switch (type){
                    case "changeUserName": {
                        let username = req.body.username;
                        if (username.length < 3) return reject(new Error("用户名长度太小"));
                        profile.UserName = username;
                        profile.save(err => {
                            if (err) return reject(err);
                            resolve()
                        });
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }).then(() => {
                res.render("member/profile", {
                    user: user
                })
            }, (err) => {
                res.render("member/profile", {
                    user: user,
                    e: err.message
                })
            });

        })
    });

};