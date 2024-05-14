<template>
  <div class="chat-input">
    <div class="chat-stop-box-div" v-show="isAiResponding">
      <el-row class="chat-stop-btn-row">
        <el-col :span="6" :offset="8" class="chat-stop-btn-col" :class="{ 'chat-stop-btn-col-light': !isDarkMode }" @click="onStop">
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
        <el-col :span="20" class="chat-input-btns-col-imgs">
          <div v-for="(file, index) in uploadFileList" :key="index">
            <el-popconfirm
              width="200"
              :title="t('chatInput.confirmDelete.title')"
              :confirm-button-text="t('chatInput.confirmDelete.confirmBtnText')"
              :cancel-button-text="t('chatInput.confirmDelete.cancelBtnText')"
              @confirm="handleDeleteImages(index, file)"
            >
              <template #reference>
                <el-image :src="file.content" fit="contain" class="chat-input-btns-col-imgs-image" />
              </template>
            </el-popconfirm>
          </div>
        </el-col>
        <el-col :span="4" class="chat-input-btns-col-btns">
          <el-icon size="28" class="btns-icon" @click="handleUpload"><Picture /></el-icon>
          <el-icon size="28" class="btns-icon" v-show="!isAiResponding" @click="onPost"><Position /></el-icon>
          <el-icon size="28" class="btns-icon" :class="{ 'icon-rotate': isAiResponding }" v-show="isAiResponding"><Loading /></el-icon>
        </el-col>
      </el-row>
    </div>
  </div>
  <el-upload ref="uploadRef" action="#" multiple :auto-upload="false" accept="image/*" :file-list="uploadFileList" :on-change="handleChange" style="display: none">
    <template #trigger>
      <el-button type="primary" ref="uploadBtnRef"></el-button>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useTextareaAutosize } from "@vueuse/core";
import { Loading, Position, Picture, Delete } from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";
// 图标引入
import stop from "../../assets/svg/stop.svg";
// 脚本引入
import { useChats } from "../../plugins/utils/chatUtils.ts";
import { showMessage, getBase64 } from "../../plugins/utils/commonUtils.ts";
// 数据引入
import { isDarkMode, uploadImagesLimit } from "../../plugins/database/localStorage.ts";

// 定义emit
const emit = defineEmits<{}>();

// 118n对象
const { t, locale } = useI18n();
// 文本域、数据库autosize
const { textarea, input: userInput } = useTextareaAutosize({ input: "" });
// 消息提示
const { warning } = showMessage();
// 当前激活的对话，设置ai是否正在响应，添加用户对话信息，停止发送
const { activeChat, setIsAiResponding, addUserMessage, abort } = useChats();

// 接收响应中
const isAiResponding = ref(false);
// 输入框是否有值
const isInputValid = computed<boolean>(() => !!userInput.value.trim());

// 文件上传对象
const uploadRef = ref();
// 文件上传按钮对象
const uploadBtnRef = ref();
// 文件上传列表数据
const uploadFileList = ref([]);

/**
 * 点击自定义图标，打开文件选择弹窗
 */
const handleUpload = () => {
  if (uploadFileList.value.length >= uploadImagesLimit.value) {
    warning(`${t("chatInput.overLimit")}`);
    return;
  }

  uploadBtnRef.value.$el.click();
};

/**
 * 文件选择成功
 * @param uploadFile
 */
const handleChange = (uploadFile: any) => {
  if (uploadFile?.raw?.type.indexOf("image/") < 0) {
    warning(`${t("chatInput.uploadTypeError")}`);
    return;
  }

  getBase64(uploadFile).then((res) => {
    res &&
      uploadFileList.value.push({
        name: uploadFile.name,
        content: res,
      });
  });
};

/**
 * 文件删除
 * @param index
 * @param file
 */
const handleDeleteImages = (index: number, file: any) => {
  uploadFileList.value.splice(index, 1);
};

/**
 * 发送请求
 */
const onPost = () => {
  if (!isInputValid.value) {
    warning(`${t("chatInput.warnText")}`);
    return;
  }

  isAiResponding.value = true;
  setIsAiResponding(true);
  // 添加图片信息
  let sendImages = [];
  // 记录图片类型备注
  let imagesDesc = [];
  uploadFileList.value.forEach((file) => {
    const spliceIndex = file.content.indexOf("base64,") + 7;
    sendImages.push(file.content.substring(spliceIndex));
    imagesDesc.push(file.content.substring(0, spliceIndex));
  });
  // 添加用户对话信息，并进行发送
  addUserMessage(userInput.value.trim(), sendImages, imagesDesc).then(() => {
    isAiResponding.value = false;
  });

  userInput.value = "";
  uploadFileList.value = [];
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
  setIsAiResponding(false);
};

/**
 * 设置输入框的值
 * @param inputValue
 */
const setInputValue = (inputValue: string) => {
  userInput.value = inputValue.trim();
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

/**
 * defineExpose
 */
defineExpose({
  setInputValue,
});
</script>

<style lang="less" scoped>
.chat-input {
  width: 90%;
  margin-left: 5%;

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
      margin: 10px 3px -5px 0;

      .btns-icon {
        margin-right: 10px;
        cursor: pointer;
      }

      .chat-input-btns-col-imgs {
        display: flex;

        .chat-input-btns-col-imgs-image {
          width: 36px;
          height: 36px;
          margin-right: 10px;
          cursor: pointer;
        }
      }

      .chat-input-btns-col-btns {
        display: flex;
        justify-content: flex-end;
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
