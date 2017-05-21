/**
 * Created by Indexyz on 2017/5/14.
 */
'use strict';
const express = require('express');
let router = express.Router();

router.get('/', require('./Root').get);

router.post('/new', require('./Create').post);
router.get('/new', require('./Create').get);

router.get('/remove/:appId', require('./Remove').get);

router.get('/cancel/:appId', require('./Cancel').get);

module.exports = router;
