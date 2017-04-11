/**
 * Created by Indexyz on 2017/4/11.
 */

const db = require("mongoose");
const logSchema = require("../../Db/Schema/Log");
const dateHelper = require("../../Utils/DateTime");

let getLastWeekLog = (user, func) => {
    let dateDict = {},
        count = 0;
    for (let i = 0; i <= 6; i++){
        let startTime = dateHelper.getPreTimesDay(i, dateHelper.getZeroTime(new Date()));
        let endTime = dateHelper.getPreTimesDay(i - 1, dateHelper.getZeroTime(new Date()));
        let logModel = db.model('logs', logSchema);
        logModel.count({
            user: user,
            date: {
                $gte: startTime,
                $lte: endTime
            }
        }, (err, num) => {
            if (err) { func(err); return }
            dateDict[i] = num;
            count ++;
            if (count === 7) {
                func(undefined, dateDict)
            }
        })
    }
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

let getLastLog = (user, func) => {
    let logModel = db.model('logs', logSchema);
    logModel.find({
        user: user
    }).limit(10).sort({date: -1}).then(docs => {
        func(undefined, docs)
    }).catch(err => {
        func(err)
    })
};

module.exports.get = (req, res, next) => {
    getLastWeekLog(req.session.user._id, (err, doc) => {
        getLastLog(req.session.user._id, (err, docs) => {
            res.render("member/index", {
                data: JSON.stringify(convToShow(doc)),
                logs: docs
            })
        })
    });
};
