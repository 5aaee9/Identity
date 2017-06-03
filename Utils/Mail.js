/**
 * Created by Indexyz on 2017/4/10.
 */
'use strict';
const config = require("../Config");


module.exports.send = function(to, title, date ,cb){
    mail(config, to, title, date, cb)
};

let mail = function(configDict, to, title, date, cb){
    if (configDict.mail_type === "mailgun"){
        var mailgun = require("mailgun").Mailgun;
        var sender = new mailgun(configDict.mail_key);
        sender.sendText(configDict.mail_sender, [to], title, date, configDict.mail_sender, {}, function () {
            cb()
        })
    } else {
        var helper = require('sendgrid').mail;
        var sendgrid = require("sendgrid")(configDict.sendgrid_key);

        var fromEmail = new helper.Email(configDict.mail_sender);
        var toEmail = new helper.Email(to);
        var content = new helper.Content('text/plain', date);
        var mail = new helper.Mail(fromEmail, title, toEmail, content);

        
        var request = sendgrid.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON()
        });
        sendgrid.API(request, function (error, response) {
            cb();
        })
    }
}

module.exports.mail = mail;