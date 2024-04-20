<template>
  <div class="user-message">
    <div class="user-message-avatar">
      <el-avatar :src="avatar" fit="scale-down" />
    </div>
    <Markdown :source="message.content" class="user-message-markdown" @click="copyMessage" :title="t('userMessage.markDownTitle')" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
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
// 定义emit
const emit = defineEmits<{}>();

// 118n对象
const { t, locale } = useI18n();

/**
 * 单击事件
 */
const copyMessage = () => {
  emit("clickUserMessageEvent", message.content);
};
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
    cursor: pointer;
  }
}
</style>
