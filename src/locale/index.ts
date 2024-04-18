import { createI18n } from "vue-i18n";
// 数据引入
import { language as localeLanguage } from "../utils/database/localStorage.ts";
// 配置好的语言文件
import messages from "./language/index.ts";

// 从获取浏览器的语言
const browserLanguage = (navigator.language || "zh").toLocaleLowerCase();
// i18n对象
const i18n = createI18n({
  legacy: false,
  locale: localeLanguage.value || browserLanguage.split("-")[0] || "zh",
  globalInjection: true,
  messages,
});

export default i18n;
