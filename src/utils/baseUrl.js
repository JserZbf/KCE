// var url = window.location.host;
var url = window.location.origin;

// var baseUrl = "";
// if (url.indexOf("58.211.121.58") != -1) {
//   baseUrl = "http://58.211.121.58:8088/";
// } else if (url.indexOf("47.102.42.124") != -1) {
//   baseUrl = "http://47.102.42.124:8088/";
// } else if (url.indexOf("192.168.204.11") != -1) {
//   baseUrl = "http://192.168.204.11:8088/";
// } else if (url.indexOf("192.168.204.11") != -1) {
//   baseUrl = "http://192.168.204.11:8088/";
// } else if (url.indexOf("192.168.204.175") != -1) {
//   baseUrl = "http://192.168.204.175:8088/";
// } else if (url.indexOf("10.106.21.10") != -1) {
//   baseUrl = "http://10.106.21.10:8090/";
// } else if (url.indexOf("https://www.kskone.cn") != -1) {
//   if (url.indexOf(":8088") != -1) {
//     baseUrl = "https://www.kskone.cn:8088/";
//   } else if (url.indexOf(":82") != -1) {
//     baseUrl = "https://www.kskone.cn:82/";
//   }
// } else if (url.indexOf("http://www.kskone.cn") != -1) {
//   if (url.indexOf(":8088") != -1) {
//     baseUrl = "http://www.kskone.cn:8088/";
//   } else if (url.indexOf(":82") != -1) {
//     baseUrl = "http://www.kskone.cn:82/";
//   }
// }
// if(url.indexOf("localhost") != -1){
//     baseUrl = "http://192.168.204.11:8088/";
// }
// console.log('当前url：',url);
// console.log('请求url：',baseUrl);
// export { baseUrl };

// export const baseUrl = "http://58.211.121.58:8088/";
// export const baseUrl = "http://47.102.42.124:8088/"; // url = base url + request url
// export const baseUrl = "http://58.211.121.58:8088/"; // 办公网
// export const baseUrl = "http://58.211.121.58:82/"; // 办公网
// export const baseUrl = "http://10.106.21.10:8090/"; // 生产网(转发到192.168.204.54:8088)
// export const baseUrl = "http://10.106.21.10:8092/"; // 扶梯-生产网(转发到192.168.204.54:8088)
// export const baseUrl = "http://10.106.21.10:8088/"; // 内网
// export const baseUrl = "https://www.kskone.cn:8088/"; // 公网
// export const baseUrl = "http://192.168.204.175:8088"; // 内网 扶梯拍照 + vpn 才能访问
// export const baseUrl = "http://10.106.21.10:8092"; // 扶梯-生产网(转发到192.168.204.54:8088)
// export const baseUrl = "https://www.kskone.cn:82"; //  生产网-204.11

// export const baseUrl = "http://10.106.21.10:83/"; // 内网
export const baseUrl = "http://192.168.204.11"; // 内网 摄像头抓拍 + vpn 才能访问
// export const baseUrl = url; 