/**
 * Created by Indexyz on 2017/8/4.
 */

const userSchema = require("../../Db/Schema/User");
const db = require("mongoose");
const dbDefine = require("../../Define/Db");
const co = require('co');

const userModel = db.model(dbDefine.Db.USER_DB, userSchema);

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