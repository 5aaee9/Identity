'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const git = require('git-rev');
const cookieSession = require('cookie-session');
const config = require('./Config');
const db = require('mongoose');
const Raven = require('raven');
const app = express();
const moment = require('./Libs/moment.min');
const link = require("./Db/Redis").link;
const dbDefine = require("./Define/Db").Db;
const i18n = require("./i18n");
const userService = require("./Db/Service/userService");
const co = require("co");

if (process.env["RAVEN_TOKEN"]) {
    git.long(function (str) {
        Raven.config(
            process.env["RAVEN_TOKEN"], {
                tags: {
                    git_commit: str ? str : undefined
                },
                release: str ? str : undefined
            }
        ).install();
    })
}

app.use(logger('[:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'));

app.set('views', path.join(__dirname, 'Views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser(config.salt));
app.use(cookieSession({
    secret: config.salt
}));
app.use(i18n.init);
app.use(express.static(path.join(__dirname, 'Public')));

let redis = null;
link(r => {
    redis = r;
});
let userModel = db.model(dbDefine.USER_DB, require("./Db/Schema/User")),
    profileModel = db.model(dbDefine.PROFILE_DB, require("./Db/Schema/Profile"));

// Database connection
require("./Db/Db")(() => {
    // values
    app.use(function(req, res, next) {
        if (config.remove_expire_user){
            co(function*() { yield userService.removeExpire() }).then(() => next())
        } else {
            next()
        }
    });

    app.use(function(req, res, next) {
        res.locals.$ = i18n.__ || (() => {});
        res.locals.config = config;
        if (req.session.user) {
            userModel.findOne({
                _id: req.session.user._id
            }, (err, doc) => {
                let user = doc || req.session.user;
                // res.locals.user = doc || req.session.user;
                profileModel.findOne({
                    _id: user.selectProfile
                }).then(doc => {
                    if (!doc) { return next() }
                    user.profile = doc;
                    user.username = doc.UserName;
                    res.locals.user = user;
                    Raven.setContext({
                        user: {
                            id: user._id,
                            username: doc.UserName,
                            email: user.email
                        }
                    })
                    next()
                }, err => {
                    next(err)
                })
            })
        } else {
            res.locals.user = null;
            next()
        }
        res.locals.moment = moment;
    });

    app.use(function (req, res, next) {
        req.db = {};
        req.db.redis = redis;
        next()
    });

    if (process.env["RAVEN_TOKEN"]) {
        app.use(Raven.requestHandler());
    }

    // router
    app.use(require('./Routes/Urls'));

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        let err = new Error('Not Found');
        err.status = 404;
        throw err;
    });

    if (process.env["RAVEN_TOKEN"]) {
        app.use(Raven.errorHandler());
    }

    // error handle
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        if (process.env["RAVEN_TOKEN"] && res.sentry) {
            res.setHeader("X-Error-Id", res.sentry);
        }
        res.render('error', {
            message: err.message,
            error  : err
        });
    });

});

module.exports = app;