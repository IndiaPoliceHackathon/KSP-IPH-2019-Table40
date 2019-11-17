const Profile = require("../models/Profile");

module.exports.createProfileAndGetId = imagePath => {
  const slashIndex = imagePath.lastIndexOf("/");
  const imageKey = imagePath.substr(slashIndex + 1);
  return Profile.findOneAndUpdate(
    {},
    {
      imgUrl: imagePath,
      imgKey: imageKey,
      status: "PROCESSING"
    },
    {
      upsert: true
    }
  );
};

module.exports.getProfileStatus = () => {
  return Profile.findOne({}).populate("user");
};

module.exports.updateProfile = async userId => {
  return Profile.findOneAndUpdate({}, { user: userId, status: "PROCCESSED" });
};

module.exports.deleteProfile = () => {
  return Profile.findOneAndDelete({});
};
