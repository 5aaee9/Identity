/**
 * Created by Indexyz on 2017/4/30.
 */
const mongoose = require('mongoose');
const stringHelper = require('../../Utils/String');

let applicationSchema = mongoose.Schema({
    owner: mongoose.Schema.Types.ObjectId,
    client_id: { type: String, require: true },
    scope: [],
    name: { type: String, require: true, unique: true },
    image: mongoose.Schema.Types.ObjectId,
    redirectUri: String
});

let applicationCode = mongoose.Schema({
    app: { type: mongoose.Schema.Types.ObjectId, require: true },
    code: { type: String, require: true }
});

applicationCode.methods.getCode = function () {
    this.code = stringHelper.randomString(16);
};

module.exports = applicationSchema;
module.exports.code = applicationCode;