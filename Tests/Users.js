const should = require("should");
const request = require("supertest");
const db = require("mongoose");
const userSchema = require('../Db/Schema/User');
const DbDefine = require('../Define/Db');
const stringLib = require('../Utils/String');
const dateLib = require("../Utils/DateTime");

const userService = require('../Db/Service/userService');

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
            it("when unable to register", function(done){
                process.env.DISABLE_REGISTER = 'true';
                request(application)
                    .get("/auth/register")
                    .expect(403)
                    .end(function(err, res){
                        process.env.DISABLE_REGISTER = undefined;
                        done()
                    })
            })

            it("when unable to register post", function(done){
                process.env.DISABLE_REGISTER = 'true';
                request(application)
                    .post("/auth/register")
                    .expect(403)
                    .end(function(err, res){
                        process.env.DISABLE_REGISTER = undefined;
                        done()
                    })
            })
        })
        describe("on", function(){
            var randomUsername, randomPassword, user, randomemail;
            beforeEach(function(done){
                this.timeout(6000)
                randomUsername = stringLib.randomString(8),
                randomPassword = stringLib.randomString(16);
                randomemail = stringLib.randomString(16) + "@true.mail";
                request(application)
                    .post("/auth/register")
                    .send({
                        username: randomUsername,
                        password: randomPassword,
                        email: randomemail
                    })
                    .expect(200)
                    .end(function(err, res){
                        userModel.findOne({
                            email: randomemail
                        }, (err, doc) => {
                            if (err) return done(err);
                            if (!doc) return done(new Error("Not found user"))
                            user = doc
                            done();
                        })
                })
            })
            it("resend email", function(done){
                this.timeout(10000)
                request(application)
                    .get("/auth/resend?mail=" + user.email)
                    .expect(200)
                    .end(done)
            })
            it("resend email with error address", function(done){
                request(application)
                    .get("/auth/resend")
                    .expect(302)
                    .end(done)
            })
            it("Email Verify", function(done){
                this.timeout(10000)
                request(application)
                    .post("/auth/register")
                    .send({
                        username: randomUsername,
                        password: randomPassword,
                        email: randomemail
                    })
                    .expect(200)
                    .end(function(err, res){
                        if (err) return done(err);
                        userModel.findOne({
                            email: randomemail
                        }).then(doc => {
                            request(application)
                                .get("/auth/email?code=" + doc.emailToken)
                                .expect(302)
                                .end(function(err, res){
                                    if (err) return done(err);
                                    userModel.findOne({
                                        email: randomemail
                                    }).then(doc => {
                                        doc.emailToken.should.equal("");
                                        done()
                                    })
                                })
                        })
                    })
            })
            it("exists user check", function(done){
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
                        res.text.indexOf("duplicate key error").should.not.equal(-1)
                        done()
                    })
            })
            it("remove expire users", function(done) {
                userModel.findOne({
                    _id: user._id
                }, (err, doc) => {
                    if (err) return done(err);
                    doc.join = dateLib.getPreTimesDay(2, new Date())
                    doc.save(err => {
                        userService.removeExpire((err) => {
                            if (err) return done(err);
                            userModel.findById(doc._id, (err, res) => {
                                if (err) return done(err);
                                if (res) return done(new Error("User " + res._id + " is not remvoed!"));
                                return done()
                            })
                        })
                    })
                })
            })
            
            it("remove user in request", function(done){
                user.join = dateLib.getPreTimesDay(2, new Date())
                user.save(err => {
                    request(application).get("/").expect(200).end(function(err, res) {
                        if (err) return err;
                        userModel.findById(user._id, (err, res) => {
                            if (err) return done(err);
                            if (res) return done(new Error("User " + res._id + " is not remvoed!"));
                            return done()
                        })
                    })
                })
            })

            afterEach(function(done){
                userModel.remove({
                    _id: user._id
                }, done)
            })
        })
    })
    describe("Login", function(){
        var user, cookies, password;
        beforeEach(function(done){
            password = stringLib.randomString(16)
            userService.create(stringLib.randomString(8), "test@email.com", password, (err, tuser) => {
                user = tuser
                if (err) return done(err);
                done();
            })
        })
        it("Get Login Page", function(done){
            request(application)
                .get('/auth/login')
                .expect(200)
                .end(function(err, res){
                    if (err) return done(err);
                    res.type.should.equal("text/html");
                    done();
                })
        })
        it("Login in", function(done){
            request(application)
                .post('/auth/login')
                .send({
                    email: user.email,
                    password: password
                })
                .expect(302)
                .end(function(err, res){
                    if(err) return done(err);
                    res.text.indexOf("mdl-chip__contact").should.equal(-1)
                    done();
                })
        })
        it("Login in with redirect", function(done){
            request(application)
                .post('/auth/login?redirect=/')
                .send({
                    email: user.email,
                    password: password
                })
                .expect(302)
                .end(function(err, res){
                    if(err) return done(err);
                    res.text.should.equal("Found. Redirecting to /")
                    done();
                })
        })
        it("Error password", function(done){
            request(application)
                .post('/auth/login')
                .send({
                    username: user.username,
                    password: "error"
                })
                .expect(200)
                .end(function(err, res){
                    if(err) return done(err);
                    res.text.indexOf("close").should.not.equal(-1)
                    done();
                })
        })

        describe("database",function(){

            it("compare password with error password", function(){
                user.comparePassword("error-password").should.be.false();
            })

            it("compare with true passowrd", function(){
                user.comparePassword(password).should.not.be.false();
            })

        })


        describe("reset password", function(){
            it("get page", function(done){
                request(application)
                    .get("/auth/reset")
                    .expect(200)
                    .end(done)
            })
            it("reset it", function(done){
                request(application)
                    .post("/auth/reset")
                    .send({
                        email: user.email
                    })
                    .expect(200)
                    .end(function(err, res){
                        userModel.findOne({
                            _id: user._id
                        }).then(doc => {
                            doc.comparePassword(user.password).should.be.false()
                            doc.password = password
                            doc.save(err => {
                                done()
                            })
                        }).catch(err => done(err))
                    })
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
})