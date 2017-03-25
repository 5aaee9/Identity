'use strict';
/**
 * Created by Indexyz on 2016/8/6.
 */


let _ = (env_name, default_value) => {
    return process.env[env_name] != undefined ? process.env[env_name] : default_value
};

let config = {
    db_host        : _('db_host', "localhost"),
    db_port        : Number(_('db_port', 27017)),
    db_name        : _('db_name', "veryauth"),
    db_auth        : Boolean(Number(_('db_auth', false))),
    db_username    : _('db_username', ""),
    db_password    : _('db_password', ""),
    salt           : _("salt", "ChangeMe"),
    mail_domain    : _("mail_domain", ""),
    mail_key       : _("mail_key", ""),
    mail_sender    : _("mail_sender", "")
};

module.exports = config

module.exports.getDbLink = function(){
    let mongodbUri = 'mongodb://';
    if (!process.env.MONGODB_PORT_27017_TCP_ADDR) {
        if (config.db_auth){
            mongodbUri += `${config.db_username}:${config.db_password}@${config.db_host}:${config.db_port}/${config.db_name}`
        } else {
            mongodbUri += `${config.db_host}:${config.db_port}/${config.db_name}`
        }
    } else {
        if (process.env.MONGODB_USERNAME) {
            mongodbUri += process.env.MONGODB_USERNAME;
            if (process.env.MONGODB_PASSWORD) {
                mongodbUri += ":" + process.env.MONGODB_PASSWORD
            }
            mongodbUri += "@";
        }
        mongodbUri += (process.env.MONGODB_PORT_27017_TCP_ADDR || '1.2.3.4')
            + ":" + (process.env.MONGODB_PORT_27017_TCP_PORT || 27017)
            + '/' + (process.env.MONGODB_INSTANCE_NAME || 'test');
    }
    return mongodbUri
}