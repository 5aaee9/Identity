/**
 * Created by Indexyz on 2017/4/11.
 */
'use strict';
const db = require('mongoose');
const userSchema = require("../../Db/Schema/User");

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
    let type = req.body.type,
        userModel = db.model("users", userSchema);

    userModel.findOne({
        _id: req.session.user._id
    }, (err, doc) => {
        let funcs = {
            "resetUserKey": (func) => { doc.refresh(); func(undefined, "保存成功") },
            "changeUserName": (func) => {
                let username = req.body.username;
                if (username.length < 3){ func("用户名长度太小");return }
                doc.username = username;
                func(undefined, "修改成功")
            }
        };
        funcs[type]((err, info) => {
            let ret = (err, info) => {
                res.render("member/profile", {
                    user: doc,
                    e: err,
                    info: info
                })
            };
            if (err) { ret(err, null) }
            doc.save(err => {
                if (err) { ret(err.message); return }
                ret(undefined, info)
            })
        })

    });
};