/**
 * Created by Indexyz on 2017/4/11.
 */
'use strict';
const db = require("mongoose");
const userSchema = require('../../../Db/Schema/User');
const errors = require("./Errors");

module.exports.post = (req, res, next) => {
    let username = req.body.username,
        password = req.body.password,
        userModel = db.model('users', userSchema);
    userModel.findOne({
        email: username,
        password: userSchema.getSaltedPassword(password)
    }, (err, doc) => {
        if (!doc || err) { return res.status(403).send(errors.ForbiddenOperationExceptionUserAccount); }
        doc.refresh();
        if (req.body.clientToken){
            doc.profile.UUID = req.body.clientToken
        }
        doc.save(err => {
            if (err) { res.status(403).send(errors.ForbiddenOperationExceptionUserAccount); return }
            let retDoc = {
                accessToken: doc.profile.Token,
                clientToken: doc.profile.UUID,
                selectedProfile: {
                    id: doc.profile.UserID,
                    name: doc.profile.authToken,
                },
                availableProfiles: [{
                    id: doc.profile.UserID,
                    name: doc.profile.authToken,
                }]
            };
            if (req.body.requestUser) {
                retDoc["user"] = {
                id: doc.profile.UserID
                }
            }
            res.send(retDoc)
        })
    })
};
