const User = require("../models/User");
const _ = require('lodash');

module.exports.getUserByImageURL = profileURL => {
  return User.findOne({ profileURL });
};

module.exports.searchUrlInFriendsList = friendProfileUrl => {
  return User.find({
    friendsList: friendProfileUrl
  });
};

module.exports.searchUrlInPostsList = postUrl => {
  return User.find({
    postsList: postUrl
  });
};

function generateSearchQuery(searchValue, fields) {
  const re = new RegExp(searchValue, "i");
  const queryArray = fields.reduce((obj, field) => {
    obj.push({
      [field]: { $regex: re }
    });
    return obj;
  }, []);
  return {
    $or: queryArray
  };
}

module.exports.searchUser = async searchText => {
  const searchFields = ["fullName"];
  const regexSearchQuery = searchText
    ? generateSearchQuery(searchText, searchFields)
    : {};
  const searchQuery = _.merge({}, regexSearchQuery);
  console.log('searchQuery: ', searchQuery);
  const list = await User.find(searchQuery);
  return list && list[0];
};
