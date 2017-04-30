/**
 * Created by Indexyz on 2017/4/30.
 */

const express = require('express');
let router = express.Router();

router.get('/', (req, res, next) => {
    res.render("auth/access_require")
    // res.status(204).send();
});



module.exports = router;