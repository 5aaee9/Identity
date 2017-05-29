/**
 * Created by Indexyz on 2017/5/1.
 */

const db = require("mongoose");
const userAuth = require("../../Db/Schema/UserAuth");
const appSchema = require("../../Db/Schema/Application");
const DbDefine = require("../../Define/Db");
const makeError = require("./Error");


let returnToken = (res, doc) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Content-Type", "application/json;charset=UTF-8");
    res.send({
        access_token: doc.accessToken,
        token_type: "bearer",
        expires_in: 3600,
        refresh_token: doc.refToken,
    })
};

module.exports.post = (req, res, next) => {
    if (!req.headers["authorization"]) { return makeError(res, makeError.Types.UNAUTHORIZED) }
    // Check username, Defined in RFC6749
    if (Buffer.from(req.headers["authorization"].split(" ")[1], "base64").toString().split(":")[0] !== "Bearer") {
        return makeError(res, makeError.Types.USER_NAME_ERROR)
    }
    let code = Buffer.from(req.headers["authorization"].split(" ")[1], "base64").toString().split(":")[1],
        userAuthModel = db.model(DbDefine.Db.APP_USER_DB, userAuth),
        appModel = db.model(DbDefine.Db.APPS_DB, appSchema);
    appModel.findOne({
        client_secret: code
    }, (err, app) => {
        if (err || !app) {
            return makeError(res, makeError.Types.INVALID_TOKEN)
        }
        if (req.body["grant_type"] === "authorization_code") {
            userAuthModel.findOne({
                app: app._id,
                code: req.body.code,
                expiresTime: {
                    $gte: new Date()
                }
            }, (err, doc) => {
                if (err || !doc) {
                    return makeError(res, makeError.Types.INVALID_TOKEN)
                }
                doc.expiresTime = new Date(new Date().getTime() + 3600000);
                doc.code = "";
                doc.save(err => {
                    if (err) {
                        return makeError(res, makeError.Types.SERVER_ERROR)
                    }
                    returnToken(res, doc)
                })
            });
        } else if (req.body["grant_type"] === "refresh_token") {
            userAuthModel.findOne({
                app: app._id,
                refToken: req.body.refresh_token
            }, (err, doc) => {
                if (err || !doc) {
                    return makeError(res, makeError.Types.INVALID_TOKEN)
                }
                doc.refresh();
                doc.code = "";
                doc.save(err => {
                    if (err) {
                        return makeError(res, makeError.Types.SERVER_ERROR)
                    }
                    returnToken(res, doc)
                })
            })
        } else {
            makeError(res, makeError.Types.INVALID_REQUEST)
        }
    })
};