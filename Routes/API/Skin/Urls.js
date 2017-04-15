/**
 * Created by Indexyz on 2017/4/15.
 */
'use strict';
const express = require('express');
let router = express.Router();

router.get('/:username.json', require("./Profile").get);

module.exports = router;
