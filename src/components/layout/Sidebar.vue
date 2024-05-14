<template>
  <div class="left-sidebar">
    <div class="left-sidebar-new-btn-div">
      <el-button @click="onNewChat" class="left-sidebar-new-btn" type="primary" size="large" :disabled="!available">
        <el-text class="mx-1" size="large">{{ t("sidebar.newChatBtnText") }}</el-text>
      </el-button>
    </div>
    <div class="left-sidebar-list">
      <el-card
        v-for="chat in sortedChats"
        @click="switchChat(chat.id!)"
        class="left-sidebar-list-card"
        :class="{ 'left-sidebar-list-card-choose': activeChat?.id == chat.id && !isDarkMode, 'left-sidebar-list-card-choose-dark': activeChat?.id == chat.id && isDarkMode }"
      >
        <div class="left-sidebar-list-card-left">
          <el-popconfirm
            width="250"
            :title="t('sidebar.confirmDelete.title')"
            :confirm-button-text="t('sidebar.confirmDelete.confirmBtnText')"
            :cancel-button-text="t('sidebar.confirmDelete.cancelBtnText')"
            @confirm="deleteChat(chat.id!)"
          >
            <template #reference>
              <el-icon size="32"><Delete /></el-icon>
            </template>
          </el-popconfirm>
        </div>
        <div class="left-sidebar-list-card-right">
          <div class="left-sidebar-list-card-right-container">
            <span class="left-sidebar-text">
              {{ chat.name }}
            </span>
            <span class="left-sidebar-text">
              {{ chat.model }}
            </span>
            <span class="left-sidebar-text">
              {{ formatDate(chat.createdAt) }}
            </span>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Delete } from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";
// 脚本引入
import { useChats } from "../../plugins/utils/chatUtils.ts";
import { useAI } from "../../plugins/api/useAI.ts";
import { formatDate } from "../../plugins/utils/commonUtils.ts";
// 数据引入
import { isDarkMode } from "../../plugins//database/localStorage.ts";

// 定义props
const props = defineProps({
  available: {
    type: Boolean,
    default: false,
  },
});

// 118n对象
const { t, locale } = useI18n();
// 可用的模型列表
const { availableModels } = useAI();
// 对话排序，当前激活的对话，切换对话，删除对话，开始新的对话
const { sortedChats, activeChat, switchChat, deleteChat, startNewChat } = useChats();

/**
 * 新建新的对话
 */
const onNewChat = () => {
  return startNewChat(`${t("sidebar.newChatText")}`, activeChat.value?.model ?? availableModels.value[0].name);
};
</script>

<style lang="less" scoped>
.left-sidebar {
  .left-sidebar-new-btn-div {
    width: 90%;
    padding: 5%;

    .left-sidebar-new-btn {
      width: 100%;
      padding: 1%;
      border-radius: 8px;
      background: #2454ff;
      cursor: pointer;
      transition: background 0.25s;
    }

    .left-sidebar-new-btn:hover {
      background: #163ecd;
    }

    .is-disabled {
      background-color: var(--el-button-disabled-bg-color);
    }

    .mx-1 {
      font-family: PingFang SC;
      font-style: normal;
      font-weight: 600;
      color: #fff;
    }
  }

  .left-sidebar-list {
    max-height: 92vh;
    overflow: auto;
    width: 90%;
    padding: 0 5% 5% 5%;

    .left-sidebar-list-card {
      margin-bottom: 8px;
      padding: 5px;
      border-top: solid 0px;

      :deep .el-card__body {
        padding: 0px;
        align-items: center;
        display: flex;

        .left-sidebar-list-card-left {
          display: inline-flex;
          align-items: center;
          width: 10%;
          cursor: pointer;
        }

        .left-sidebar-list-card-right {
          display: inline-flex;
          width: 80%;
          margin-left: 10%;

          .left-sidebar-list-card-right-container {
            display: grid;
          }
        }
      }
    }

    .left-sidebar-list-card-choose {
      border: solid #163ecd 1px;
      background-color: #f8f8f8;
    }

    .left-sidebar-list-card-choose-dark {
      border: solid #163ecd 1px;
    }
  }

  .left-sidebar-text {
    word-break: break-all;
  }
}
</style>
