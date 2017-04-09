'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const app = express();

app.set('views', path.join(__dirname, 'Views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// app.use(cookieParser(mConfig.salt));
// app.use(cookieSession({
//     secret: mConfig.salt
// }));
app.use(express.static(path.join(__dirname, 'Public')));

// app.use(function(req, res, next) {
//     res.locals.bitConv = require('./Utils/String').bitConv;
//     res.locals.config = mConfig;
//     if (req.session.user) {
//         new db().link((err, db) => {
//             if (err){
//                 res.sendStatus(500); return
//             }
//             var users = db.collection('users');
//             users.find({_id: ObjectID(req.session.user._id)}).toArray((err, docs) => {
//                 res.locals.user = docs[0] || req.session.user;
//                 next();
//             })
//         })
//     } else {
//         res.locals.user = null;
//         next()
//     }
//     // res.local.env = process.env
// });

app.use(require('./Routes/Urls'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('Error', {
            message: err.message,
            error  : err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error  : {}
    });
});

module.exports = app;
