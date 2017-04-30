/**
 * Created by Indexyz on 2017/4/30.
 */


const db = require('mongoose');
const oapp = require('../../Db/Schema/Application');

module.exports.get = (req, res, next) => {
    console.log(req.query.client_id);
    if (req.query.response_type !== "code"){
        return res.status(412).send({ error: "response_type need been code" })
    }
    let appModel = db.model("apps", oapp),
        authCode = db.model("codes", oapp.code),
        clientId = req.query.client_id,
        redirect_uri = req.query.redirect_uri;
    appModel.findOne({ client_id: clientId }, (err, doc) => {
        if (err || ! doc){
            return res.status(404).send({ error: "client_id error" })
        }
        let code = new authCode({
            app: clientId
        });
        redirect_uri = redirect_uri || doc.redirectUri || "/oauth/getCode";
        code.getCode();
        code.save(err => {
            if (err) { return res.status(500).send({ error: err.message }) }
            res.send();
            let returnType = {
                true: (func) => {
                    func(redirect_uri + "?code=" + code.code)
                },
                false: (func) => {
                    func(redirect_uri + "?code=" + code.code + req.query.state)
                }
            };
            returnType[req.query.state.toString() === ""]((retString) => { return res.redirect(retString) } )
        });
    })
};