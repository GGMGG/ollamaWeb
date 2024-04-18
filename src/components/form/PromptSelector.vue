<template>
  <div class="prompt-selector">
    <el-select
      v-model="choosePrompt"
      :disabled="hasMessages"
      size="large"
      filterable="true"
      class="prompt-select"
      @change="handlePromptChange"
      :placeholder="t('promptSelector.selectPlaceholder')"
      :no-match-text="t('promptSelector.noMatchText')"
      :no-data-text="t('promptSelector.noDataText')"
    >
      <el-option v-for="prompt in prompts" :key="prompt.id" :label="prompt.name" :value="prompt.id" />
    </el-select>
    <el-icon :disabled="hasMessages" :title="t('promptSelector.iconText')" size="30" class="refresh-icon" :class="{ 'icon-rotate': refreshingPrompt }" @click="performRefreshPrompt"
      ><Refresh
    /></el-icon>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Refresh } from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";

// 脚本引入
import { useChats } from "../../utils/chatUtils.ts";
import { usePrompt } from "../../utils/promptUtils.ts";

// 118n对象
const { t, locale } = useI18n();
// 当前激活的对象，是否有消息，切换提示词
const { activeChat, hasMessages, switchPrompt } = useChats();
// 可用的提示词列表，刷新提示词
const { prompts, refreshPrompts } = usePrompt();
// 延时函数
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
// 是否刷新提示词中
const refreshingPrompt = ref(false);
// 选择的提示词
const choosePrompt = ref(activeChat.value?.prompt);

/**
 * 刷新提示词
 */
const performRefreshPrompt = async () => {
  refreshingPrompt.value = true;
  await Promise.all([refreshPrompts(), sleep(1000)]);
  refreshPrompts().then(() => {
    refreshingPrompt.value = false;
  });
};

/**
 * 切换提示词
 */
const handlePromptChange = () => {
  switchPrompt(choosePrompt.value);
};

/**
 * onMounted
 */
onMounted(() => {
  const choosedPromptObj = prompts.value.filter((prompt) => prompt.id === choosePrompt.value);
  if (!choosedPromptObj || choosedPromptObj.length <= 0) {
    choosePrompt.value = "";
    switchPrompt("");
  }
});

/**
 * watch
 */
watch(activeChat, () => {
  choosePrompt.value = activeChat.value?.prompt;
});
</script>

<style lang="less" scoped>
.prompt-selector {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  .prompt-select {
    min-width: 250px;
    width: auto;
    font-family: PingFang SC;
    font-style: normal;
    font-weight: 600;
  }

  .refresh-icon {
    cursor: pointer;
    margin-left: 5px;
  }
}
</style>
