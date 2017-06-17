'use strict';

const express = require('express');
let router = express.Router();

router.post("/joinserver", require('./Server').joinserver);
router.post("/joinserver/:server", require('./Server').joinserver);
router.get("/hasjoinserver", require("./Server").hasjoinserver);
router.get("/profiles/minecraft/:userName", require("./GameProfile").username2uuid);
router.get("/profiles/:uuid/names", require("./GameProfile").uuid2username);
router.post("/profiles/minecraft", require("./GameProfile").name2uuids);

module.exports = router;
