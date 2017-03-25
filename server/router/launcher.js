'use strict';
var express = require('express');
var mongo = require('mongoose')
var userSchema = require('../schema/user')
var router = express.Router();

/* 
    Somethings:
        - Mojang.accessToken => user.profile.Token
        - Mojang.clientToken => user.profile.UUID

*/

// You need send Content-Type: application/json at request
router.use((req, res, next) => {
    if (!req.headers["content-type"].startsWith("application/json")){
        console.log(req.headers)
        res.status(415).send({
            "error": "Unsupported Media Type",
            "errorMessage": "The server is refusing to service the request because the entity of the request is in a format not supported by the requested resource for the requested method"
        }); return
    } else {
        next()
    }
})

// GET method is not allowed
router.get("*", (req, res, next) => {
    res.status(405).send({
        "error": "Method Not Allowed",
        "errorMessage": "The method specified in the request is not allowed for the resource identified by the request URI"
    })
})

router.post('/authenticate', (req, res, next) => {
    let username = req.body.username,
        password = req.body.password,
        userModel = mongo.model('users', userSchema)
    userModel.findOne({
        email: username,
        password: userSchema.getSaltedPassword(password)
    }).then(doc => {
        if (!doc) {
            res.status(403).send({
                "error": "ForbiddenOperationException",
                "errorMessage": "Invalid credentials. Invalid username or password."
            }); return
        }
        doc.refresh()
        if (req.body.clientToken){
            doc.profile.UUID = req.body.clientToken
        }
        doc.save(err => {
            if (err) { next(err); return }
            let retDoc = {
                accessToken: doc.profile.Token,
                clientToken: doc.profile.UUID,
                selectedProfile: {
                    id: doc.profile.ProfileID,
                    name: doc.profile.authToken,
                },
                availableProfiles: [{
                    id: doc.profile.ProfileID,
                    name: doc.profile.authToken,
                }]
            }
            if (req.body.requestUser) {
                retDoc["user"] = {
                    id: doc.profile.UserID
                }
            }
            res.send(retDoc)
        })
    }).catch(e => { next(e); return })
})

router.post('/refresh', (req, res, next) => {
    let token = req.body.accessToken,
        uuid = req.body.clientToken,
        userModel = mongo.model('users', userSchema)
    
    userModel.findOne({
        "profile.UUID": uuid,
        "profile.Token": token
    }).then(doc => {
        if (!doc){
            res.status(403).send({
                "error": "ForbiddenOperationException",
                "errorMessage": "Invalid token."
            }); return
        }
        if (req.body.selectedProfile){
            res.status(400).send({
                "error": "IllegalArgumentException",
                "errorMessage": "Access token already has a profile assigned."
            }); return
        }
        doc.refresh()
        doc.save(err => {
            if (err) { next(err); return }
            let retDoc = {
                accessToken: doc.profile.Token,
                clientToken: doc.profile.UUID,
                selectedProfile: {
                    id: doc.profile.ProfileID,
                    name: doc.profile.authToken,
                },
            }
            if (req.body.requestUser) {
                retDoc["user"] = {
                    id: doc.profile.UserID
                }
            }
            res.send(retDoc)
        })
    }).catch(err => { next(err); return })
})

router.post('/validate', (req, res, next) => {
    let token = req.body.accessToken,
        uuid = req.body.clientToken,
        userModel = mongo.model('users', userSchema)
    userModel.findOne(uuid ? {
        "profile.UUID": uuid,
        "profile.Token": token
    } : { "profile.Token": token }).then(doc => {
        if (!doc) { res.status(403).send({
            "error": "ForbiddenOperationException",
            "errorMessage": "Invalid token"
        }); return}
        res.status(204).send()
    })
})

router.post('/signout', (req, res, next) => {
    let username = req.body.username,
        password = req.body.password,
        userModel = mongo.model('users', userSchema)
    userModel.findOne({
        email: username,
        password: userSchema.getSaltedPassword(password)
    }).then(doc => {
        if (!doc) { res.status(403).send({
            "error": "ForbiddenOperationException",
            "errorMessage": "Invalid credentials. Invalid username or password."
        }); return}
        doc.refresh()
        doc.save(err => {
            if (err) { next(err); return }
            res.status(204).send()
        })
    })
})

router.post("/invalidate", (req, res, next) => {
    let token = req.body.accessToken,
        uuid = req.body.clientToken,
        userModel = mongo.model('users', userSchema)
    userModel.findOne({
        "profile.UUID": uuid,
        "profile.Token": token
    }).then(doc => {
        if (!doc) { res.status(204).send(); return }
        doc.refresh()
        doc.save(err => {
            if (err) { next(err); return }
            res.status(204); return
        })
    }).catch(err => {
        next(err); return
    })
})

module.exports = router;
