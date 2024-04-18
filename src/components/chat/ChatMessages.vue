<template>
  <div ref="chatElement" class="chat-messages">
    <ChatMessage v-for="message in visibleMessages" :message="message" />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, onUpdated, ref, watch } from "vue";
// 脚本引入
import { useChats } from "../../utils/chatUtils.ts";
// 组件引入
import ChatMessage from "./ChatMessage.vue";

// message type
const { messages } = useChats();
// chat-messages对象
const chatElement = ref<HTMLElement>();
// 滚动相关
const userInterferedWithScroll = ref(false);

/**
 * 是否到底部了
 */
const isAtBottom = () => {
  if (!chatElement.value) {
    return false;
  }

  const { scrollTop, scrollHeight, clientHeight } = chatElement.value;
  return scrollHeight - scrollTop <= clientHeight + 10;
};

/**
 * 滚动
 */
const handleUserScroll = () => {
  userInterferedWithScroll.value = !isAtBottom();
};

/**
 * 滚动到最底部
 */
const scrollToBottom = () => {
  if (userInterferedWithScroll.value) {
    return;
  }

  nextTick(() => {
    chatElement.value && (chatElement.value.scrollTop = chatElement.value.scrollHeight - chatElement.value.clientHeight);
  });
};

/**
 * onMounted
 */
onMounted(() => {
  scrollToBottom();
  chatElement.value?.addEventListener("scroll", handleUserScroll);
});

/**
 * onUpdated
 */
onUpdated(() => scrollToBottom());

/**
 * watch
 */
watch(messages, () => {
  if (!isAtBottom()) {
    return;
  }

  userInterferedWithScroll.value = false;
});

/**
 * onUnmounted
 */
onUnmounted(() => chatElement.value?.removeEventListener("scroll", handleUserScroll));

/**
 * 可见信息
 */
const visibleMessages = computed(() => messages?.value.filter((message) => message.role != "system"));
</script>

<style lang="less" scoped>
.chat-messages {
  display: inline-block;
  padding: 1%;
  width: 100%;
  height: 620px;
  border-radius: 10px;
  overflow: auto;
}
</style>
