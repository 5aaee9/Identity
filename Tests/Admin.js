const should = require("should");
const db = require("mongoose");
const request = require("supertest");
const stringLib = require('../Utils/String');
const dbDefine = require("../Define/Db");
const userS = require("../Db/Schema/User");
const Tsession = require('supertest-session');
const co = require("co");

let application = require("../App"),
    userService = require("../Db/Service/userService"),
    userModel = db.model(dbDefine.Db.USER_DB, userS);

describe("Admin", function() {
    var userName, email, password, user, cookies, session;
    before(function(done) {
        session = Tsession(application);
        done()
    })

    beforeEach(function(done) {
        userName = stringLib.randomString(12)
        password = stringLib.randomString(12)
        email = stringLib.randomString(8) + "@example.com"
        co(function*(){
            const u = yield userService.create(
                userName, 
                email,
                password
            )
            u.isAdmin = true
            yield u.save()
            user = u
        
        }).then(() => {
            session.post('/auth/login')
            .send({
                email: user.email,
                password: password
            })
            .expect(302)
            .end(function(err, res){
                if(err) return done(err);
                done();
            });
        })
    })
    
    describe("Access Test", function() {
        it("Test no Login", function(done) {
            request(application).get("/admin").expect(302).end(done)
        })
        it("Test not admin", function(done){
            userModel.findById(user._id, (err, res) => {
                if (err) return done(err);
                res.isAdmin = false;
                res.save(() => {
                    session.get("/admin")
                        .expect(200)
                        .end(done)
                })
            })
        })
        it("Test admin", function(done){

            session.get("/admin")
                .expect(200)
                .end(done)
        })
        it("Test Admin User View", function(done){
            session.get("/admin/users")
                .expect(200)
                .end(done)
        })
    })

    afterEach(function(done) {
        userModel.remove({
            _id: user._id
        }).then(() => done()).catch(err => done(err))
    })
})