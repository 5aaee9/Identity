/**
 * Created by Indexyz on 2017/7/18.
 */

const i18n = require("../../i18n").__;

module.exports.get = (req, res, next) => {
    req.session.user = null;
    return res.redirect("/auth/login?info=" + encodeURIComponent(i18n("logoutSuccess")))
};