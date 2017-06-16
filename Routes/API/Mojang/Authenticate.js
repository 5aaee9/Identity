

// /**
//  * Created by Indexyz on 2017/4/11.
//  */
"use strict";
const userService = require("../../../Db/Service/userService");

const errors = require("./Errors");

module.exports.post = (req, res, next) => {
    let username = req.body.username,
        password = req.body.password,
        clientToken = req.body.clientToken;

    userService.login(username, password, (err, user) => {
        if (!user || err) { return errors.makeError(res, errors.ForbiddenOperationExceptionUserAccount) }
        userService.getProfile(user, profile => {
            if (clientToken instanceof String){
                if (!profile.clientToken === clientToken){
                    clientToken = null;
                }
            }
            profile.refresh();
            if (Boolean(clientToken)){
                profile.clientToken = clientToken
            }
            profile.save(err => {
                if (err) { return errors.makeError(res, errors.ServerProblem) }
                userService.makeDocment(user, data => res.send(data))
            })
        })
    })
};