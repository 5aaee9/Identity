/**
 * Created by Indexyz on 2017/8/4.
 */

const Router = require('co-router');
let router = Router();

router.get("/", require("./Index").get);
router.get("/users", require("./Users").get);
router.get("/users/:userId", require("./Users").edit);

module.exports = router;
