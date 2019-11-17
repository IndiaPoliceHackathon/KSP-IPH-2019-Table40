/**
 * DB queries related to jobs
 */

const User = require("../models/fbUserModel");

module.exports.insertUser = async (
  profileUrl,
  fbId,
  postsList,
  friendsList,
  otherDetails,
  sentimentObject
) => {
  const job = new User({
    profileUrl,
    fbId,
    postsList,
    friendsList,
    otherDetails,
    sentimentObject
  });
  const res = await job.save();
  console.log("res: ", res);
};

module.exports.findInFriendList = async matchedImages => {
  const result = await User.aggregate([
    {
      $match: {
        friendsList: {
          $in: matchedImages
        }
      }
    }
  ]);
  return result[0];
};

module.exports.findMatchedUserByProfileImage = matchedImages => {
  return User.findOne({ profileUrl: { $in: matchedImages } });
};