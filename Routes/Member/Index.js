/**
 * Created by Indexyz on 2017/4/11.
 */
"use strict";
const db = require("mongoose");
const logSchema = require("../../Db/Schema/Log");
const dateHelper = require("../../Utils/DateTime");
const co = require("co");

let getLastWeekLog = function* (user) {
    let res = {};
    for (let i = 0; i <= 6; i++){
        let startTime = dateHelper.getPreTimesDay(i, dateHelper.getZeroTime(new Date()));
        let endTime = dateHelper.getPreTimesDay(i - 1, dateHelper.getZeroTime(new Date()));
        let logModel = db.model("logs", logSchema);
        res[i] = logModel.count({
            user: user,
            date: {
                $gte: startTime,
                $lte: endTime
            }
        });
    }
    return Promise.resolve(yield res)
};

let convToShow = (doc) => {
    let dateList = [];
    for (let i = 0; i <= 6; i++){
        dateList.push({
            label: dateHelper.getPreTimesDay(i , dateHelper.getZeroTime(new Date())).toString().substr(0, 10),
            x: 6 - i,
            y: doc[i]
        })
    }
    return dateList.reverse()
};

let getLastLog = function* (user)  {
    const logModel = db.model("logs", logSchema);
    return Promise.resolve(yield logModel.find({
        user: user
    }).limit(10).sort({date: -1}))
};

module.exports.get = function* (req, res, next) {
    res.render("member/index", {
        data: JSON.stringify(convToShow(yield getLastWeekLog(req.session.user._id))),
        logs: yield getLastLog(req.session.user._id)
    })
};
