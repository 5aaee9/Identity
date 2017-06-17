const should = require("should");
const request = require("supertest");
const db = require("mongoose");
const userSchema = require('../Db/Schema/User');
const logSchema = require('../Db/Schema/Log');
const DbDefine = require('../Define/Db');
const stringLib = require('../Utils/String');

const userService = require('../Db/Service/userService');
const profileService = require('../Db/Service/profileService');

let application = require("../App"),
    userModel = db.model(DbDefine.Db.USER_DB, userSchema),
    logModel = db.model(DbDefine.Db.LOGS_DB, logSchema);

describe("API", function(){
    var user, password, profile;
    
    beforeEach(function(done){
        password = stringLib.randomString(16)
 
        userService.create(stringLib.randomString(8), "test@email.com", password, (err, tuser) => {
            if (err) { return done(err); }
            user = tuser; 
            userService.getProfile(user, tprofile => {
                if (!tprofile) return done(new Error("Don't get profile"))
                profile = tprofile
                done()
            })
        })
    })
    
    describe("Mojang API", function(){
        it("Header error", function(done){
            request(application)
                .get("/api/mojang")
                .expect(415)
                .end(function(err, res){
                    if (err) return done(err);
                    res.text.indexOf("Unsupported Media Type").should.not.equal(-1);
                    done();
                })
        })
        it("Method error", function(done){
            request(application)
                .get("/api/mojang")
                .set("content-type", "application/json")
                .expect(405)
                .end(function(err, res){
                    if (err) return done(err);
                    res.text.indexOf("Method Not Allowed").should.not.equal(-1);
                    done();
                })
        })
        describe("User Inferce", function(){

            beforeEach(done => {
                userModel.findOne({
                    _id: user._id
                }).then(doc => {
                    user = doc;
                    done();
                })
            })

            it("test authenticate", function(done){
                this.timeout(6000)
                request(application)
                    .post("/api/mojang/authenticate")
                    .set("content-type", "application/json")
                    .send({
                        username: user.email,
                        password: password
                    })
                    .expect(200)
                    .end(function(err, res){
                        if (err) return done(err)
                        let jsonObj = JSON.parse(res.text);
                        userModel.findOne({
                            _id: user._id
                        }).then(doc => {
                            profileService.getProfileById(doc.selectProfile, profile => {
                                jsonObj.accessToken.should.equal(profile.accessToken)
                                jsonObj.clientToken.should.equal(profile.clientToken)
                                jsonObj.selectedProfile.id.should.equal(profile.ProfileID)
                                jsonObj.selectedProfile.name.should.equal(profile.UserName)
                                done()
                            })
                        })
                    })
                    
            })

            it("test error password when authenticate", function(done){
                request(application)
                    .post("/api/mojang/authenticate")
                    .set("content-type", "application/json")
                    .send({
                        username: user.email,
                        password: "err"
                    })
                    .expect(403)
                    .end(done)
            })

            it("test refresh", function(done){
                request(application)
                    .post("/api/mojang/refresh")
                    .set("content-type", "application/json")
                    .send({
                        accessToken: profile.accessToken,
                        clientToken: profile.clientToken
                    })
                    .expect(200)
                    .end(function(err, res){
                        if (err) return done(err)
                        let jsonObj = JSON.parse(res.text);
                        // Refresh Docment because doc is change
                         profileService.getProfileById(user.selectProfile, profile => {
                            jsonObj.accessToken.should.equal(profile.accessToken)
                            jsonObj.clientToken.should.equal(profile.clientToken)
                            jsonObj.selectedProfile.id.should.equal(profile.ProfileID)
                            jsonObj.selectedProfile.name.should.equal(profile.UserName)
                            done()
                        })
                    })
            })

            it("test refresh with error token", function(done){
                request(application)
                    .post("/api/mojang/refresh")
                    .set("content-type", "application/json")
                    .send({
                        accessToken: profile.accessToken,
                        clientToken: "error-client-token"
                    })
                    .expect(403)
                    .end(done)
            })

            it("test refresh with select profile", function(done){
                request(application)
                    .post("/api/mojang/refresh")
                    .set("content-type", "application/json")
                    .send({
                        accessToken: profile.accessToken,
                        clientToken: profile.clientToken,
                        selectedProfile: "true"
                    })
                    .expect(400)
                    .end(done)
            })
            
            it("test validate", function(done){
                request(application)
                    .post("/api/mojang/validate")
                    .set("content-type", "application/json")
                    .send({
                        accessToken: profile.accessToken,
                        clientToken: profile.clientToken,
                    })
                    .expect(204)
                    .end(done)
            })

            it("test validate with error token", function(done){
                request(application)
                    .post("/api/mojang/validate")
                    .set("content-type", "application/json")
                    .send({
                        accessToken: profile.accessToken,
                        clientToken: "error-client-token",
                    })
                    .expect(403)
                    .end(done)
            })

            it("test signout", function(done){
                request(application)
                    .post("/api/mojang/signout")
                    .set("content-type", "application/json")
                    .send({
                        username: user.email,
                        password: password
                    })
                    .expect(204)
                    .end(done)
            })

            it("test signout with error", function(done){
                request(application)
                    .post("/api/mojang/signout")
                    .set("content-type", "application/json")
                    .send({
                        username: user.email,
                        password: "error"
                    })
                    .expect(403)
                    .end(done)
            })

            it("test invalidate", function(done){
                request(application)
                    .post("/api/mojang/invalidate")
                    .send({
                        accessToken: profile.accessToken,
                        clientToken: profile.clientToken,
                    })
                    .expect(204)
                    .end(done)
            })

            it("test invalidate with error token", function(done){
                request(application)
                    .post("/api/mojang/invalidate")
                    .send({
                        accessToken: profile.accessToken,
                        clientToken: "error-client-token",
                    })
                    .expect(204)
                    .end(done)
            })

        })
    })

    describe("Skin", function(){

        it("get skin with error user", function(done){
            request(application)
                .get("/api/skin/not-exist.json")
                .expect(401)
                .end(done)
        })

        it("get skin", function(done){
            request(application)
                .get("/api/skin/" + profile.UserName + ".json")
                .expect(200)
                .end(done)
        })

        it("get user cap", function(done){
            request(application)
                .get("/api/skin/cap/" + profile.UserName + ".png")
                .expect(302)
                .end(done)
        })

        it("get user skin", function(done){
            request(application)
                .get("/api/skin/skin/" + profile.UserName + ".png")
                .expect(302)
                .end(done)
        })

        it("get user resources without id", function(done){
            request(application)
                .get("/api/skin/textures/")
                .expect(404)
                .end(done)
        })

        it("get user resources with undefined id", function(done){
            request(application)
                .get("/api/skin/textures/undefined")
                .expect(404)
                .end(done)
        })

        it("get user resources", function(done){
            request(application)
                .get("/api/skin/textures/user-res")
                .expect(302)
                .end(done)
        })

    })

    describe("Yggdrasil", function(){
        var serverId, tp, tu;
        before(function(done){
            serverId = stringLib.randomString(16)
            userService.create(stringLib.randomString(8), "test@emmail.com", password, (err, tuser) => {
                if (err) { return done(err); }
                tu = tuser; 
                userService.getProfile(user, tprofile => {
                    if (!tprofile) return done(new Error("Don't get profile"))
                    tp = tprofile
                    done()
                })
            })
        })

        it("has joinserver before join server", function(done){
            request(application).get("/api/yggdrasil/hasjoinserver?serverId=" + serverId + "&username=" + tp.UserName)
            .expect(204)
            .end(done)
        })

        it("test joinserver", function(done){
            console.log(profile)
            request(application).post("/api/yggdrasil/joinserver")
            .send({
                accessToken: tp.accessToken,
                selectedProfile: tp.ProfileID,
                serverId: serverId
            })
            .expect(204)
            .end(done)
        })
        
        it("test join server with unknow profile", function(done){
            request(application).post("/api/yggdrasil/joinserver")
            .send({
                accessToken: "error access token",
                selectedProfile: tp.ProfileID,
                serverId: serverId
            })
            .expect(403)
            .end(done)
        })

        it("test join server with error serverId", function(done){
            request(application).get("/api/yggdrasil/hasjoinserver?serverId=test&username=" + tp.UserName)
            .expect(204)
            .end(done)
        })

        it("test has join server", function(done){
            console.log(profile)

            request(application).get("/api/yggdrasil/hasjoinserver?serverId=" + serverId + "&username=" + tp.UserName)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                jsonObj = JSON.parse(res.text)
                jsonObj.should.not.be.null();

                profileService.getProfileByProfileId(tp.ProfileID, newProfile => {

                    console.log(newProfile)
                    console.log(res.text)

                    jsonObj.id.should.be.equal(newProfile.accessToken)
                    jsonObj.name.should.be.equal(newProfile.UserName)
                    console.log(newProfile)
                    done()
                })
            })
        })

        after(function(done){
            userModel.remove({
                email: "test@email.com2"
            }).then(er => done())
        })

    })

    afterEach(function(done){
        userModel.remove({
            _id: user._id
        }, err => {
            if (err) return done(err)
            done();
        })
    })
})