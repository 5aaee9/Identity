/**
 * Created by Indexyz on 2017/4/10.
 */
"use strict";
const Router = require('co-router');
let router = Router();

router.get("/", require("./Index").get);
router.get("/profile", require("./Profile").get);
router.post("/profile", require("./Profile").post);

router.use("/skin", require("./Skin"));

router.use("/apps", require("./Apps/Urls"));
module.exports = router;
