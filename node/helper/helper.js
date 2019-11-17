const path = require("path");
const fileService = require("../services/fileService");

module.exports.findMatchingStringInBothArray = (arr1, arr2) => {
  let match = false;
  arr1.forEach(matchImage => {
    if (arr2.includes(matchImage)) {
      match = matchImage;
    }
  });
  return match;
};

module.exports.getUserDetails = folderPath => {
  //   const folderPath = path.join(__dirname, "..", "data", "rockey.rajput.585559");
  const userDetails = [];

  // Contact and Basic Info
  let contactnbasicInfo = fileService.readFileDataUTF8(
    path.join(folderPath, "Contact and Basic Info.txt")
  );
  contactnbasicInfo = contactnbasicInfo.toString().split("\r");
  contactnbasicInfo = contactnbasicInfo.map(key => {
    if (key.startsWith("\n")) {
      return key.substr(1);
    }
    return key;
  });
  for (let i = 0; i < contactnbasicInfo.length; i++) {
    if (contactnbasicInfo[i] == contactnbasicInfo[i].toUpperCase()) {
      userDetails.push({
        key: contactnbasicInfo[i],
        value: contactnbasicInfo[++i]
      });
    }
  }

  // About
  let detailAbout = fileService.readFileDataUTF8(
    path.join(folderPath, "Details About.txt")
  );
  detailAbout = detailAbout.toString().split("\r");
  detailAbout = detailAbout.map(key => {
    if (key.startsWith("\n")) {
      return key.substr(1);
    }
    return key;
  });
  for (let i = 0; i < detailAbout.length; i++) {
    if (detailAbout[i] == detailAbout[i].toUpperCase()) {
      userDetails.push({
        key: detailAbout[i],
        value: detailAbout[++i] ? detailAbout[i] : ""
      });
    }
  }

  // Family and relationship
  let familynRelation = fileService.readFileDataUTF8(
    path.join(folderPath, "Family and Relationships.txt")
  );
  familynRelation = familynRelation.toString().split("\r");
  familynRelation = familynRelation.map(key => {
    if (key.startsWith("\n")) {
      return key.substr(1);
    }
    return key;
  });
  for (let i = 0; i < familynRelation.length; i++) {
    if (familynRelation[i] == familynRelation[i].toUpperCase()) {
      userDetails.push({
        key: familynRelation[i],
        value: familynRelation[++i] ? familynRelation[i] : ""
      });
    }
  }

  // Places Lived
  let placesLived = fileService.readFileDataUTF8(
    path.join(folderPath, "Places Lived.txt")
  );
  placesLived = placesLived.toString().split("\r");
  placesLived = placesLived.map(key => {
    if (key.startsWith("\n")) {
      return key.substr(1);
    }
    return key;
  });
  for (let i = 0; i < placesLived.length; i++) {
    if (placesLived[i] == placesLived[i].toUpperCase()) {
      userDetails.push({
        key: placesLived[i],
        value: placesLived[++i] ? placesLived[i] : ""
      });
    }
  }
  console.log("userDetails: ", userDetails);
  return userDetails;
};
