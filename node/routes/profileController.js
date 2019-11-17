var express = require("express");
var router = express.Router();

const awsImgUploadService = require("../services/imgUploadService");

const profileRepo = require("../repositories/userProfileRepo");
const userRepo = require("../repositories/userRepository");
const runInBack = require("../runInBack");

router.post(
  "/upload",
  awsImgUploadService(["image/png", "image/jpg", "image/jpeg"]).single("image"),
  async (req, res, next) => {
    const filePath = req.file && req.file.location;
    if (!filePath) {
      throw new Error("file not uploaded to aws");
    }
    try {
      await profileRepo.createProfileAndGetId(filePath);
      const slashIndex = filePath.lastIndexOf("/");
      runInBack(filePath.substr(slashIndex + 1));
    } catch (error) {
      return next(error);
    }
    return res.send({});
  }
);

router.get("/status", async (req, res, next) => {
  let result;
  try {
    result = await profileRepo.getProfileStatus();
    console.log("result: ", result);
  } catch (error) {
    return next(error);
  }
  return res.send(result);
});

router.delete("/", async (req, res, next) => {
  try {
    await profileRepo.deleteProfile();
  } catch (error) {
    return next(error);
  }
  res.send({});
});

router.get("/search", async (req, res, next) => {
  const { name } = req.query;
  let result;
  try {
    result = await userRepo.searchUser(name);
  } catch (error) {
    return next(error);
  }
  return res.send(result);
});

module.exports = router;
