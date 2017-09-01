/**
 * Created by Indexyz on 2017/7/18.
 */

const userService = require("../../Db/Service/userService");
const i18n = require("../../i18n").__;

module.exports.get = (req, res, next) => {
    if (!req.query.code){
        res.render("auth/reset")
    }
};

module.exports.post = function* (req, res, next)  {
    let {email} = req.body;
    const user = yield userService.foundByEmail(email);
    if (user){
        let password = user.setRandomPassword();
        yield user.save();
        yield user.sendMail(i18n("mail.resetPassword"), i18n("mail.passwordSetTo") + password)
        res.redirect("/auth/login?info=" + encodeURIComponent(i18n("message.passwordRested")))
    } else {
        res.redirect("/auth/login?info=" + encodeURIComponent(i18n("message.passwordRested")))
    }
};