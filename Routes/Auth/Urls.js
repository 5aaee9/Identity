/**
 * Created by Indexyz on 2017/4/10.
 */
"use strict";
/**
 * Created by Indexyz on 2017/4/7.
 */
const express = require("express");
let router = express.Router();

router.get("/login", require("./Login").get);
router.post("/login", require("./Login").post);
router.get("/register", require("./Register").get);
router.post("/register", require("./Register").post);
router.get("/resend", require("./Resend").get);
router.get("/email", require("./Mail").get);

module.exports = router;
