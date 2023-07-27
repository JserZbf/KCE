import axios from "axios";
// import { MessageBox, Message } from 'element-plus'
import cookie from "@/utils/cookie.js";
import { baseUrl } from "@/utils/baseUrl.js";
import { ElMessage } from "element-plus";

// const token = cookie.getCookie('token');
const token = localStorage.getItem("id");

axios.defaults.timeout = 10000; //设置超时时间，单位毫秒

const service = axios.create({
  // baseURL:   'http://47.102.42.124:8088/', // url = base url + request url
  // baseURL:'http://192.168.204.11:8088/', // 内网 摄像头抓拍 + vpn 才能访问
  // baseURL: "http://58.211.121.58:8088/", // 公网
  // baseURL:'http://192.168.204.175:8088/', // 内网 扶梯拍照 + vpn 才能访问
  // baseURL:'http://10.106.21.10:8088/', // 内网
  // baseURL:'https://www.kskone.cn:8088/', // 公网
  baseURL: baseUrl,
  // timeout: 15000, // request timeout
  headers: {
    "Content-Type": "application/json;",
  },
});
service.interceptors.request.use(
  (config) => {
    var user = localStorage.getItem("$user");
    user = JSON.parse(user);
    config.headers["Content-Type"] = "application/json;";
    if (user?.id) {
      config.headers["userID"] = user.id;
      if (config.method == "get") {
        config.params["userID"] = user.id;
      } else {
        config.data["userID"] = user.id;
      }
    }
    if (config.data && (config.method == "post" || config.method == "put")) {
      config.data = JSON.stringify(config.data);
    }
    return config;
  },
  (response) => {
    console.log("response", response);
    return Promise.resolve(response);
  },
  (error) => {
    console.log("error", error);
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    let code = response.data.code;
    let status = response.data.status;
    // console.log('response========》', response);

    console.log(code);
    if (code === 0) {
      return Promise.resolve(response.data);
    } else {
      ElMessage({
        showClose: true,
        message: response.data.message,
        type: "error",
      });
      return Promise.reject(response.data);
    }
  },
  (error) => {
    if (error.message.includes("timeout")) {
      ElMessage({
        showClose: true,
        message: "请求超时",
        type: "error",
      });
      return Promise.reject(response.data);
    } else {
      ElMessage({
        showClose: true,
        message: error,
        type: "error",
      });
      return Promise.reject(response.data);
    }
  }
);

export default service;
