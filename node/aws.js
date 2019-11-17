/**
 * Aws config file
 */

const AWS = require("aws-sdk");
const config = require("./config/config");

AWS.config = new AWS.Config();
AWS.config.setPromisesDependency(require("bluebird"));
AWS.config.accessKeyId = config.aws.accessKey;
AWS.config.secretAccessKey = config.aws.secretKey;
AWS.config.region = config.aws.region;

module.exports = AWS;
