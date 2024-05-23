<template>
  <div class="right-setting">
    <!-- 头部按钮 -->
    <div class="right-setting-heade-btns">
      <el-switch @change="changeDark" v-model="isDarkMode" size="large" inline-prompt :active-icon="Moon" :inactive-icon="Sunny" style="--el-switch-on-color: #4b4b4b"> </el-switch>
      <el-select @change="changeLang" v-model="language" size="large" class="right-setting-heade-btns-select">
        <el-option v-for="item in languageTypes" :key="item.value" :label="t(item.label)" :value="item.value" />
      </el-select>
      <el-icon size="28" class="btns-icon" @click="openGitHub">
        <img :src="!isDarkMode ? github : githubDark" />
      </el-icon>
    </div>
    <!-- 中间操作按钮 -->
    <div class="right-setting-action-btns-div">
      <el-row>
        <el-col :span="24">
          <el-button @click="modelTableVisiable = true" class="right-setting-action-btn" type="primary" size="large" :disabled="!available">
            <el-text class="mx-1" size="large">{{ t("settings.btns.modelList") }}</el-text>
          </el-button>
        </el-col>
        <el-col :span="24">
          <el-button @click="promptTableVisiable = true" class="right-setting-action-btn" type="primary" size="large" :disabled="!available">
            <el-text class="mx-1" size="large">{{ t("settings.btns.promptList") }}</el-text>
          </el-button>
        </el-col>
        <el-col :span="24">
          <el-button
            @click="doPullModel"
            class="right-setting-action-btn"
            type="primary"
            size="large"
            :disabled="pullModelBtnDisabled || !available"
            :loading="pullModelBtnLoading"
          >
            <el-text class="mx-1" size="large">{{ t("settings.btns.pullModel.text") }}</el-text>
          </el-button>
        </el-col>
        <el-col :span="24">
          <el-popconfirm
            width="250"
            :title="t('settings.btns.clearChats.confirmClear.title')"
            :confirm-button-text="t('settings.btns.clearChats.confirmClear.confirmBtnText')"
            :cancel-button-text="t('settings.btns.clearChats.confirmClear.cancelBtnText')"
            @confirm="wipeDatabase"
          >
            <template #reference>
              <el-button class="right-setting-action-btn" type="primary" size="large" :disabled="!available">
                <el-text class="mx-1" size="large">{{ t("settings.btns.clearChats.text") }}</el-text>
              </el-button>
            </template>
          </el-popconfirm>
        </el-col>
      </el-row>
    </div>
    <!-- 设置面板 -->
    <div class="right-setting-form">
      <el-text class="mx-1 right-setting-form-text" size="large">{{ t("settings.settingText") }}</el-text>
      <TextInput :label="t('settings.settingForm.ollamaApiUrl')" v-model="baseUrl" class="right-setting-form-input" />
      <el-row>
        <el-col :span="12">
          <TextRadio :label="t('settings.settingForm.streamResponse')" v-model="isStream" class="right-setting-form-input" />
        </el-col>
        <el-col :span="12">
          <TextRadio :label="t('settings.settingForm.withHistory')" v-model="withHistory" class="right-setting-form-input" />
        </el-col>
        <el-col :span="12">
          <TextInput :label="t('settings.settingForm.numCtx')" v-model="numCtx" type="number" class="right-setting-form-input right-setting-form-input-wd9" />
        </el-col>
        <el-col :span="12">
          <TextInput :label="t('settings.settingForm.seed')" v-model="seed" type="number" class="right-setting-form-input right-setting-form-input-wd9" />
        </el-col>
        <el-col :span="12">
          <TextInput :label="t('settings.settingForm.topK')" v-model="topK" type="number" class="right-setting-form-input right-setting-form-input-wd9" />
        </el-col>
        <el-col :span="12">
          <TextInput :label="t('settings.settingForm.topP')" v-model="topP" type="number" class="right-setting-form-input right-setting-form-input-wd9" />
        </el-col>
        <el-col :span="12">
          <TextInput :label="t('settings.settingForm.uploadImagesLimit')" v-model="uploadImagesLimit" type="number" class="right-setting-form-input right-setting-form-input-wd9" />
        </el-col>
      </el-row>
    </div>
    <!-- 模型下载进度提示面板 -->
    <div class="right-pull-model-progress-div" v-if="isPullingModel">
      <el-card class="right-pull-model-progress-card" shadow="always">
        <el-text class="mx-1" size="large">{{ t("settings.pullModelMsg") }}</el-text>
        <br />
        <el-text class="mx-1" size="large">{{ nowPullModelName }}</el-text>
        <br />
        <el-text class="mx-1" size="large">{{ nowPullModelPart }}</el-text>
        <el-progress class="right-pull-model-progress" :percentage="nowPullModelPercentage" :stroke-width="18" :duration="10" :color="`#2454ff`" striped striped-flow />
      </el-card>
    </div>
  </div>
  <!-- 全部模型抽屉 -->
  <el-drawer v-model="modelTableVisiable" direction="rtl" :show-close="false" size="26%">
    <ModelTable />
  </el-drawer>
  <!-- 全部prompt抽屉 -->
  <el-drawer v-model="promptTableVisiable" direction="rtl" :show-close="false" size="26%">
    <PromptTable />
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessageBox } from "element-plus";
import { Moon, Sunny } from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";
// 图标引入
import github from "../../assets/svg/github.svg";
import githubDark from "../../assets/svg/githubDark.svg";
// 对象类型引入
import { PullModelResponse } from "../../plugins/type/TApi.ts";
// 脚本引入
import { useChats } from "../../plugins/utils/chatUtils.ts";
import { useAI } from "../../plugins/api/useAI.ts";
import { useApi } from "../../plugins/api/useApi.ts";
import { showNotification, math } from "../../plugins/utils/commonUtils.ts";
// 数据引入
import { language, isDarkMode, baseUrl, isStream, withHistory, numCtx, seed, topK, topP, uploadImagesLimit } from "../../plugins/database/localStorage.ts";
import { languageTypes } from "../../config/languaguConfig.ts";
import { globalConfig } from "../../config/globalConfig.ts";
// 组件引入
import TextInput from "../form/TextInput.vue";
import TextRadio from "../form/TextRadio.vue";
import ModelTable from "../form/ModelTable.vue";
import PromptTable from "../form/PromptTable.vue";

