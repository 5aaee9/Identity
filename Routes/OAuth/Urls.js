/**
 * Created by Indexyz on 2017/4/30.
 */

const express = require("express");
const typeEnum = require("../../Define/OAuth").scope;
const multer  = require("multer");
const makeError = require("./Error");
const db = require("mongoose");
const userAuthSchema = require("../../Db/Schema/UserAuth");
const appSchema = require("../../Db/Schema/Application");
const dbEnum = require("../../Define/Db").Db;
let router = express.Router();

let upload = multer({
    dest: "tmp/",
    limits: { fileSize:  1024 * 64 }
});

router.get("/", (req, res, next) => {
    res.status(204).send();
});

router.use("/authorize", (req, res, next) => {
    if (!req.session.user) {
        res.redirect("/auth/login?redirect=" + encodeURIComponent(req.originalUrl))
    } else {
        next()
    }
});
router.get("/authorize", require("./Authorize").get);
router.post("/authorize", require("./Authorize").post);

router.get("/getCode", require("./GetCode").get);

router.post("/token", require("./Token").post);


router.use("/resources/:type", (req, res, next) => {
    if (!req.params.type || req.params.type === "undefined"){
        return makeError(res, makeError.Types.TYPE_ERROR);
    } else {
        let thisType = req.params.type;
        let userAuthModel = db.model(dbEnum.APP_USER_DB, userAuthSchema),
            appModel = db.model(dbEnum.APPS_DB, appSchema);
        userAuthModel.findOne({
            accessToken: req.headers.access_token,
            scope: thisType
        }, (err, doc) => {
            if (err || !doc) { return makeError(res, makeError.Types.INVALID_TOKEN) }
            appModel.find({
                client_secret: req.headers.client_secret
            }, (err, app) => {
                if (err || !app) { return makeError(res, makeError.Types.INVALID_SECRET) }
                req.doc = doc;
                req.app = app;
                req.resType = thisType;
                next()
            })
        });
    }
});

router.post("/resources/" + typeEnum.MODIFY_SKIN, (req, res, next) => {
    if (!req.headers.type || (!req.headers.type in ["cap", "slim", "skin"])){
        return makeError(res, makeError.Types.INVALID_REQUEST)
    } else {
        req.skinType = req.headers.type;
        next()
    }
});

router.post("/resources/" + typeEnum.MODIFY_SKIN, require("./Resources").upload);

router.get("/resources/:type", require("./Resources").get);

module.exports = router;