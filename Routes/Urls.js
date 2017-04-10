'use strict';
/**
 * Created by Indexyz on 2017/4/7.
 */
const express = require('express');
const Db = require('../Db/Db');
let router = express.Router();

// init db connection
Db(() => {
    router.get('/', (req, res, next) => {
        res.render('index')
    });
    router.use('/auth', require('./Auth/Urls'))
});

module.exports = router;
