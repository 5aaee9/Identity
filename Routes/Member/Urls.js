/**
 * Created by Indexyz on 2017/4/10.
 */
'use strict';
const express = require('express');
let router = express.Router();

router.get("/", require("./Index").get);
router.get("/profile", require("./Profile").get);
router.post("/profile", require("./Profile").post);
// router.post("/skin/*", multipartMiddleware, (req, res, next) => {
//     // File to bigger
//     console.log(req.files.uploadSkin);
//     if (req.files.uploadSkin.size >= 1024 * 512) { res.redirect("member/skin?err=TooBigFile"); return }
//     if (!req.files.uploadSkin.originalFilename.toLowerCase().endsWith(".png")){
//         res.redirect("member/skin?err=FileTypeError"); return
//     }
//     next()
// });

router.use("/skin", require("./Skin"));

router.get("/apps", require("./Apps").get);

module.exports = router;
