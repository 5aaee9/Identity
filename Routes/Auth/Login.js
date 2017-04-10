/**
 * Created by Indexyz on 2017/4/10.
 */
'use strict';
/**
 * Created by Indexyz on 2017/4/7.
 */
module.exports.get = (req, res, next) => {
    res.render("auth/login", {
        "info": req.query.info
    })
};