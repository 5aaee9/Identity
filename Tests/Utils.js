const should = require("should");
const datetime = require("../Utils/DateTime")
const stringUtils = require("../Utils/String")

describe("Utils Test", function(){
    describe("Datetime", function(){
        let now = new Date();
        it("getNextDay", function(){
            datetime.getNextDay(now).getTime().should.equal(now.getTime() + 86400000)
        })
        it("getNextTimesDay", function(){
            datetime.getNextTimesDay(3, now).getTime().should.equal(now.getTime() + 86400000 * 3)
        })
        it("getPreDay", function(){
            datetime.getPreDay(now).getTime().should.equal(now.getTime() - 86400000)
        })
        it("getPreTimesDay", function(){
            datetime.getPreTimesDay(3, now).getTime().should.equal(now.getTime() - 86400000 * 3)
        })
        it("getZeroTime", function(){
            let testTime = datetime.getZeroTime(now)
            testTime.getTime().should.equal(now.getTime() - now.getHours() * 3600000 - now.getMinutes() * 60000 - now.getSeconds() * 1000)
        })
    })

    describe("String", function(){
        it("random string", function(){
            stringUtils.randomString(16).length.should.equal(16);
        })
        it("replace", function(){
            stringUtils.replace("a", "a", "b").should.equal("b")
            stringUtils.replace("A A C A", "A", "B").should.equal("B B C B")
        })
    })
})