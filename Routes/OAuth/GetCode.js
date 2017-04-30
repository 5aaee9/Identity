/**
 * Created by Indexyz on 2017/5/1.
 */

module.exports.get = (req, res, next) => {
    res.render("auth/get_code", {
        code: req.query.code
    })
};