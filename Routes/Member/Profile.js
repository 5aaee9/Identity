/**
 * Created by Indexyz on 2017/4/11.
 */
"use strict";
const userService = require("../../Db/Service/userService");
const Promise = require('bluebird');

module.exports.get = (req, res, next) => {
    res.render("member/profile");
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
                            resolve("修改成功")
                        });
                        break;
                    }
                    case "modifyPassword": {
                        let oldPassword = req.body.oldPassword,
                            newPassword = req.body.newPassword;
                        if (newPassword.length < 3) return reject(new Error("密码长度太小"));
                        if (!user.comparePassword(oldPassword)) {
                            return reject(new Error("密码错误"))
                        }
                        user.password = newPassword;
                        user.save(err => {
                            if (err) return reject(err);
                            resolve("修改成功")
                        });
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }).then((info) => {
                res.render("member/profile", {
                    info: info
                })
            }, (err) => {
                res.status(400).render("member/profile", {
                    e: err.message
                })
            });

        })
    });

};
