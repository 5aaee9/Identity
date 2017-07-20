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
    mail_type      : _("MAIL_TYPE", "mailgun"),
    mail_sender    : _("MAIL_SENDER", ""),
    mailgun_key    : _("MAILGUN_KEY", ""),
    sendgrid_key   : _("SENDGRID_KEY", ""),
    smtp_user      : _("SMTP_USER", ""),
    smtp_password  : _("SMTP_PASSWORD", ""),
    smtp_host      : _("SMTP_HOST", ""),
    smtp_secure    : Boolean(Number(_("SMTP_SECURE", false))),
    smtp_port      : Number(_("SMTP_PORT", "")),
    redis_host     : _("REDIS_HOST", "127.0.0.1"),
    redis_port     : Number(_("REDIS_PORT", "6379")),
    redis_auth     : _("REDIS_AUTH", "")
};