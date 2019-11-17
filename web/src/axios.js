import Axios from "axios";
// import store from "./store/store";

const axios = Axios.create({
  baseURL: "http://172.16.8.180:3000/"
});


axios.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    if (error.response && error.response.status === 401) {
      // store.dispatch("logout");
      return Promise.reject({
        message: "Login Expired!"
      });
    }

    if (error.response && error.response.status === 500) {
      console.log(error.response);
      return Promise.reject({
        error: "Something went wrong!"
      });
    }

    return Promise.reject({
      error: error.response.data.error
    });
  }
);
export default axios;
