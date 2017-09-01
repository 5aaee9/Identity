const gulp = require("gulp");
const usage = require('gulp-help-doc');

gulp.task("help", () => usage(gulp))

gulp.task("default", ['help'])

/**
 * This will generate the cert for signature verify.
 * if you not generate the cert, the signature will be ignore, 
 * even if unsigned=false
 * 
 * @task {generateCert}
 * @order {1}
 */
gulp.task("generateCert", function() {
    
})