/**
 * Created by Indexyz on 2017/4/15.
 */
"use strict";
const db = require("mongoose");
const grid = require("gridfs-stream");
const userSchema = require("../../Db/Schema/User");
const multer  = require("multer");
const express = require("express");
const fs = require("fs");

let router = express.Router();
let upload = multer({
    dest: "tmp/",
    limits: { fileSize:  1024 * 64 }
});

grid.mongo = db.mongo;
let gfs = grid(db.connection.db);

module.exports = router;

let setDb = (fileType, fileId, user, func) => {
    let userModel = db.model("users", userSchema);
    userModel.findOne({
        _id: user
    }, (err, doc) => {
        if (err || !doc) { func(new Error("Not found")); return }
        let actions = {
            "cap": () => { doc.skin.cap = fileId },
            "skin": () => { doc.skin.skin = fileId },
            "slim": () => { doc.skin.slim = fileId }
        };
        actions[fileType]();
        doc.save(err => {
            if (err) { func(err) }
            else func()
        })
    });
};

module.exports.postCap = (req, res, next) => {

};

let uploadFile = (file, req, type, func) => {
    let writeStream = gfs.createWriteStream({
        filename: file.filename + ".png",
        mode: "w",
        content_type: file.mimetype
    });
    writeStream.on("close", filen => {
        fs.unlink(file.path, err => {
            if (err) { func(err); return }
            setDb(type, filen._id, req.session.user._id, err => {
                func(err)
            })
        })
    });
    fs.createReadStream(file.path).pipe(writeStream);
};

router.get("/", (req, res, next) => {
    res.render("member/skin", {
            succ: req.query.succ === "1",
            err: req.query.err ? req.query.err : null
        }
    );
});

router.post("/cap", upload.single("uploadCup"), (req, res, next) => {
    uploadFile(req.file, req, "cap", err => {
        if (err) { return res.redirect("/member/skin?err=" + encodeURIComponent(err.message)) }
        res.redirect("/member/skin?succ=1")
    })
});

router.post("/skin", upload.single("uploadSkin"), (req, res, next) => {
    uploadFile(req.file, req, req.body.isSlim === "on" ? "slim" : "skin", err => {
        if (err) { return res.redirect("/member/skin?err=" + encodeURIComponent(err.message)) }
        res.redirect("/member/skin?succ=1")
    })
});

router.get("/skin", (req, res, next) => {
    let userModel = db.model("users", userSchema);
    userModel.findOne({
        _id: req.session.user._id
    }, (err, doc) => {
        if (err) { return res.redirect("/member/skin?err=" + encodeURIComponent(err.message)) }
        res.redirect("/resources/" + doc.skin.skin)
    })
});