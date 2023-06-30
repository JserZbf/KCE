/**
 * i18配置
 *  */
import { createApp } from "vue";
import App from "../App.vue";
import { createI18n } from "vue-i18n";
import en from "./en.js";
import zhCN from "./zh.js";
const app = createApp(App);

if(!localStorage.getItem("lang")){
    localStorage.setItem("lang","zhCN");
}
const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("lang") || "zhCN", // 初始化显示中文
  messages: { en, zhCN }, // 这里就是你有几种语言，对象里面就有几个
});

export default function (app) {
  app.use(i18n);
}   
