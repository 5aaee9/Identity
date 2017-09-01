/**
 * Created by Indexyz on 2017/9/1.
 */
const Router = require('co-router');
let router = Router();

const errors = require("../Errors");

// Application Request Method Check
router.get("*", (req, res, next) => {
    return errors.makeError(res, errors.MethodNotAllowed);
});

router.post("/authenticate", require("./Authenticate").post);
router.post("/refresh", require("./Refresh").post);
router.post("/validate", require("./Validate").post);
router.post("/invalidate", require("./Invalidate").post);
router.post("/signout", require("./Signout").post);

module.exports = router;
