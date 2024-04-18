<template>
  <div class="model-selector">
    <el-select
      v-model="chooseModel"
      :disabled="hasMessages"
      size="large"
      filterable="true"
      class="model-select"
      @change="handleModelChange"
      :placeholder="t('modelSelector.selectPlaceholder')"
      :no-match-text="t('modelSelector.noMatchText')"
      :no-data-text="t('modelSelector.noDataText')"
    >
      <el-option v-for="model in availableModels" :key="model.name" :label="model.name" :value="model.name" />
    </el-select>
    <el-icon :disabled="hasMessages" :title="t('modelSelector.iconText')" size="30" class="refresh-icon" :class="{ 'icon-rotate': refreshingModel }" @click="performRefreshModel"><Refresh /></el-icon>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Refresh } from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";

// 脚本引入
import { useChats } from "../../utils/chatUtils.ts";
import { useAI } from "../../utils/api/useAI.ts";

// 118n对象
const { t, locale } = useI18n();
// 当前激活的对话，切换模型，是否有消息
const { activeChat, switchModel, hasMessages } = useChats();
// 刷新模型，可用的模型列表
const { refreshModels, availableModels } = useAI();
// 延时函数
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
// 是否刷新模型中
const refreshingModel = ref(false);
// 选择的模型
const chooseModel = ref(activeChat.value?.model);

/**
 * 刷新模型
 */
const performRefreshModel = async () => {
  refreshingModel.value = true;
  await Promise.all([refreshModels(), sleep(1000)]);
  refreshModels().then(() => {
    refreshingModel.value = false;
  });
};

/**
 * 切换模型
 */
const handleModelChange = () => {
  switchModel(chooseModel.value);
};

/**
 * onMounted
 */
onMounted(() => {
  const choosedModelObj = availableModels.value.filter((model) => model.name === chooseModel.value);
  if (!choosedModelObj || choosedModelObj.length <= 0) {
    chooseModel.value = "";
    switchModel("");
  }
});

/**
 * watch
 */
watch(activeChat, () => {
  chooseModel.value = activeChat.value?.model;
});
</script>

<style lang="less" scoped>
.model-selector {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  .model-select {
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
