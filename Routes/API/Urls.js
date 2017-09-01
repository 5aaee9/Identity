/**
 * Created by Indexyz on 2017/4/11.
 */
'use strict';

const Router = require('co-router');
let router = Router();

router.use("/mojang", require("./Mojang/Urls"));
router.use("/skin", require("./Skin/Urls"));
router.use("/yggdrasil", require("./Yggdrasil/Urls"));

module.exports = router;
