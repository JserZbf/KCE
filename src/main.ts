import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import "~/styles/index.scss";
import "uno.css";
import "element-plus/theme-chalk/src/message.scss";
import "element-plus/theme-chalk/index.css";
import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
// import {has} from '@/utils/permissin.js'
import { hasRole } from "@/utils/permissin.js";
import i18n from './lang/index.js'
console.log('Main:1.0.2')

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(ElementPlus, {
    locale: zhCn,
});
app.use(router);
app.use(i18n);
app.use(hasRole);
app.mount("#app");
