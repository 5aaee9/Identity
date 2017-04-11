/**
 * Created by Indexyz on 2017/4/11.
 */
const db = require('mongoose');
const userSchema = require("../../Db/Schema/User");

module.exports.get = (req, res, next) => {
    let userModel = db.model("users", userSchema);
    userModel.findOne({
        _id: req.session.user._id
    }, (err, doc) => {
        if (err) { next(err); return }
        res.render("member/profile", {
            user: doc
        })
    });
};