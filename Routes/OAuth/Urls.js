/**
 * Created by Indexyz on 2017/4/30.
 */

const express = require('express');
let router = express.Router();

router.get('/', (req, res, next) => {
    res.render("auth/access_require")
    // res.status(204).send();
});

router.use('/authorize', (req, res, next) => {
    if (!req.session.user) {
        res.redirect("/auth/login?redirect=" + encodeURIComponent(req.originalUrl))
    } else {
        next()
    }
});
router.get('/authorize', require('./Authorize').get);
router.post('/authorize', require('./Authorize').post);

router.get('/getCode', require('./GetCode').get);

module.exports = router;