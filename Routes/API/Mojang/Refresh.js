const profileService = require("../../../Db/Service/profileService");
const userService = require("../../../Db/Service/userService");
const errors = require("./Errors");

module.exports.post = function* (req, res, next)  {
    let {accessToken, clientToken, selectedProfile} = req.body;

    const profile = yield profileService.getProfile(accessToken, clientToken)
    if (!profile) { return errors.makeError(res, errors.ForbiddenOperationExceptionUserToken) }
    const user = yield userService.getProfileOwner(profile._id);
    if (selectedProfile) {
        const profile = yield userService.hasProfile(user, selectedProfile);
        if (!profile) {
            return errors.makeError(res, errors.IllegalArgumentException)
        }
    }

    if (clientToken !== profile.clientToken){
        clientToken = ""
    }

    profile.refresh();
    if (Boolean(clientToken)){
        profile.clientToken = clientToken
    }

    yield profile.save();
    res.send(yield userService.makeDocment(user));
};
