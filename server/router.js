'use strict';
var express = require('express');
var router = express.Router();
var config = require('./config')
var mongoose = require('mongoose');
mongoose.connect(config.getDbLink());
var user = require("./schema/user")
var db = mongoose.connection;

db.once('open', () => {
    router.get("/", (req, res, next) => {
        res.send({
            "version": "0.0.1",
            "url": [{
                "url": "launcher/login",
                "description": "get login token"
            }]
        })
    })
    router.use("/auth", require('./router/auth'))
    router.use("/launcher", require('./router/launcher'))
    router.use("/view", function(req, res, next) {
        let userModel = db.model('users', user),
            token = req.body.token || req.query.token || req.param.token || req.headers.token
        if (!token) { res.status(401).send({"error": "Please given a accessToken"}); return }
        userModel.findOne({accessToken: token}, (err, doc) => {
            if (err){ res.status(500).send({"error": err.message}); return }
            if (!doc){ res.status(401).send({"error": "accessToken is error" }); return }
            next()
        })
    })
    router.use("/view", require('./router/view'))
    router.use("/server", require('./router/server'))
    router.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    })
    router.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send({"error": err.message});
    })
})

module.exports = router;
