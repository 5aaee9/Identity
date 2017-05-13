/**
 * Created by Indexyz on 2017/5/13.
 */

const userAuth = require('../../Db/Schema/UserAuth');
const appsSchema = require('../../Db/Schema/Application');
const db = require('mongoose');
const dbName = require('../../Define/Db');

let userAuthModel = db.model(dbName.Db.APP_USER_DB, userAuth),
    appModel = db.model(dbName.Db.APPS_DB, appsSchema);

module.exports.get = (req, res, next) => {
    userAuthModel.find({
        user: req.session.user._id
    }, (err, docs) => {
        if (err) { return next(err) }

        let len = docs.length,
            flag = 0,
            retDoc = [];

        let tNext = () => {
            appModel.find({
                owner: req.session.user._id
            }, (err, apps) => {
                if (err) { return next(err) }
                res.render('member/oauth', {
                    userAuth: retDoc,
                    createApps: apps
                })
            })
        };

        if (len === 0) { return tNext() }

        docs.forEach(doc => {
            appModel.findOne({
                _id: doc.app
            }, (err, ndoc) => {
                if (err) { return next(err) }

                ndoc.source = doc;
                retDoc.push(ndoc);
                if (len === ++flag) {
                    tNext()
                }
            })
        });

    });
};