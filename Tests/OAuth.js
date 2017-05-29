const should = require("should");
const request = require("supertest");
const db = require("mongoose");
const stringLib = require('../Utils/String');
const DbDefine = require('../Define/Db');
const appScheam = require('../Db/Schema/Application');
const userSchema = require('../Db/Schema/User');
const userAuthSchema = require('../Db/Schema/UserAuth');
const Tsession = require('supertest-session');

let application = require("../App"),
    appModel = db.model(DbDefine.Db.APPS_DB, appScheam),
    userModel = db.model(DbDefine.Db.USER_DB, userSchema),
    userAuthModel = db.model(DbDefine.Db.APP_USER_DB, userAuthSchema);


function JsonRes(done){
    return function(err, res){
        if (err) return done(err);
        res.text.should.be.ok();
        JSON.parse(res.text).should.be.ok();
        done();
    }
}

describe("OAuth Tests", function(){
    let app, user, session, password, appname, userauth;
    before(function(done){
        password = stringLib.randomString(16)
        appname = stringLib.randomString(16);
        session = Tsession(application);
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
                    session.post("/member/apps/new")
                        .send({
                            appname: appname
                        })
                        .expect(302)
                        .end(function(err, doc){
                                appModel.findOne({
                                    name: appname
                                }, (err, doc) => {
                                    if (err) return done(err);
                                    doc.should.be.ok();
                                    app = doc;
                                    return done();
                                });
                        });
                });
        })

    })

    it("index", function(done){
        request(application)
            .get("/oauth")
            .expect(204)
            .end(done)
    })

    it("user authorize without session", function(done){
        request(application)
            .get("/oauth/authorize")
            .expect(302)
            .end(done)
    })

    it("user authorize without response_type", function(done){
        session.get("/oauth/authorize")
            .expect(412)
            .end(done)
    })

    it("user authorize with not exist code", function(done){
        session.get("/oauth/authorize?response_type=code&client_id=not-exist")
            .expect(404)
            .end(done)
    })

    it("user authorize page", function(done){
        session.get("/oauth/authorize?response_type=code&client_id=" + app.client_id)
            .expect(200)
            .end(done)
    })

    it("user authorize", function(done){
        session.post("/oauth/authorize?response_type=code&client_id=" + app.client_id)
            .send({
                "get-login": "on"
            })
            .expect(302)
            .end(function(err, doc){
                userAuthModel.findOne({
                    app: app._id,
                    user: user._id
                }, (err, doc) => {
                    if (err) return done(err);
                    should.exist(doc);
                    userauth = doc;
                    done();
                });
            });
    })

    it("get code", function(done){
        let code = stringLib.randomString(16);
        session.get("/oauth/getCode?code=" + code)
            .expect(200)
            .end(function(err, res){
                if (err) return done(err);
                res.text.indexOf(code).should.not.equal(-1);
                done();
            })
    })

    describe("token", function(data){

        it("no authorization header", function(done){
            request(application)
                .post("/oauth/token")
                .expect(401)
                .end(JsonRes(done));
        })

        it("not Bearer in auth", function(done){
            request(application)
                .post("/oauth/token")
                .auth('not-barer', app.client_secret)
                .expect(401)
                .end(JsonRes(done));
        })

        it("not exist auth code", function(done){
            request(application)
                .post("/oauth/token")
                .auth('Bearer', "not-exist")
                .expect(401)
                .end(JsonRes(done));
        })

        it("get authorization code with error client code", function(done){
            request(application)
                .post("/oauth/token")
                .send({
                    "grant_type": "authorization_code",
                    "code": "error-code"
                })
                .auth('Bearer', app.client_secret)
                .expect(401)
                .end(JsonRes(done));
        })

        it("get authorization code", function(done){
            request(application)
                .post("/oauth/token")
                .send({
                    "grant_type": "authorization_code",
                    "code": userauth.code
                })
                .auth('Bearer', app.client_secret)
                .expect(200)
                .end(JsonRes(done));
        })

        it("refresh token with error refresh token", function(done){
            request(application)
                .post("/oauth/token")
                .send({
                    "grant_type": "refresh_token",
                    "refresh_token": "error-token"
                })
                .auth('Bearer', app.client_secret)
                .expect(401)
                .end(JsonRes(done));
        })

        it("refresh token", function(done){
            request(application)
                .post("/oauth/token")
                .send({
                    "grant_type": "refresh_token",
                    "refresh_token": userauth.refToken
                })
                .auth('Bearer', app.client_secret)
                .expect(200)
                .end(JsonRes(done));
        })

        it("invalid request", function(done){
            request(application)
                .post("/oauth/token")
                .send({
                    "grant_type": "invalid_request"
                })
                .auth('Bearer', app.client_secret)
                .expect(400)
                .end(JsonRes(done));
        })

    })

    after(function(done){
        appModel.remove({
            _id: app._id
        }, err => {
            if (err) return done(err);
            userModel.remove({
                _id: user._id
            }, done)
        })
    })
})