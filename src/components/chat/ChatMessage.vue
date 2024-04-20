<template>
  <SystemMessage v-if="message.role == 'system'" :message="message" />
  <UserMessage v-if="message.role == 'user'" :message="message" @clickUserMessageEvent="clickUserMessage" />
  <AiMessage v-if="message.role == 'assistant'" :message="message" />
</template>

<script setup lang="ts">
// 类型对象引入
import { Message } from "../../utils/database/indexDB.ts";
// 组件引入
import SystemMessage from "../messages/SystemMessage.vue";
import UserMessage from "../messages/UserMessage.vue";
import AiMessage from "../messages/AiMessage.vue";

// props定义
type Props = {
  message: Message;
};

// 定义消息对象
const { message } = defineProps<Props>();
// 定义emit
const emit = defineEmits<{}>();

/**
 * 用户消息单击事件
 * @param content 
 */
const clickUserMessage = (content: string) => {
  emit("clickUserMessage", content);
};
</script>
