const S3 = require("aws-sdk/clients/s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const shortId = require("shortid");
const config = require('../config/config');

const BUCKET_NAME = "policehackathonsource";
const ACCESSKEYID =  ""// value
const SECRET_ACCESSKEY = ""// value

const s3 = new S3({
  accessKeyId: ACCESSKEYID,
  secretAccessKey: SECRET_ACCESSKEY
});

module.exports = mimetypes => {
  const multerInstance = multer({
    storage: multerS3({
      s3,
      acl: "public-read-write",
      bucket: BUCKET_NAME,
      metadata(req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      async key(req, file, cb) {
        const fileExtension = file.mimetype.split("/")[1];
        const uniqueId = shortId.generate();
        const filename = `${uniqueId}${Date.now().toString()}.jpeg`;
        cb(null, filename);
      }
    }),
    fileFilter(req, file, cb) {
      if (file.originalname.lastIndexOf(".") < 0) {
        cb(new Errors.BadRequest("Image file extension is not given."));
      } else if (!mimetypes.includes(file.mimetype)) {
        cb(
          new Errors.BadRequest(
            `This ${file.mimetype} mime type is not supported. only ${mimetypes} formats are allowed`
          )
        );
      } else {
        cb(null, true);
      }
    }
  });
  return multerInstance;
};
