/**
 * Created by Indexyz on 2017/4/11.
 */

module.exports.ForbiddenOperationExceptionUserAccount = {
    message:{
        "error": "ForbiddenOperationException",
        "errorMessage": "Invalid credentials. Invalid username or password."
    },
    code: 403
};

module.exports.ForbiddenOperationExceptionUserToken = {
    message:{
        "error": "ForbiddenOperationException",
        "errorMessage": "Invalid token."
    },
    code: 403
};

module.exports.IllegalArgumentException = {
    message:{
        "error": "IllegalArgumentException",
        "errorMessage": "Access token already has a profile assigned."
    },
    code:400
};

module.exports.MethodNotAllowed = {
    message:{
        "error": "Method Not Allowed",
        "errorMessage": "The method specified in the request is not allowed for the resource identified by the request" +
        " URI"
    },
    code: 405
};

module.exports.UnsupportedMediaType = {
    message:{
        "error": "Unsupported Media Type",
        "errorMessage": "The server is refusing to service the request because the entity of the request is in " +
        "a format not supported by the requested resource for the requested method"
    },
    code: 415
};

module.exports.ServerProblem = {
    message: {
        "error": "Server Problem",
        "errorMessage": "The Auth Server may has some problem, it's a server-side error, please try again latter."
    },
    code: 500
};


module.exports.makeError = (res, error) => {
    res.status(error.code).send(error.message)
};