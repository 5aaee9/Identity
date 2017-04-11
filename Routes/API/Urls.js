/**
 * Created by Indexyz on 2017/4/11.
 */
'use strict';

const express = require('express');
let router = express.Router();

router.use("/mojang", require("./Mojang/Urls"));

module.exports = router;