// 定义props
const props = defineProps({
  available: {
    type: Boolean,
    default: false,
  },
});

// 118n对象
const { t, locale } = useI18n();
// 清空数据
const { wipeDatabase } = useChats();
// 刷新模型
const { refreshModels } = useAI();
// 获取模型
const { pullModel } = useApi();
// 通知信息
const { success, warning, error } = showNotification();
// 数学计算
const { divide } = math();
// 获取模型按钮是否可用
const pullModelBtnDisabled = ref(false);
// 获取模型按钮是否loading
const pullModelBtnLoading = ref(false);
// 模型列表是否可见
const modelTableVisiable = ref(false);
// 提示词列表是否可见
const promptTableVisiable = ref(false);
// 是否正在下载模型
const isPullingModel = ref(false);
// 当前下载的模型名称
const nowPullModelName = ref("");
// 下载的模型分段
const nowPullModelPart = ref("");
// 下载的模型进度
const nowPullModelPercentage = ref(0);

/**
 * 暗黑/明亮模式切换
 */
const changeDark = () => {
  const html = document.documentElement;
  isDarkMode.value ? (html.className = "dark") : (html.className = "");
};

/**
 * 切换文种
 */
const changeLang = () => {
  locale.value = language.value;
};

/**
 * 打开git地址
 */
const openGitHub = () => {
  if (globalConfig.projectUrl || globalConfig.homepage) {
    window.open(globalConfig.projectUrl || globalConfig.homepage, "_blank");
  }
};

/**
 * 获取模型
 */
