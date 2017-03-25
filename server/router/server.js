var express = require('express');
var router = express.Router();
var db = require('mongoose')
var userSchema = require('../schema/user')
var logSchema = require('../schema/log')

router.get("/ping", (req, res, next) => {
    res.send({ok: 1})
})

router.post("/loginByToken", (req, res, next) => {
    let logModel = db.model('logs', logSchema),
        userModel = db.model('users', userSchema),
        token = req.body.token,
        ip = req.body.ip,
        message = req.body.message; 
    if (!token || !ip || !message){
        res.status(412).send({error: "Precondition Failed"}); return;
    }
    userModel.findOne({"profile.authToken": token}, (err, doc) => {
        if (err){ res.status(500).send({"error": err.message}); return }
        if (!doc){ res.status(401).send({"error": "accessToken is error" }); return }
        let log = new logModel({
            log: message.replace("${player}", doc.username),
            user: doc._id,
            ip: ip
        }).save(err => {
            if (err) { next(err); return }
            res.send({
                userName: doc.username,
                userID: doc.profile.UserID
            })
        })
    })
})

module.exports = router;
