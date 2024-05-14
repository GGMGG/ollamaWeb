<template>
  <div class="conversation-container" :class="{ 'conversation-container-light': !isDarkMode }">
    <div v-if="activeChat && available" class="conversation-container-active">
      <el-row class="conversation-container-active-header">
        <el-col :span="24" :offset="0" class="conversation-container-active-header-col">
          <div v-if="isEditingChatName" class="conversation-container-active-header-text-input">
            <TextInput autofocus v-model="editedChatName" @keyup.enter="confirmRename" @keyup.esc="cancelEditing" @blur="confirmRename" />
          </div>
          <div v-else @click.prevent="startEditing" class="conversation-container-active-header-span">
            {{ activeChat.name }}
            <el-icon size="30" class="conversation-container-active-header-span-icon"><Edit /></el-icon>
          </div>
          <ModelSelector class="conversation-container-active-header-model-select" />
          <PromptSelector class="conversation-container-active-header-prompt-select" />
        </el-col>
      </el-row>
      <el-row class="conversation-container-active-middle" :class="{ 'conversation-container-active-middle-light': !isDarkMode }">
        <el-col :span="24">
          <ChatMessages ref="chatMessages" @clickUserMessageBox="copyUserMesaage" />
        </el-col>
      </el-row>
      <el-row class="conversation-container-active-footer">
        <el-col :span="22">
          <ChatInput ref="userChatInput"/>
        </el-col>
      </el-row>
    </div>
    <div v-else-if="!available" class="conversation-container-empty">
      <el-empty :description="t('conversation.apiUnAvailable')" />
    </div>
    <div v-else class="conversation-container-empty">
      <el-empty :description="t('conversation.needCreateNewChat')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Edit } from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";
// 脚本引入
import { useAI } from "../../plugins/api/useAI.ts";
import { useApi } from "../../plugins/api/useApi.ts";
import { useChats } from "../../plugins/utils/chatUtils.ts";
import { usePrompt } from "../../plugins/utils/promptUtils.ts";
import { showMessage, isUrlValid } from "../../plugins/utils/commonUtils.ts";
// 数据引入
import { isDarkMode } from "../../plugins/database/localStorage.ts";
// 组件引入
import ChatInput from "../chat/ChatInput.vue";
import ChatMessages from "../chat/ChatMessages.vue";
import ModelSelector from "../form/ModelSelector.vue";
import PromptSelector from "../form/PromptSelector.vue";
import TextInput from "../form/TextInput.vue";

// 定义emit
const emit = defineEmits<{}>();

// 118n对象
const { t, locale } = useI18n();
// apiUrl对象
const { apiUrl } = useApi();
// 刷新模型，可用模型列表
const { refreshModels, availableModels } = useAI();
// 当前激活的对话，重命名对话，切换模型，切换提示词，初始化对话, 排序后的对话
const { activeChat, renameChat, switchModel, switchPrompt, initialize, sortedChats, setActiveChat } = useChats();
// 刷新提示词
const { refreshPrompts } = usePrompt();
const { warning } = showMessage();
// 程序是否可用
const available = ref(false);
// 是否在编辑对话名称
const isEditingChatName = ref(false);
// 编辑中的对话名称
const editedChatName = ref("");
// chatinput对象
const userChatInput = ref();
// chatMessages对象
const chatMessages = ref();

/**
 * 编辑
 */
const startEditing = () => {
  isEditingChatName.value = true;
  editedChatName.value = activeChat.value?.name || "";
};

/**
 * 取消编辑
 */
const cancelEditing = () => {
  isEditingChatName.value = false;
  editedChatName.value = "";
};

/**
 * 确认重命名
 */
const confirmRename = () => {
  if (!editedChatName.value) {
    warning(`${t("conversation.confirmReNameText")}`);
    return;
  }

  if (activeChat.value && editedChatName.value) {
    renameChat(editedChatName.value);
    isEditingChatName.value = false;
  }
};

/**
 * 用户消息单击事件
 * @param content
 */
const copyUserMesaage = (content: string) => {
  userChatInput.value.setInputValue(content);
};

/**
 * onMounted
 */
onMounted(() => {
  isUrlValid(apiUrl).then((result) => {
    if (result) {
      available.value = true;
      // 刷新模型
      refreshModels().then(async () => {
        if (!activeChat.value?.model) {
          await initialize();
          await switchModel(availableModels.value[0].name);
        }
      });

      // 刷新提示词
      refreshPrompts().then(async () => {});
    }
  });
});
</script>

<style lang="less" scoped>
.conversation-container {
  background-color: #212121;
  width: 100%;
  height: 100%;

  .conversation-container-active,
  .conversation-container-empty {
    width: 76%;
    height: 98%;
    margin-left: 12%;
    padding-top: 1%;
    padding-left: 1%;
    padding-right: 1%;
  }

  .conversation-container-active {
    position: relative;

    .conversation-container-active-header {
      .conversation-container-active-header-col {
        display: inline-flex;
        align-items: center;
        justify-content: center;

        .conversation-container-active-header-text-input {
          font-family: PingFang SC;
          font-style: normal;
          font-weight: 600;

          :deep .el-input__inner {
            font-family: PingFang SC;
            font-style: normal;
            font-weight: 600;
          }
        }

        .conversation-container-active-header-span {
          font-family: PingFang SC;
          font-style: normal;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;

          .conversation-container-active-header-span-icon {
            margin-left: 5px;
          }
        }

        .conversation-container-active-header-model-select {
          margin-left: 20px;
        }

        .conversation-container-active-header-prompt-select {
          margin-left: 20px;
        }
      }
    }

    .conversation-container-active-middle {
      border-radius: 10px;
      margin-top: 10px;
      max-height: 78%;
      overflow: auto;
    }

    .conversation-container-active-middle-light {
      background-color: #f6f7f9;
    }

    .conversation-container-active-footer {
      position: absolute;
      bottom: 10px;
      width: 98%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.conversation-container-light {
  background-color: #f6f7f9;
}
</style>
