<template>
  <div class="user-message">
    <div class="user-message-avatar">
      <el-avatar :src="avatar" fit="scale-down" />
    </div>
    <Markdown :source="message.content" class="user-message-markdown" />
  </div>
</template>

<script setup lang="ts">
// 图标引入
import avatar from "../../assets/avatar.png";

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
.user-message {
  display: inline-flex;
  justify-content: start;
  padding: 1%;
  width: 96%;

  .user-message-avatar {
    width: 32px;
    height: 32px;
    margin-top: 10px;
  }

  .user-message-markdown {
    margin-left: 20px;
  }
}

</style>
