/**
 * Created by Indexyz on 2017/4/30.
 */


const db = require("mongoose");
const oapp = require("../../Db/Schema/Application");
const userAuth = require("../../Db/Schema/UserAuth");
const oauthDefine = require("../../Define/OAuth");
const dbDefine = require("../../Define/Db");

let appModel = db.model(dbDefine.Db.APPS_DB, oapp),
    authCode = db.model(dbDefine.Db.APP_USER_DB, userAuth);

module.exports.get = (req, res, next) => {
    if (req.query.response_type !== "code"){
        return res.status(412).send({ error: "response_type need been code" })
    }
    let clientId = req.query.client_id;
    appModel.findOne({ client_id: clientId }, (err, doc) => {
        if (err || ! doc){
            return res.status(404).send({ error: "client_id error" })
        }
        // redirect_uri = redirect_uri || doc.redirectUri || "/oauth/getCode";
        res.render("auth/access_require", {
            app: {
                name: doc.name,
                image: doc.image
            },
            scope: doc.scope
        })
    })
};


module.exports.post = (req, res, next) => {
    let redirect_uri = req.query.redirect_uri,
        clientId = req.query.client_id;
    appModel.findOne({ client_id: clientId }, (err, doc) => {
        if (err || ! doc){
            return res.status(404).send({ error: "client_id error" })
        }
        redirect_uri = redirect_uri || doc.redirectUri || "/oauth/getCode";
        authCode.findOne({
            user: req.session.user._id,
            app: doc._id
        }, (err, userdoc) => {
            if (err) { return next(err) }
            let onSave = code => {
                return err => {
                    if (err) {
                        return next(err)
                    }
                    res.redirect(redirect_uri + "?code=" + code)
                };
            };
            if (!userdoc){
                let code = new authCode({
                    user: req.session.user._id,
                    app: doc._id
                });
                for (let reqKey in req.body){
                    if (req.body[reqKey] === "on"){
                        code.scope.push(reqKey)
                    }
                }
                code.refresh();
                code.save(onSave(code.code))
            } else {
                userdoc.scope = [];
                for (let reqKey in req.body){
                    if (req.body[reqKey] === "on"){
                        userdoc.scope.push(reqKey)
                    }
                }
                userdoc.refresh();
                userdoc.save(onSave(userdoc.code))
            }
        });
    })
};