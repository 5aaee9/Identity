/**
 * Created by Indexyz on 2017/4/10.
 */
'use strict';
const express = require('express');
let router = express.Router();

router.get("/", require("./Index").get);
router.get("/profile", require("./Profile").get);
router.post("/profile", require("./Profile").post);

module.exports = router;
