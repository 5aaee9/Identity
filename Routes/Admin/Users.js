/**
 * Created by Indexyz on 2017/8/4.
 */

const userSchema = require("../../Db/Schema/User");
const profileSchema = require("../../Db/Schema/Profile");
const db = require("mongoose");
const dbDefine = require("../../Define/Db");
const co = require('co');

const userModel = db.model(dbDefine.Db.USER_DB, userSchema),
      profileModel = db.model(dbDefine.Db.PROFILE_DB, profileSchema);

module.exports.get = (req, res, next) => {
    co(function *() {
        const users = yield userModel.find({});
        return users
    }).then(users => {
        res.render("admin/users", {
            users
        })
    }).catch(err => next(err))
};

module.exports.edit = (req, res, next) => {
    const userId = req.params.userId;
    co(function* () {
        const user = yield userModel.findOne({_id: userId});
        if (!user) {
            let err = new Error("User Not found");
            err.status = 404;
            throw err
        }
        const profile = yield profileModel.findOne({_id: user.selectProfile});
        return {user, profile}
    }).then(data => {
        res.render("admin/edit", data)
    }).catch(err => next(err))
};