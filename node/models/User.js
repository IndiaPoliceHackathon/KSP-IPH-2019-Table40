/**
 * email model file
 */

const mongoose = require("mongoose");

const object = new mongoose.Schema({
  key: { type: String },
  value: { type: String }
});

const schema = new mongoose.Schema({
  name: { type: String },
  fbId: { type: String },
  profileUrl: { type: String },
  postsList: { type: Array },
  friendsList: [String],
  otherDetails: [object],
  sentimentObject: { type: Object }
});

const User = mongoose.model("User", schema);

module.exports = User;
