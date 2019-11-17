const fs = require("fs");
const config = require("../config/config");

const AWS = require("../aws");

const s3 = new AWS.S3();

module.exports.uploadData = (key, message) => {
  const params = {
    Bucket: config.aws.inputBucketName,
    Key: key,
    Body: message.toString(),
    ACL: "public-read-write"
  };
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

module.exports.uploadFile = (path, key) => {
  const params = {
    Bucket: config.aws.inputBucketName,
    Key: key,
    Body: fs.createReadStream(path),
    ACL: "public-read-write"
  };
  return s3.upload(params).promise();
};

module.exports.listObjects = () => {
  return s3
    .listObjects({
      MaxKeys: 2000,
      Bucket: config.aws.inputBucketName
    })
    .promise();
};
