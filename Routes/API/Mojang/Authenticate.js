

// /**
//  * Created by Indexyz on 2017/4/11.
//  */
"use strict";
const userService = require("../../../Db/Service/userService");

const errors = require("./Errors");

module.exports.post = function* (req, res, next) {
    let {username, password, clientToken} = req.body;

    const user = yield userService.login(username, password);

    if (!user) { return errors.makeError(res, errors.ForbiddenOperationExceptionUserAccount) }
    const profile = yield userService.getProfile(user);
    if (clientToken instanceof String){
        if (!profile.clientToken === clientToken){
            clientToken = null;
        }
    }
    profile.refresh();
    if (Boolean(clientToken)){
        profile.clientToken = clientToken
    }
    yield profile.save();
    res.send(yield userService.makeDocment(user));
};