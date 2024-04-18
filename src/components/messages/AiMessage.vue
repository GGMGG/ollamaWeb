<template>
  <div class="ai-message" :class="{ 'ai-message-light': !isDarkMode }">
    <div class="ai-message-avatar">
      <el-avatar :src="logo" fit="scale-down" />
    </div>
    <Markdown :source="message.content" class="ai-message-markdown" />
  </div>
</template>

<script setup lang="ts">
// 样式引入
import "highlight.js/styles/github-dark.css";
// 图标引入
import logo from "../../assets/logo.png";
// 数据引入
import { isDarkMode } from "../../utils/database/localStorage.ts";
// 对象类型引入
import { Message } from "../../utils/database/indexDB.ts";
// 组件引入
import Markdown from "./Markdown.ts";

// 定义消息对象
const { message } = defineProps<{
  message: Message;
}>();
</script>

<style lang="less" scoped>
.ai-message {
  display: inline-flex;
  justify-content: start;
  padding: 1%;
  width: 96%;

  .ai-message-avatar {
    width: 32px;
    height: 32px;
    margin-top: 10px;
  }

  .ai-message-markdown {
    margin-left: 20px;
  }
}

.ai-message-light {
  background-color: #fff;
}
</style>
