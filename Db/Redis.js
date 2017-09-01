const redis = require("redis");
const userConfig = require("../Config");
const bluebird = require("bluebird");


bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

let create = (config, cb) => {
    let client = redis.createClient(config.redis_port, config.redis_host);
    if (config.redis_auth !== ""){
        client.auth(config.redis_auth)
    }
    cb(client)
};


let link = callback => {
    create(userConfig, callback)
};

module.exports.create = create;
module.exports.link = link;