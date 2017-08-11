'use strict';
const mongoose = require('mongoose');
const config = require('../../Config');
const crypto = require('crypto');
const uuid  = require('uuid');
const mail = require("../../Utils/Mail");
const i18n = require("../../i18n").__;
const stringUtil = require("../../Utils/String");

let UserSchema = mongoose.Schema({
    username: String,
    password: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    lastUsing: {type: Date, required: true, default: Date.now},
    join: {type: Date, required: true, default: Date.now},
    accessToken: {type: String, required: true},
    emailToken: {type: String},
    selectProfile: mongoose.Schema.Types.ObjectId,
    profile: [],
    skin: {
        lastUpdate: Date,
        skin: { type: mongoose.Schema.Types.ObjectId },
        cap: { type: mongoose.Schema.Types.ObjectId },
        slim: { type: mongoose.Schema.Types.ObjectId }
    },
    isAdmin: { type: Boolean, default: false }
});


function getSaltedPassword(password){
    return crypto.createHmac('sha1', config.salt).update(password).digest().toString('base64');
}

UserSchema.pre('save', function(next) {
    // SHA1 password
    if (!this.isModified('password')) return next();
    this.password = getSaltedPassword(this.password);
    return next();
});

UserSchema.pre('save', function(next) {
    if (!this.isModified('skin')) return next();
    this.skin.lastUpdate = new Date();
    return next();
});

UserSchema.methods.comparePassword = function(password){
    return this.password === getSaltedPassword(password);
};

UserSchema.methods.refreshSession = function(){
    this.accessToken = uuid.v4();
};

UserSchema.methods.generatorEmailToken = function(){
    this.emailToken = uuid.v4();
};

UserSchema.methods.sendMail = function (title, content, func) {
    mail.send(this.email, title, content, func)
};

UserSchema.methods.sendCodeMail = function (url, func) {
    this.sendMail(i18n("mail.title"), i18n("mail.before") +
        url + "/auth/email?code=" + this.emailToken, func)
};

UserSchema.methods.setRandomPassword = function () {
    let password = stringUtil.randomString(16);
    this.password = password;
    return password
};

UserSchema.methods.cinit = function (profile) {
    this.generatorEmailToken();
    this.refreshSession();
    this.selectProfile = profile._id;
    this.profile.push(profile._id);
};

module.exports = UserSchema;
module.exports.getSaltedPassword = getSaltedPassword;