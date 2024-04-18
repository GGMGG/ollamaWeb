<template>
  <div class="system-message" :class="{ 'system-message-light': !isDarkMode }">
    <pre class="system-message-pre">{{ message.content }}</pre>
  </div>
</template>

<script setup lang="ts">
// 数据引入
import { isDarkMode } from "../../utils/database/localStorage.ts";
// 对象类型引入
import { Message } from "../../utils/database/indexDB.ts";

// 定义消息对象
const { message } = defineProps<{
  message: Message;
}>();
</script>

<style lang="less" scoped>
.system-message {
  display: inline-flex;
  justify-content: start;
  padding: 1%;
  width: 96%;

  .system-message-pre {
    color: rgb(183, 156, 106);
  }
}

.system-message-light {
  background-color: #fff;
}
</style>
