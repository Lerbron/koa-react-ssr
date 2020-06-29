import axios from "axios";
import Cookies from "js-cookie";
// import { message } from "antd";
import Qs from "qs";
// import intl from "react-intl-universal";
// import { language } from "./getLanguage";

// https://cnodejs.org/api/v1/topics?page=1&limit=8
const http = axios.create({
  // paramsSerializer: function(params) {
  //   return Qs.stringify(params, { arrayFormat: "repeat" });
  // }
});

http.interceptors.request.use(
  config => {
    if (__SERVER__) {
      config.url = `https://cnodejs.org${config.url}`;
    }
    return config;
  },
  error => {
    // 对请求错误做些什么
    console.log("err:", error);
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  response => {
    return response.data;
  },
  err => {
    console.log("interceptors err--->", err);
    return Promise.reject(err);
  }
);
export default http;