/**
 * Created by Indexyz on 2017/8/4.
 */
const express = require("express");

let router = express.Router();

router.get("/", require("./Index").get);

module.exports = router;
