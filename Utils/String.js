module.exports.replace = function(source, stringA, stringB) {
    while (source.indexOf(stringA) != -1){
        source = source.replace(stringA, stringB)
    }
    return source
}

module.exports.randomString = function randomString(len) {  
　　len = len || 32;  
　　var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';  
　　var maxPos = $chars.length;  
　　var pwd = '';  
　　for (i = 0; i < len; i++) {  
        //0~32的整数  
　　　　pwd += $chars.charAt(Math.floor(Math.random() * (maxPos+1)));  
　　}  
　　return pwd;  
}  