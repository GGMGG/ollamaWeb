import { createApp } from "vue";
import "./style.css";
import "element-plus/theme-chalk/src/index.scss";
import "element-plus/theme-chalk/dark/css-vars.css";
import i18n from "./plugins/locale/index.ts";
import App from "./App.vue";

createApp(App).use(i18n).mount("#app");
