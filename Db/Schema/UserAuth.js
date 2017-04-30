/**
 * Created by Indexyz on 2017/4/30.
 */

const mongoose = require('mongoose');

let authSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, require: true },
    app: { type: mongoose.Schema.Types.ObjectId, require: true },
    refToken: { type: String, require: true },
    accessToken: { type: String, require: true },
    expiresTime: Date,
    state: String,
    scope: []
});

module.exports = authSchema;