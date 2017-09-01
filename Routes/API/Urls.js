/**
 * Created by Indexyz on 2017/4/11.
 */
'use strict';

const Router = require('co-router');
let router = Router();

const errors = require("./Errors");

router.get("/", (req, res, next) => {
    res.send({
        meta: {
            serverName: "Identity service",
            implementationName: "Identity",
            implementationVersion: "0.0.0"
        },
        skinDomains: [
            req.get("host")
        ]
    })
});

router.use("/skin", require("./Skin/Urls"));

router.use((req, res, next) => {
    if (req.headers["content-type"] === undefined || req.headers["content-type"].indexOf("application/json") === -1){
        return errors.makeError(res, errors.UnsupportedMediaType);
    } else {
        next();
    }
});

router.use("/authserver", require('./AuthServer/Urls'));
router.use("/sessionserver", require("./SessionServer/Urls"));
router.use("/api", require("./API/Urls"));

module.exports = router;
