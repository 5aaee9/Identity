/**
 * Created by Indexyz on 2017/4/10.
 */
'use strict';
const express = require('express');
let router = express.Router();

router.get("/", require("./Index").get);

module.exports = router;
