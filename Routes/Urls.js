"use strict";
/**
 * Created by Indexyz on 2017/4/7.
 */
const Router = require('co-router');
let router = Router();

function needLogin(req, res, next) {
    if (!req.session.user) { return res.redirect("/auth/login"); }
    next();
}

function needAdmin(req, res, next) {
    if (!req.session.user.isAdmin) { return res.redirect("/member"); }
    next()
}

router.get("/", (req, res, next) => {
    res.render("index")
});
router.use("/auth", require("./Auth/Urls"));
router.use("/oauth", require("./OAuth/Urls"));

router.use("/member", needLogin);
router.use("/member", require("./Member/Urls"));
router.use("/api", require("./API/Urls"));

router.use("/admin", needLogin);
router.use("/admin", needAdmin);
router.use("/admin", require("./Admin/Urls"));

// Get Global Resources

router.get("/resources/:fileId", require("./Resources").get);

module.exports = router;
