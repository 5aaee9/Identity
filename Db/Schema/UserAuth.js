/**
 * Created by Indexyz on 2017/4/30.
 */

const mongoose = require('mongoose');
const stringHelper = require('../../Utils/String');

let authSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, require: true },
    app: { type: mongoose.Schema.Types.ObjectId, require: true },
    refToken: { type: String, require: true },
    accessToken: { type: String, require: true },
    code: String,
    expiresTime: Date,
    state: String,
    scope: []
});

authSchema.methods.refresh = function () {
    this.code = stringHelper.randomString(16);
    this.accessToken = stringHelper.randomString(32);
    this.refToken = stringHelper.randomString(32);
    this.expiresTime = new Date(new Date().getTime() + 600000)
};

module.exports = authSchema;