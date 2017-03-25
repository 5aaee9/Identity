'use strict';
/**
 * Created by Indexyz on 2016/8/6.
 */


let _ = (env_name, default_value) => {
    return process.env[env_name] != undefined ? process.env[env_name] : default_value
};

module.exports = {
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