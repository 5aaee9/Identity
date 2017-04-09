'use strict';
/**
 * Created by Indexyz on 2016/8/6.
 */


let _ = (env_name, default_value) => {
    return process.env[env_name] !== undefined ? process.env[env_name] : default_value
};

module.exports = {
    db_host        : _('DB_HOST', "localhost"),
    db_port        : Number(_('DB_PORT', 27017)),
    db_name        : _('DB_NAME', "identity"),
    db_auth        : Boolean(Number(_('DB_AUTH', false))),
    db_username    : _('DB_USER', ""),
    db_password    : _('DB_PASS', ""),
    salt           : _("SALT", "ChangeMe"),
    mail_domain    : _("MAIL_DOMAIN", ""),
    mail_key       : _("MAIL_KEY", ""),
    mail_sender    : _("MAIL_SENDER", "")
};