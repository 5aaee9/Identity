/**
 * Created by Indexyz on 2017/5/14.
 */
'use strict';
const express = require('express');
const multer  = require('multer');

let upload = multer({
    dest: 'tmp/',
    limits: { fileSize:  1024 * 64 }
});

let router = express.Router();

router.get('/', require('./Root').get);

router.post('/new', require('./Create').post);
router.get('/new', require('./Create').get);

router.get('/remove/:appId', require('./Remove').get);

router.get('/cancel/:appId', require('./Cancel').get);

router.post('/edit/:appId', upload.single('uploadLogo'), require('./Edit').post);
router.get('/edit/:appId', require('./Edit').get);

module.exports = router;
