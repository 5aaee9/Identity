/**
 * Created by Indexyz on 2017/6/17.
 */

const db = require("mongoose");
const logSchema = require("../Schema/Log");
const dbDefine = require("../../Define/Db").Db;
let logModel = db.model(dbDefine.LOGS_DB, logSchema);

module.exports.loginLog = (message, user, profile, ip, callback) => {
    new logModel({
        log: message.replace("${player}", profile.UserName),
        user: user._id,
        ip: ip,
        type: logSchema.TYPES.SERVER
    }).save(callback)
};