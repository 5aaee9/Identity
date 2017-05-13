/**
 * Created by Indexyz on 2017/5/14.
 */
'use strict';
const express = require('express');
let router = express.Router();

router.get('/', require('./Root').get);

router.get('/cancel/:appId', require('./Cancel').get);

module.exports = router;
