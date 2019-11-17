const runner = require("./runner");
const userRepo = require("./repositories/userRepo");
const profileRepo = require("./repositories/userProfileRepo");

module.exports = async key => {
  const matchedImages = await runner.matchphotos(key);
  console.log("matchedImages: ", matchedImages);
  const user = await userRepo.findMatchedUserByProfileImage(matchedImages);
  if (!user) {
    await profileRepo.deleteProfile();
  } else {
    await profileRepo.updateProfile(user._id);
  }
};
