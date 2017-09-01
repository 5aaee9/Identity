/**
 * Created by Indexyz on 2017/9/1.
 */

const Router = require('co-router');
let router = Router();

router.post("/session/minecraft/join", require("./Join").post);
router.post("/session/minecraft/join/:server", require("./Join").post);
router.get("/session/minecraft/hasJoined", require("./HasJoined").get);
router.get("/session/minecraft/profile/:uuid", require("./Profile").get);

module.exports = router;
