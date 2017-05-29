const should = require("should");
const request = require("supertest");
const db = require("mongoose");
const userSchema = require('../Db/Schema/User');
const DbDefine = require('../Define/Db');
const stringLib = require('../Utils/String');
const Tsession = require('supertest-session');

let application = require("../App"),
    userModel = db.model(DbDefine.Db.USER_DB, userSchema);


describe("Member", function(){
    var user, password, agent, session;
    before(function(done){
        session = Tsession(application);
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
            session.post('/auth/login')
                   .send({
                        username: user.username,
                        password: password
                    })
                   .expect(302)
                   .end(function(err, res){
                        if(err) return done(err);
                        done();
                    })
        })
    })

    it("get member", function(done){
        session.get("/member")
               .expect(200)
               .end(done)
    })
    
    it("get profile", function(done){
        session.get("/member/profile")
               .expect(200)
               .end(done)
    })
    
    it("reset user-profile in profile", function(done){
        session.post("/member/profile")
               .send({
                   type: "resetUserKey"
               })
               .expect(200)
               .end(function(err, res){
                   if (err) { return done(err); }
                    userModel.findOne({
                        _id: user._id
                    }, (err, doc) => {
                        if (err) { return done(err); }
                        doc.profile.authToken.should.not.equal(user.profile.authToken)
                        user = doc;
                        done();
                    })
               })
    })

    it("set username in profile page", function(done){
        let randomUsername = stringLib.randomString(16);

        session.post("/member/profile")
               .send({
                   type: "changeUserName",
                   username: randomUsername
               })
               .expect(200)
               .end(function(err, res){
                   if (err) { return done(err) }
                   userModel.findOne({
                       username: randomUsername
                   }, (err, doc) => {
                       if (err) { return done(err); }
                       doc.username.should.equal(randomUsername)
                       user = doc;
                       done();
                   })
               })
    })

    it("get skin", function(done){
        session.get("/member/skin")
               .expect(200)
               .end(done)
    })

    it("test upload skin", function(done){
        session.post("/member/skin/skin")
               .send({ isSlim: "off" })
               .attach('uploadSkin', 'Tests/Resources/test-skin.png')
               .expect(302)
               .end(function(err, res){
                   if (err) return done(err);
                   res.text.should.equal("Found. Redirecting to /member/skin?succ=1")
                   done();
               })
    })

    it("test upload skin slim", function(done){
        session.post("/member/skin/skin")
               .send({ isSlim: "off" })
               .attach('uploadSkin', 'Tests/Resources/test-skin.png')
               .expect(302)
               .end(function(err, res){
                   if (err) return done(err);
                   res.text.should.equal("Found. Redirecting to /member/skin?succ=1")
                   userModel.findOne({
                       _id: user._id
                   }, (err, doc) => {
                       if (err) return done(err);
                       doc.skin.should.have.property('slim')
                       return done();
                   })
               })
    })

     it("test upload cap", function(done){
        session.post("/member/skin/cap")
               .send({ isSlim: "off" })
               .attach('uploadCup', 'Tests/Resources/test-cap.png')
               .expect(302)
               .end(function(err, res){
                   if (err) return done(err);
                   res.text.should.equal("Found. Redirecting to /member/skin?succ=1")
                   done();
               })
    })

    after(function(done){
        userModel.remove({
            _id: user._id
        }, err => {
            if (err) return done(err)
            done();
        })
    })
})