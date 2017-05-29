module.exports.replace = function(source, stringA, stringB) {
    while (source.indexOf(stringA) != -1){
        source = source.replace(stringA, stringB)
    }
    return source
};

module.exports.randomString = function randomString(len) {
    len = len || 32;
    let $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let maxPos = $chars.length;
    let pwd = '';
    while (pwd.length < len) {
        pwd += $chars.charAt(Math.floor(Math.random() * (maxPos+1)));
    }
    return pwd
};