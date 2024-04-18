<template>
  <SystemMessage v-if="message.role == 'system'" :message="message" />
  <UserMessage v-if="message.role == 'user'" :message="message" />
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

const { message } = defineProps<Props>();
</script>
