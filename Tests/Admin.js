const should = require("should");
const db = require("mongoose");
const request = require("supertest");
const stringLib = require('../Utils/String');
const dbDefine = require("../Define/Db");
const userS = require("../Db/Schema/User");

let application = require("../App"),
    userService = require("../Db/Service/userService"),
    userModel = db.model(dbDefine.Db.USER_DB, userS);

describe("Admin", function() {
    var userName, email, password, user, cookies;
    beforeEach(function(done) {
        userName = stringLib.randomString(12)
        password = stringLib.randomString(12)
        email = stringLib.randomString(8) + "@example.com"
        userService.create(
            userName, 
            email,
            password,
            (err, u) => {
                if (err) return done(err);
                u.isAdmin = true
                u.save(err => {
                    if (err) return done(err);
                    user = u
                    done()
                })
            }
        )
    })
    
    describe("Access Test", function() {
        it("Test no Login", function(done) {
            request(application).get("/admin").expect(302).end(done)
        })
        it("Test not admin", function(done){

        })
        it("Test admin", function(done){

        })
    })

    afterEach(function(done) {
        userModel.remove({
            _id: user._id
        }).then(() => done()).catch(err => done(err))
    })
})