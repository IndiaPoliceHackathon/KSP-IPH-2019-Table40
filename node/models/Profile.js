const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    imgUrl: String,
    imgKey: String,
    status: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  {
    timestamps: true
  }
);

const Profile = mongoose.model("Profile", schema);

module.exports = Profile;
