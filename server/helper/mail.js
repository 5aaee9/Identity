var mailgun = require("mailgun").Mailgun
var config = require("../config")

var sender = new mailgun(config.mail_key)

module.exports.send = function(to, title, date ,cb){
    sender.sendText(config.mail_sender, [to], title, date, config.mail_sender, {}, cb)
}

