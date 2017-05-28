/**
 * Created by Indexyz on 2017/4/30.
 */
"use strict";
const db = require("mongoose");
const grid = require("gridfs-stream");

module.exports.get = (req, res ,next) => {
    let gfs = grid(db.connection.db);
    if (!req.params.fileId || req.params.fileId === "undefined"){
        return res.sendStatus(404);
    }
    gfs.exist({
        _id: db.Types.ObjectId(req.params.fileId)
    }, (err, found) => {
        if (!found || err) { res.status(404).send(); return }
        // res.setHeader("Content-disposition", "attachment;");
        gfs.createReadStream({
            _id: db.Types.ObjectId(req.params.fileId)
        }).pipe(res);
    })
};