/**
 * Created by Indexyz on 2017/4/11.
 */

module.exports.ForbiddenOperationExceptionUserAccount = {
    "error": "ForbiddenOperationException",
    "errorMessage": "Invalid credentials. Invalid username or password."
};

module.exports.ForbiddenOperationExceptionUserToken = {
    "error": "ForbiddenOperationException",
    "errorMessage": "Invalid token."
};

module.exports.IllegalArgumentException = {
    "error": "IllegalArgumentException",
    "errorMessage": "Access token already has a profile assigned."
};

module.exports.MethodNotAllowed = {
    "error": "Method Not Allowed",
    "errorMessage": "The method specified in the request is not allowed for the resource identified by the request" +
    " URI"
};

module.exports.UnsupportedMediaType = {
    "error": "Unsupported Media Type",
    "errorMessage": "The server is refusing to service the request because the entity of the request is in " +
"a format not supported by the requested resource for the requested method"
};

module.exports.ServerProblem = {
    "error": "Server Problem",
    "errorMessage": "The Auth Server may has some problem, it's a server-side error, please try again latter."
};