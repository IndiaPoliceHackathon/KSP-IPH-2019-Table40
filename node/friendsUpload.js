require("dotenv").config();
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const runner = require("./runner");

mongoose.connect("mongodb://localhost:27017/hackathon", {
  useNewUrlParser: true
});

(() => {
  runner.uploadFriendsPhotos();
})();
