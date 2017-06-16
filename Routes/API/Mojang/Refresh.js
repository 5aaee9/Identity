const profileService = require("../../../Db/Service/profileService");
const userService = require("../../../Db/Service/userService");
const errors = require("./Errors");

module.exports.post = (req, res, next) => {
    let accessToken = req.body.accessToken,
        clientToken = req.body.clientToken;

    profileService.getProfile(accessToken, clientToken, profile => {

        if (!profile) { return errors.makeError(res, errors.ForbiddenOperationExceptionUserToken) }
        userService.getProfileOwner(profile._id, user => {
            if (req.body.selectedProfile) {
                userService.hasProfile(user, req.body.selectedProfile, selectProfile => {
                    if (!selectProfile) {
                        return errors.makeError(res, errors.IllegalArgumentException)
                    }
                })
            }
            if (clientToken !== profile.clientToken){
                clientToken = ""
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
