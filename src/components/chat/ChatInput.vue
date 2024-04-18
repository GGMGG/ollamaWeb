<template>
  <div class="chat-input">
    <div class="chat-stop-box-div" v-show="isAiResponding">
      <el-row class="chat-stop-btn-row">
        <el-col :span="4" :offset="10" class="chat-stop-btn-col" :class="{ 'chat-stop-btn-col-light': !isDarkMode }" @click="onStop">
          <el-icon size="28" class="btns-icon"><img :src="stop" /></el-icon>
          <el-text class="mx-1">{{ t("chatInput.stopChat") }}</el-text>
        </el-col>
      </el-row>
    </div>
    <div class="chat-input-box-div" :class="{ 'chat-input-box-div-light': !isDarkMode }">
      <el-row class="chat-input-box">
        <el-col :span="24">
          <el-input
            ref="textarea"
            v-model="userInput"
            :autosize="{ minRows: 2, maxRows: 5 }"
            type="textarea"
            resize="none"
            :placeholder="t('chatInput.warnText')"
            @keydown="onKeydown"
            class="chat-input-text-area"
          />
        </el-col>
      </el-row>
      <el-row class="chat-input-btns" :class="{ 'chat-input-btns-light': !isDarkMode }">
        <el-col :span="24">
          <el-icon size="28" class="btns-icon" v-show="!isAiResponding" @click="onPost"><Position /></el-icon>
          <el-icon size="28" class="btns-icon" :class="{ 'icon-rotate': isAiResponding }" v-show="isAiResponding"><Loading /></el-icon>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useTextareaAutosize } from "@vueuse/core";
import { Loading, Position } from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";

// 图标引入
import stop from "../../assets/svg/stop.svg";
// 脚本引入
import { useChats } from "../../utils/chatUtils.ts";
import { showMessage } from "../../utils/commonUtils.ts";
// 数据引入
import { isDarkMode } from "../../utils/database/localStorage.ts";

// 118n对象
const { t, locale } = useI18n();
// 文本域、数据库autosize
const { textarea, input: userInput } = useTextareaAutosize({ input: "" });
// 消息提示
const { warning } = showMessage();
// 当前激活的对话，添加用户对话信息，停止发送
const { activeChat, addUserMessage, abort } = useChats();

// 接收响应中
const isAiResponding = ref(false);
// 输入框是否有值
const isInputValid = computed<boolean>(() => !!userInput.value.trim());

/**
 * 发送请求
 */
const onPost = () => {
  if (!isInputValid.value) {
    warning(`${t("chatInput.warnText")}`);
    return;
  }

  isAiResponding.value = true;
  // 添加用户对话信息，并进行发送
  addUserMessage(userInput.value.trim()).then(() => {
    isAiResponding.value = false;
  });

  userInput.value = "";
};

/**
 * 停止发送
 */
const onStop = () => {
  if (!isAiResponding.value) {
    return;
  }

  abort();
  isAiResponding.value = false;
};

/**
 * 监听enter键敲下
 * @param event
 */
const onKeydown = (event: KeyboardEvent) => {
  if (!shouldSubmit(event)) {
    return;
  }

  if (isAiResponding.value) {
    return;
  }

  event.preventDefault();
  onPost();
};

/**
 * 监听enter键敲下
 * @param param0
 */
const shouldSubmit = ({ key, shiftKey }: KeyboardEvent): boolean => {
  return key === "Enter" && !shiftKey;
};
</script>

<style lang="less" scoped>
.chat-input {
  width: 80%;
  margin-left: 10%;

  .chat-stop-box-div {
    width: 100%;
    padding: 10px;

    .chat-stop-btn-row {
      .chat-stop-btn-col {
        display: inline-flex;
        justify-content: center;
        background-color: #212121;
        border: solid 1px #fff;
        border-radius: 5px;
        padding: 4px;
        cursor: pointer;
      }

      .chat-stop-btn-col-light {
        background-color: #fff;
        border: solid 1px #212121;
      }
    }
  }

  .chat-input-box-div {
    width: 100%;
    background-color: #212121;
    border: var(--el-border);
    border-radius: 8px;
    padding: 10px;

    .chat-input-box {
      .chat-input-text-area {
        font-size: 18px;

        :deep(.el-textarea__inner) {
          box-shadow: 0 0 0 0px;
        }
        :deep(.el-textarea__inner:hover) {
          box-shadow: 0 0 0 0px;
        }
        :deep(.el-textarea__inner:focus) {
          box-shadow: 0 0 0 0px;
        }
      }
    }

    .chat-input-btns {
      background-color: #212121;
      text-align: right;
      margin: 10px 3px -10px 0;

      .btns-icon {
        cursor: pointer;
      }
    }

    .chat-input-btns-light {
      background-color: #fff;
    }
  }

  .chat-input-box-div-light {
    background-color: #fff;
  }
}
</style>
