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
        const mailgun = require("mailgun").Mailgun;
        const sender = new mailgun(configDict.mail_key);
        sender.sendText(configDict.mail_sender, [to], title, date, configDict.mail_sender, {}, function () {
            cb()
        })
    } else if(configDict.mail_type === "sendgrid") {
        const helper = require('sendgrid').mail;
        const sendgrid = require("sendgrid")(configDict.sendgrid_key);

        const fromEmail = new helper.Email(configDict.mail_sender);
        const toEmail = new helper.Email(to);
        const content = new helper.Content('text/plain', date);
        const mail = new helper.Mail(fromEmail, title, toEmail, content);

        
        const request = sendgrid.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON()
        });
        sendgrid.API(request, function (error, response) {
            if (error) {
                console.log(error)
            }
            cb();
        })
    } else {
        // SMTP
        const message = {
            from: configDict.smtp_user,
            to: to,
            subject: title,
            text: date
        };
        const mailServer = {
            host: configDict.smtp_host,
            port: configDict.smtp_port,
            secure: configDict.smtp_secure,
            auth: {
                user: configDict.smtp_user,
                pass: configDict.smtp_password
            },
            tls: {
                rejectUnauthorized: false
            }
        };
        const nodeMailer = require("nodemailer");
        const smtpTransport = require("nodemailer-smtp-transport");
        const transport = nodeMailer.createTransport(smtpTransport(mailServer));
        transport.verify(function (error, success) {
            if (error) {
                console.log(error);
                return cb()
            }
            transport.sendMail(message, (error, _) => {
                if (error) {
                    console.log(error);
                }
                cb();
                transport.close();
            })
        })
    }
};

module.exports.mail = mail;