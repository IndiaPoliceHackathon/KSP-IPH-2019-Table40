const config = require("../config/config");

const AWS = require("../aws");

const rekognition = new AWS.Rekognition();

module.exports.compareFaces = (baseKey, compareKey) => {
  return rekognition
    .compareFaces({
      SimilarityThreshold: 70,
      SourceImage: {
        S3Object: { Bucket: "policehackathonsource", Name: baseKey }
      },
      TargetImage: {
        S3Object: { Bucket: config.aws.inputBucketName, Name: compareKey }
      }
    })
    .promise();
};

// module.exports.detectObject = key => {
//   return rekognition
//     .detectLabels({
//       Image: {
//         S3Object: {
//           Bucket: config.aws.inputBucketName,
//           Name: key
//         }
//       },
//       MaxLabels: 100,
//       MinConfidence: 80
//     })
//     .promise();
// };
