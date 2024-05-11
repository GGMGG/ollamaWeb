<template>
  <div class="user-message">
    <div class="user-message-avatar">
      <el-avatar :src="avatar" fit="scale-down" />
    </div>
    <Markdown :source="message.content" class="user-message-markdown" @click="copyMessage" :title="t('userMessage.markDownTitle')" />
  </div>
  <div v-if="hasImage" class="user-message-images-div">
    <div v-for="(image, index) in imagesList" :key="index">
      <el-image :src="image" :zoom-rate="1.2" :max-scale="10" :min-scale="1" :preview-src-list="imagesList" :initial-index="index" fit="contain" class="user-message-image" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
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

// 是否有图片
const hasImage = ref(false);
// 对话图片列表
const imagesList = computed(() => {
  let messageImages = [];
  if (message.images && message.images.length > 0) {
    message.images.forEach((image, index) => {
      if (message.desc[index]) {
        messageImages.push(`${message.desc[index]}${image}`);
      }
    });
  }

  return messageImages;
});

/**
 * 单击事件
 */
const copyMessage = () => {
  emit("clickUserMessageEvent", message.content);
};

/**
 * onMounted
 */
onMounted(() => {
  if (message.images && message.images.length > 0) {
    hasImage.value = true;
  } else {
    hasImage.value = false;
  }
});
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

.user-message-images-div {
  width: 96%;
  padding: 0 1% 1% 1%;
  display: flex;

  .user-message-image {
    width: 60px;
    height: 60px;
    margin-right: 10px;
    cursor: pointer;
  }
}
</style>
