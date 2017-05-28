const should = require("should");
const request = require("supertest");
const db = require("mongoose");
const userSchema = require('../Db/Schema/User');
const DbDefine = require('../Define/Db');
const stringLib = require('../Utils/String');

let application = require("../App"),
    userModel = db.model(DbDefine.Db.USER_DB, userSchema);

describe("API", function(){
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
        describe("User Test", function(){
            var user, password;
            beforeEach(function(done){
                password = stringLib.randomString(16)
                user = new userModel({
                    username: stringLib.randomString(8),
                    password: password,
                    email: "test@email.com"
                })
                user.generatorID();
                user.refresh();
                user.refreshSession();
                user.save(err => {
                    if (err) return done(err);
                    done();
                })
            })

            it("test authenticate", function(done){
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
                        // Refresh Docment because doc is change
                        userModel.findOne({
                            _id: user._id
                        }, (err, doc) => {
                            if (err) return done(err)
                            if (!doc) return done(new Error("Not found user"))
                            
                            jsonObj.accessToken.should.equal(doc.profile.Token)
                            jsonObj.clientToken.should.equal(doc.profile.UUID)
                            jsonObj.selectedProfile.id.should.equal(doc.profile.UserID)
                            jsonObj.selectedProfile.name.should.equal(doc.profile.authToken)

                            done()
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
                        accessToken: user.profile.Token,
                        clientToken: user.profile.UUID
                    })
                    .expect(200)
                    .end(function(err, res){
                        if (err) return done(err)
                        let jsonObj = JSON.parse(res.text);
                        // Refresh Docment because doc is change
                        userModel.findOne({
                            _id: user._id
                        }, (err, doc) => {
                            if (err) return done(err)
                            if (!doc) return done(new Error("Not found user"))
                            
                            jsonObj.accessToken.should.equal(doc.profile.Token)
                            jsonObj.clientToken.should.equal(doc.profile.UUID)
                            jsonObj.selectedProfile.id.should.equal(doc.profile.UserID)
                            jsonObj.selectedProfile.name.should.equal(doc.profile.authToken)

                            done()
                        })
                    })
            })

            it("test refresh with error token", function(done){
                request(application)
                    .post("/api/mojang/refresh")
                    .set("content-type", "application/json")
                    .send({
                        accessToken: user.profile.Token,
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
                        accessToken: user.profile.Token,
                        clientToken: user.profile.UUID,
                        selectedProfile: "true"
                    })
                    .expect(400)
                    .end(done)
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
    })

    describe("Server", function(){
        it("ping", function(done){
            request(application)
                .get("/api/server/ping")
                .expect(200)
                .end(done)
        })
    })
})