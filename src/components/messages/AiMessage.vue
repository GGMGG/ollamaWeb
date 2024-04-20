<template>
  <div class="ai-message" :class="{ 'ai-message-light': !isDarkMode }">
    <div class="ai-message-avatar">
      <el-avatar :src="logo" fit="scale-down" />
    </div>
    <Markdown :source="message.content" class="ai-message-markdown" @click="copyMessage" :title="t('aiMessage.markDownTitle')" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
// 引入剪切板插件
import clipboard3 from "vue-clipboard3";
// 样式引入
import "highlight.js/styles/github-dark.css";
// 图标引入
import logo from "../../assets/logo.png";
// 数据引入
import { isDarkMode } from "../../utils/database/localStorage.ts";
// 对象类型引入
import { Message } from "../../utils/database/indexDB.ts";
// 脚本引入
import { showMessage } from "../../utils/commonUtils.ts";
// 组件引入
import Markdown from "./Markdown.ts";

// 定义消息对象
const { message } = defineProps<{
  message: Message;
}>();

// 118n对象
const { t, locale } = useI18n();
// 复制方法
const { toClipboard } = clipboard3();
// 提示信息
const { success, warning } = showMessage();

/**
 * 复制内容到剪切板
 */
const copyMessage = async () => {
  if (!message.content) {
    return;
  }

  try {
    await toClipboard(message.content);
    success(`${t("aiMessage.copySucccess")}`);
  } catch (error) {
    warning(`${t("aiMessage.copyFailed")}`);
  }
};
</script>

<style lang="less" scoped>
.ai-message {
  display: inline-flex;
  justify-content: start;
  padding: 1%;
  width: 96%;
  border-radius: 10px;
  background-color: #1d1d1d;

  .ai-message-avatar {
    width: 32px;
    height: 32px;
    margin-top: 10px;
  }

  .ai-message-markdown {
    margin-left: 20px;
    cursor: pointer;
  }
}

.ai-message-light {
  background-color: #fff;
}
</style>
