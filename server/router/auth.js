'use strict';
var express = require('express');
var router = express.Router();
var db = require('mongoose')
var mail = require('../helper/mail')
var userSchema = require('../schema/user')

function getCode(req){
    return req.body.code || req.query.code || req.param.code || req.headers.code
}

router.post("/", (req, res, next) => {
    let username = req.body.username,
        password = req.body.password,
        email    = req.body.email;
    let userModel = db.model('users', userSchema)
    let user = new userModel({ 
        username: username,
        password: password,
        email: email 
    })
    user.generatorEmailToken()
    user.generatorID()
    user.refresh()                                  // Init UUID for user
    user.refreshSession()
    user.save(err => {
        if (err){ next(err); return }
        mail.send(
            user.email, "VeryAuth verify mail", "Your verify url: " + 
            req.protocol + '://' + req.get('host') + "/api/auth/email?code=" + user.emailToken,
            err => {
                if (err){ next(err); return }
                res.send({
                    ok: 1,  
                    token: user.accessToken
                })
            }
        )
    })
})

router.post('/login', (req, res, next) => {
    let username = req.body.username,
        password = req.body.password
    let userModel = db.model('users', userSchema)
    let docs = userModel.findOne({
        username: username
    }, (err, doc) => {
        if (err){
            next(err); return
        }
        if (!doc){
            res.status(404).send({ error: "Not found match user" }); return
        } 
        if (!doc.comparePassword(password)){
            res.status(404).send({ error: "Not found match user" }); return
        }
        if (doc.emailToken != ""){
            res.status(412).send({ error: "Email not verifyed" }); return
        }
        doc.refreshSession()
        doc.save(err => {
            if (err) { next(err); return }
            res.send({
                token: doc.accessToken,
                username: doc.username,
                ok: 1
            })
        })
    })
})

router.get("/email", (req, res, next) => {
    let code = getCode(req),
        userModel = db.model('users', userSchema)
    if (!code){ res.redirect("/#/email?error=true"); return } 
    userModel.findOne({ "emailToken": code }).then(doc => {
        if (!doc) { res.redirect("/#/email?error=true"); return }
        doc.emailToken = ""
        doc.save()
        res.redirect("/#/email")
    }).catch(err => {
        res.redirect("/#/email?error=true")
    })
})

module.exports = router;
