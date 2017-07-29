const should = require("should");
const db = require('../Db/Db');

describe("Db", function(){
    it("get url", function(done){
        db.getUrl({
            "db_auth": false,
            "db_host": "127.0.0.1",
            "db_port": 1234,
            "db_name": "test"
        }).should.be.equal("mongodb://127.0.0.1:1234/test");
        done();
    })

    it("get url with addres", function(done){
        db.getUrl({
            "db_auth": false,
            "db_host": "db",
            "db_port": 1234,
            "db_name": "test"
        }).should.be.equal("mongodb://db:1234/test");
        done();
    })

    it("get url with auth", function(done){
        db.getUrl({
            "db_auth": true,
            "db_host": "127.0.0.1",
            "db_port": 1234,
            "db_name": "test",
            "db_username": "test",
            "db_password": "password"
        }).should.be.equal("mongodb://test:password@127.0.0.1:1234/test")
        done();
    })
    it("set db env ret", function(done) {
        process.env["MONGODB_URI"] = "mongodb://test:password@127.0.0.1:1234/test";
        db.getUrl({
            "db_host": "localhost"
        }).should.be.equal("mongodb://test:password@127.0.0.1:1234/test")
        process.env["MONGODB_URI"] = undefined;
        done()
    })
})