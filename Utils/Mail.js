/**
 * Created by Indexyz on 2017/4/10.
 */
'use strict';
const mailgun = require("mailgun").Mailgun;
const config = require("../Config");

const sender = new mailgun(config.mail_key);

module.exports.send = function(to, title, date ,cb){
    sender.sendText(config.mail_sender, [to], title, date, config.mail_sender, {}, cb)
};