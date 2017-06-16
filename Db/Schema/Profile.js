const mongoose = require('mongoose');
const uuid = require("uuid");
const stringHelper = require('../../Utils/String');

let ProfileSchema = mongoose.Schema({
    ProfileID: { type: String, unique: true, required: true },
    UserName: { type: String, unique: true, required: true },
    accessToken: { type: String, unique: true, required: true },
    clientToken: { type: String, unique: true, required: true },
    userNameHistory: []
});


ProfileSchema.methods.refresh = function(){
    this.accessToken = stringHelper.replace(uuid.v4(), "-", "");
    this.clientToken  = stringHelper.replace(uuid.v4(), "-", "");
};

ProfileSchema.methods.cinit = function(username){
    this.UserName = username;
    this.ProfileID = stringHelper.replace(uuid.v4(), "-", "");
    this.refresh()
};

module.exports = ProfileSchema;