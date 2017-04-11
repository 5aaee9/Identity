/**
 * Created by Indexyz on 2017/4/11.
 */
'use strict';

const express = require('express');
let router = express.Router();

router.get("/ping", require("./Ping").get);
router.post("/loginByToken", require('./LoginByToken').post);

module.exports = router;
