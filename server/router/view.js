'use strict';
var express = require('express');
var router = express.Router();
var db = require('mongoose')
var userSchema = require('../schema/user')
var logSchema = require('../schema/log')

function getToken(req){
    return req.body.token || req.query.token || req.param.token || req.headers.token
}
function getUser(req){
    return req.body.user || req.query.user || req.param.user || req.headers.user
}

router.get('/', (req, res, next) => {
    res.send(getToken(req))
})
router.post('/', (req, res, next) => {
    res.send(getToken(req))
})
router.get("/log", (req, res, next) => {
    let logModel = db.model('logs', logSchema),
        user = getUser(req)
    logModel.find({
        user: user
    }).limit(10).sort({
        date: -1
    }).then(docs => {
        res.send(docs)
    }).catch(e => { next(e) })
})
router.get("/info", (req, res, next) => {
    let token = getToken(req),
        userModel = db.model('users', userSchema)
    userModel.findOne({ accessToken: token }, (err, doc) => {
        if (err) { next(err); return }
        res.send({
            username: doc.username,
            email: doc.email,
            lastUsing: doc.lastUsing,
            _id : doc._id
        })
    })
    
})

module.exports = router;
