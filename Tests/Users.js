const should = require("should");
const request = require("supertest");
const db = require("mongoose");
const userSchema = require('../Db/Schema/User');
const DbDefine = require('../Define/Db');
const stringLib = require('../Utils/String');

let application = require("../App"),
    userModel = db.model(DbDefine.Db.USER_DB, userSchema);

describe("User", function () {
    describe("Register", function(){
        it("GET Register Page", function(done){
            request(application)
                .get("/auth/register")
                .expect(200)
                .end(function(err, res){ 
                    if (err) return done(err)
                    res.type.should.equal("text/html");
                    done();
                })
        })
        describe("with", function(){
            it("error email", function(done){
                request(application)
                    .post("/auth/register")
                    .send({
                        username: stringLib.randomString(8),
                        password: stringLib.randomString(16),
                        email: stringLib.randomString(4)
                    })
                    .expect(401)
                    .end(function(err, res){
                        if (err) return done(err)
                        done();
                    })
            })
            it("error username", function(done){
                request(application)
                    .post("/auth/register")
                    .send({
                        username: stringLib.randomString(2),
                        password: stringLib.randomString(16),
                        email: "test@true.mail"
                    })
                    .expect(401)
                    .end(function(err, res){
                        if (err) return done(err)
                        done();
                    })
            })
            it("error passowrd", function(done){
                request(application)
                    .post("/auth/register")
                    .send({
                        username: stringLib.randomString(8),
                        password: stringLib.randomString(5),
                        email: "test@true.mail"
                    })
                    .expect(401)
                    .end(function(err, res){
                        if (err) return done(err)
                        done();
                    })
            })
            it("exists user", function(done){
                let randomUsername = stringLib.randomString(8),
                    randomPassword = stringLib.randomString(16);
                request(application)
                    .post("/auth/register")
                    .send({
                        username: randomUsername,
                        password: randomPassword,
                        email: "test@true.mail"
                    })
                    .expect(200)
                    .end(function(err, res){
                        console.log(res.viewName)
                        if (err) return done(err)
                        request(application)
                            .post("/auth/register")
                            .send({
                                username: randomUsername,
                                password: randomPassword,
                                email: "test@true.mail"
                            })
                            .expect(200)
                            .end(function(err, res){
                                if (err) return done(err)
                                userModel.remove({
                                    username: randomUsername
                                }, err => {
                                    if (err) return done(err);
                                    return done();
                                })
                            })
                    })
            })
        })
        it("Register User", function(done){
            let randomUsername = stringLib.randomString(8),
                randomPassword = stringLib.randomString(16);
            request(application)
                    .post("/auth/register")
                    .send({
                        username: randomUsername,
                        password: randomPassword,
                        email: "test@true.mail"
                    })
                    .expect(200)
                    .end(function(err, res){
                        userModel.findOne({
                            username: randomUsername
                        }).then(doc => {
                            if (!doc) { return done(new Error("Not found created user")); }
                            userModel.remove({
                                username: randomUsername
                            }, err => {
                                if (err) { return done(err) }
                                done();
                            })
                        }, err => {
                            return done(err)
                        })
                    })
        })
    })
})