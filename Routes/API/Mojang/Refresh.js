/**
 * Created by Indexyz on 2017/4/11.
 */
'use strict';
const db = require("mongoose");
const userSchema = require('../../../Db/Schema/User');
const errors = require("./Errors");

module.exports.post = (req, res, next) => {
    let token = req.body.accessToken,
        uuid = req.body.clientToken,
        userModel = db.model('users', userSchema);

    userModel.findOne({
        "profile.UUID": uuid,
        "profile.Token": token
    }, (err, doc) => {
        if (!doc || err) { res.status(403).send(errors.ForbiddenOperationExceptionUserToken); return }
        if (req.body.selectedProfile) { res.status(400).send(errors.IllegalArgumentException); return }
        doc.refresh();
        doc.save(err => {
            if (err) { res.status(500).send(errors.ServerProblem); return }
            let retDoc = {
                accessToken: doc.profile.Token,
                clientToken: doc.profile.UUID,
                selectedProfile: {
                    id: doc.profile.UserID,
                    name: doc.profile.authToken,
                },
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