const doPullModel = () => {
  ElMessageBox.prompt(`${t("settings.btns.pullModel.elMessageBox.title")}`, "", {
    confirmButtonText: `${t("settings.btns.pullModel.elMessageBox.confirmBtnText")}`,
    cancelButtonText: `${t("settings.btns.pullModel.elMessageBox.cancelBtnText")}`,
    inputValidator: (value: string) => {
      if (!value) {
        return `${t("settings.btns.pullModel.elMessageBox.warnText")}`;
      }
    },
  })
    .then(({ value }) => {
      pullModelBtnDisabled.value = true;
      pullModelBtnLoading.value = true;
      isPullingModel.value = true;
      nowPullModelName.value = value;
      invokePullModel({ name: value, stream: true });
    })
    .catch(() => {
      resetPullModelParams();
    });
};

/**
 * 执行获取模型
 * @param params
 */
const invokePullModel = async (params: any) => {
  await pullModel(params, (data: PullModelResponse) => {
    if (data.error) {
      handlePullError(data);
      return;
    }

    if (data.status !== "success") {
      handlePulling(data);
      return;
    }

    if (data.status === "success") {
      handlePullDone(data);
    }
  });
};

/**
 * 获取中
 * @param data
 */
const handlePullError = (data: PullModelResponse) => {
  error(data.status, data.error);
};

/**
 * 获取中
 * @param data
 */
const handlePulling = (data: PullModelResponse) => {
  nowPullModelPart.value = data.status;
  if (data.digest && data.completed >= 0 && data.total > 0) {
    nowPullModelPercentage.value = (divide(data.completed, data.total) * 100).toFixed(2);
  } else {
    nowPullModelPercentage.value = 0;
  }
};

/**
 * 获取完成
 * @param data
 */
const handlePullDone = (data: PullModelResponse) => {
  resetPullModelParams();
  refreshModels();
  success(`${t("settings.btns.pullModel.pullSuccess")}`, `${data.status}`);
};

/**
 * 重置获取模型相关参数
 */
const resetPullModelParams = () => {
  pullModelBtnDisabled.value = false;
  pullModelBtnLoading.value = false;
  isPullingModel.value = false;
  nowPullModelName.value = "";
  nowPullModelPart.value = "";
};

/**
 * onMounted
 */
onMounted(() => {});
</script>

<style lang="less" scoped>
.right-setting {
  .right-setting-heade-btns {
    width: 80%;
    padding-left: 5%;
    padding-top: 2px;
    display: inline-flex;
    align-items: center;

    .btns-icon {
      margin-left: 5px;
      cursor: pointer;
    }

    .right-setting-heade-btns-select {
      width: 100px;
      --el-select-border-color-hover: rgba(0, 0, 0, 0);
      --el-select-disabled-color: rgba(0, 0, 0, 0);
      --el-select-disabled-border: rgba(0, 0, 0, 0);

      :deep .el-select__wrapper {
        border-radius: 0px;
        box-shadow: 0 0 0 0px var(--el-border-color) inset;
      }
    }
  }

  .right-setting-action-btns-div {
    width: 98%;
    padding: 1%;

    .right-setting-action-btn {
      width: 92%;
      padding: 1%;
      margin-left: 4%;
      margin-bottom: 3%;
      border-radius: 8px;
      background: #2454ff;
      cursor: pointer;
      transition: background 0.25s;
    }

    .right-setting-action-btn:hover {
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
      letter-spacing: 1px;
    }
  }

  .right-setting-form {
    width: 90%;
    padding: 0 5% 0 5%;

    .right-setting-form-text {
      font-family: PingFang SC;
      font-style: normal;
      font-weight: 600;
    }

    .right-setting-form-input {
      margin-top: 10px;
    }

    .right-setting-form-input-wd9 {
      width: 90%;
    }
  }

  .right-pull-model-progress-div {
    width: 400px;
    height: auto;
    position: fixed;
    right: 10px;
    bottom: 10px;

    .right-pull-model-progress-card {
      width: 100%;

      .mx-1 {
        font-family: PingFang SC;
        font-style: normal;
        font-weight: 600;
        letter-spacing: 1px;
        margin-bottom: 50px;
      }
    }

    .right-pull-model-progress {
      margin-top: 10px;
    }
  }
}
</style>
