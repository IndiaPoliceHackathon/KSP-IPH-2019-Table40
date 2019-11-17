require("dotenv").config();

const path = require("path");
const fileService = require("./services/fileService");
const s3Service = require("./services/s3Service");
const userRepo = require("./repositories/userRepo");
const rekognitionService = require("./services/rekognitionService");
const comprehendService = require("./services/comprhendService");

const helper = require("./helper/helper");

module.exports.uploadFriendsPhotos = async () => {
  try {
    const dirPath = path.join("data");
    const facebookUserIds = fileService.getDirectories(dirPath);
    for (const userId of facebookUserIds) {
      console.log("userId: ", userId);
      const folderPath = path.join(__dirname, "data", userId);
      const sentimentObject = await runSentimentAnalysis(folderPath);
      const friendsFilData = fileService.readFileData(
        path.join(folderPath, "All Friends.txt")
      );
      let friendsList = friendsFilData.toString().split("\n");
      friendsList = friendsList.filter(friend => friend != "");
      friendsList = friendsList.map(friend =>
        friend.substring(22, friend.indexOf(","))
      );
      posts = fileService.getFiles(path.join(folderPath, "PostPhotos"));
      for (const post of posts) {
        const postData = fileService.readFileData(
          path.join(folderPath, "PostPhotos", post)
        );
        postPath = path.join(folderPath, "PostPhotos", post);
        await s3Service.uploadFile(postPath, post);
      }
      await s3Service.uploadFile(
        path.join(folderPath, userId + ".jpg"),
        userId + ".jpg"
      );
      otherDetails = helper.getUserDetails(folderPath);
      console.log("posts: ", posts);
      console.log("friendsList: ", friendsList);
      await userRepo.insertUser(
        userId + ".jpg",
        userId,
        posts,
        friendsList,
        otherDetails,
        sentimentObject
      );
    }
  } catch (error) {
    console.log("error: ", error);
  }
};

module.exports.matchphotos = async key => {
  try {
    const photoObjectList = await s3Service.listObjects();
    const photoList = photoObjectList.Contents.map(
      photoObject => photoObject.Key
    );
    let matchedImages = [];
    for (const photo of photoList) {
      console.log("key: ", key);
      console.log("photo: ", photo);
      let res;
      try {
        res = await rekognitionService.compareFaces(key, photo);
      } catch (error) {
        console.log(photo, "skipped");
        continue;
      }
      if (res.FaceMatches.length) {
        const score = res.FaceMatches[0].Similarity;
        if (score > 95) {
          matchedImages.push(photo);
        }
      }
    }
    console.log("matchedImages: ", matchedImages);
    return matchedImages;
  } catch (error) {
    console.log("error: ", error);
  }
};

module.exports.findMatchFriend = matchedImages => {
  return userRepo.findInFriendList(matchedImages);
};

const runSentimentAnalysis = async folderPath => {
  let commentsFileData = fileService.readFileData(
    path.join(folderPath, "Comments.txt")
  );
  let commentsWithName = commentsFileData.toString().split("\n");
  console.log("commentsWithName: ", commentsWithName);
  commentsWithName = commentsWithName.filter(c => c != "");
  let commentOwnerList = [];
  let commentsList = [];
  for (let index = 1; index < commentsWithName.length; index++) {
    const commentWithName = commentsWithName[index];
    const comment = commentWithName.split(",");
    commentsList.push(comment[2]);
    commentOwnerList.push(comment[1]);
  }
  if (!commentsList.length) {
    return {};
  }
  const res = await comprehendService.getSentimentAnalysis(commentsList);
  const sentimentList = {};
  for (const name of commentOwnerList) {
    sentimentList[name] = 0;
  }
  for (const result of res.ResultList) {
    console.log("result: ", result.Sentiment);
    if (result.Sentiment == "NEGATIVE") {
      sentimentList[commentOwnerList[result.Index]] -= 1;
    } else if (result.Sentiment == "MIXED") {
      sentimentList[commentOwnerList[result.Index]] += 0;
    } else {
      sentimentList[commentOwnerList[result.Index]] += 1;
    }
  }
  console.log("sentimentList: ", sentimentList);
  return sentimentList;
};





// module.exports.detectObjects = async () => {
//   try {
//     const photoObjectList = await s3Service.listObjects();
//     const photoList = photoObjectList.Contents.map(
//       photoObject => photoObject.Key
//     );
//     let matchedImages = [];
//     for (const photo of photoList) {
//       let res;
//       try {
//         res = await rekognitionService.detectObject(photo);
//       } catch (error) {
//         console.log(photo, "skipped");
//         continue;
//       }
//       console.log('res: ', res);
//       // if (res.FaceMatches.length) {
//       //   const score = res.FaceMatches[0].Similarity;
//       //   if (score > 95) {
//       //     matchedImages.push(photo);
//       //   }
//       // }
//     }
//     return matchedImages;
//   } catch (error) {
//     console.log("error: ", error);
//   }
// }