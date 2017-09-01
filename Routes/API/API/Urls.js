/**
 * Created by Indexyz on 2017/9/1.
 */
const Router = require('co-router');
let router = Router();

router.post("/profiles/minecraft", require("./Profiles").post);

module.exports = router;
