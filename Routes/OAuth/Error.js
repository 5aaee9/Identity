/**
 * Created by Indexyz on 2017/5/1.
 */

module.exports = function (res, error) {
    res.setHeader('WWW-Authenticate', "error=" + error.name + ",error_description=" + error.error_description);
    res.status(error.code).send({
        error: error.name,
        description: error.error_description
    })
};

module.exports.Types = {
    USER_NAME_ERROR: {
        name: "user_name_error",
        error_description: "Basic auth user name should be Bearer",
        code: 401
    },
    INVALID_TOKEN: {
        name: "invalid_token",
        error_description: "You may send an error token",
        code: 401
    },
    UNAUTHORIZED: {
        name: "unauthorized",
        error_description: "Should send basic auth filed",
        code: 401
    },
    INVALID_REQUEST: {
        name: "invalid_request",
        error_description: "The request is missing a required parameter",
        code: 400
    },
    SERVER_ERROR: {
        name: "server_error",
        error_description: "Server may has some problem, please try again later",
        code: 500
    },
    GRANT_ERROR: {
        name: "grant_error",
        error_description: "grant type is not support",
        code: 400
    }
}
;