const should = require("should");
const request = require("supertest");

let application = require("../App");

describe("Application Index", function () {
    it("respond with root", function (done) {
        request(application)
            .get("/")
            .expect(200)
            .end(function (err, res) {
                res.type.should.equal("text/html");
                if (err) return done(err);
                done()
            })
    })
});

