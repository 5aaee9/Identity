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

module.exports = applicationSchema;