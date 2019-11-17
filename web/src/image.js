import axios from "./axios";
import FormData from "form-data";

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export default {
  async uploadImage(image) {
    var file = dataURLtoFile(
      image,
      "image.png"
    );
    let data = new FormData();
    data.append("image", file);

    const result = await axios.post("/profile/upload", data, {
      headers: {
        accept: "application/json",
        "Accept-Language": "en-US,en;q=0.8",
        "Content-Type": "multipart/form-data;"
      }
    });
    return result.data
  }
};
