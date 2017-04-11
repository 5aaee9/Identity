'use strict';
const mongoose = require('mongoose');
const config = require('../../Config');
const crypto = require('crypto');
const uuid  = require('node-uuid');
const stringHelper = require('../../Utils/String');
const mail = require("../../Utils/Mail");


let UserSchema = mongoose.Schema({
    username: {type: String, unique: true, required: true, index: {unique: true}},
    password: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    lastUsing: {type: Date, required: true, default: Date.now},
    join: {type: Date, required: true, default: Date.now},
    accessToken: {type: String, required: true},
    emailToken: {type: String},
    profile: {
        UUID: String,
        Token: String,
        UserID: String,
        authToken: String
    }
});


function getSaltedPassword(password){
    return crypto.createHmac('sha1', config.salt).update(password).digest().toString('base64')
}

UserSchema.pre('save', function(next) {
    // SHA1 password
    if (!this.isModified('password')) return next();
    this.password = getSaltedPassword(this.password);
    return next()
});

UserSchema.methods.comparePassword = function(password){
    return this.password === getSaltedPassword(password)
};

UserSchema.methods.refreshSession = function(){
    this.accessToken = uuid.v4()
};

UserSchema.methods.refresh = function(){
    this.profile.Token = stringHelper.replace(uuid.v4(), "-", "");
    this.profile.UUID  = stringHelper.replace(uuid.v4(), "-", "");
    this.profile.authToken  = stringHelper.randomString(16)
};

UserSchema.methods.generatorID = function(){
    this.profile.UserID = stringHelper.replace(uuid.v4(), "-", "");
    this.profile.authToken  = stringHelper.randomString(16)
};

UserSchema.methods.generatorEmailToken = function(){
    this.emailToken = uuid.v4()
};

UserSchema.methods.sendMail = function (url, func) {
    mail.send(
        this.email, "VeryAuth verify mail", "Your verify url: " +
        url + "/auth/email?code=" + this.emailToken,
        err => {
            func(err)
        }
    )
};

module.exports = UserSchema;
module.exports.getSaltedPassword = getSaltedPassword;