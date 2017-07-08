/**
 * Created by Indexyz on 2017/7/8.
 */
const i18n = require("i18n");

i18n.configure({
    locals: ['en_US', 'zh_CN'],
    directory: __dirname + "/Locales",
    cookie: 'i18n',
    objectNotation: true,
    defaultLocale: "zh_CN"
});

module.exports = i18n;