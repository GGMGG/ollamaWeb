<template>
  <div class="prompt-table-div">
    <el-row class="prompt-table-header-btns">
      <el-col :span="3">
        <el-button @click="openAddForm" type="primary" size="large">
          <el-text class="mx-1">{{ t("promptTable.headerBtns.addBtn.text") }}</el-text>
        </el-button>
      </el-col>
      <el-col :span="3" :offset="4">
        <el-popconfirm
          width="250"
          :title="t('promptTable.headerBtns.clearBtn.confirmClear.title')"
          :confirm-button-text="t('promptTable.headerBtns.clearBtn.confirmClear.confirmBtnText')"
          :cancel-button-text="t('promptTable.headerBtns.clearBtn.confirmClear.cancelBtnText')"
          @confirm="handleClear"
        >
          <template #reference>
            <el-button type="danger" size="large">
              <el-text class="mx-1">{{ t("promptTable.headerBtns.clearBtn.text") }}</el-text>
            </el-button>
          </template>
        </el-popconfirm>
      </el-col>
    </el-row>
    <el-table :data="prompts" :empty-text="t('promptTable.table.noDataText')" :with-header="false" class="prompt-table">
      <el-table-column property="name" :label="t('promptTable.table.columnPromptName')" />
      <el-table-column :label="t('promptTable.table.columnAction')" width="200">
        <template #default="scope">
          <el-button class="right-setting-action-btn" @click="openUpdateForm(scope.row)" type="primary">{{ t("promptTable.table.editText") }}</el-button>
          <el-popconfirm
            width="250"
            :title="t('promptTable.table.confirmDelete.title')"
            :confirm-button-text="t('promptTable.table.confirmDelete.confirmBtnText')"
            :cancel-button-text="t('promptTable.table.confirmDelete.cancelBtnText')"
            @confirm="handleDelete(scope.row)"
          >
            <template #reference>
              <el-button class="right-setting-action-btn" type="danger">{{ t("promptTable.table.deleteText") }}</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="promptFormVisiable" :title="t('promptTable.headerBtns.addBtn.text')" width="600" @close="closeForm" destroy-on-close>
      <el-form ref="promptFormRef" :model="promptForm" :rules="promptFormRules">
        <el-form-item :label="t('promptTable.headerBtns.addBtn.form.columnName')" prop="name" :label-width="formLabelWidth">
          <el-input v-model="promptForm.name" autocomplete="off" maxlength="20" show-word-limit :placeholder="t('promptTable.headerBtns.addBtn.form.columnNamePlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('promptTable.headerBtns.addBtn.form.columnContent')" prop="content" :label-width="formLabelWidth">
          <el-input
            v-model="promptForm.content"
            :rows="8"
            resize="none"
            type="textarea"
            maxlength="4000"
            show-word-limit
            :placeholder="t('promptTable.headerBtns.addBtn.form.columnContentPlaceholder')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="promptFormVisiable = false">{{ t("promptTable.headerBtns.addBtn.form.cancelBtnText") }}</el-button>
          <el-button type="primary" @click="handleAddOrUpdatePrompt">{{ t("promptTable.headerBtns.addBtn.form.confirmBtnText") }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue";
import { useI18n } from "vue-i18n";
// 脚本引入
import { usePrompt } from "../../plugins/utils/promptUtils.ts";
import { showNotification } from "../../plugins/utils/commonUtils.ts";

// 118n对象
const { t, locale } = useI18n();
// 可用的提示词列表，添加提示词，更新提示词，删除提示词，清空提示词，刷新提示词
const { prompts, addPrompt, updatePrompt, deletePrompt, clearPrompts, refreshPrompts } = usePrompt();
// 通知消息
const { success, warning } = showNotification();
// 提示词表单ref对象
const promptFormRef = ref();
// 提示词表单是否可见
const promptFormVisiable = ref(false);
// 提示词表单项label宽度
const formLabelWidth = "60px";
// 提示词表单对象
const promptForm = ref({ name: "", content: "" });
// 提示词表单默认数据
const promptFormDefault = ref({ name: "", content: "" });
// 提示词表单规则
const promptFormRules = ref();
// 提示词表单更新ID
const promptFormUpdateId = ref(null);

/**
 * form关闭回调
 */
const closeForm = () => {
  promptFormRef.value && promptFormRef.value.resetFields();
  promptFormUpdateId.value = null;
  promptForm.value = promptFormDefault.value;
  promptFormRules.value = {};
};

/**
 * 打开新增表单
 */
const openAddForm = () => {
  promptFormRules.value = getPromptFormRules();
  promptFormVisiable.value = true;
};

/**
 * 打开更新表单
 * @param row
 */
const openUpdateForm = (row: any) => {
  promptForm.value = row;
  promptFormUpdateId.value = row.id;
  promptFormVisiable.value = true;
};

/**
 * 执行新增或更新操作
 */
const handleAddOrUpdatePrompt = () => {
  promptFormRef.value &&
    promptFormRef.value.validate((valid, fields) => {
      if (valid) {
        if (promptFormUpdateId.value && promptFormUpdateId.value != null) {
          doAddOrUpdate("update");
        } else {
          doAddOrUpdate("add");
        }
      }
    });
};

/**
 * 执行新增或更新操作
 * @param type
 */
const doAddOrUpdate = async (type: string) => {
  if (type === "add") {
    addPrompt(promptForm.value?.name, promptForm.value?.content).then((result) => {
      if (result?.success) {
        promptFormVisiable.value = false;
      } else {
        warning(result.error);
      }
    });

    return;
  }

  if (type === "update") {
    updatePrompt(promptFormUpdateId.value, promptForm.value?.name, promptForm.value?.content).then((result) => {
      if (result?.success) {
        promptFormVisiable.value = false;
        success(`${t("promptTable.updateSuccessText")}`);
      } else {
        warning(result.error);
      }
    });
  }
};

/**
 * 执行删除
 * @param row
 */
const handleDelete = async (row: any) => {
  deletePrompt(row?.id).then((result) => {
    if (result?.success) {
      success(`${t("promptTable.deleteSuccessText")}`);
    } else {
      warning(result.error);
    }
  });
};

/**
 * 执行清空
 */
const handleClear = async () => {
  clearPrompts().then((result) => {
    if (result?.success) {
      success(`${t("promptTable.clearSuccessText")}`);
    } else {
      warning(result.error);
    }
  });
};

/**
 * 获取prompt form规则
 */
const getPromptFormRules = () => {
  return {
    name: [
      { required: true, message: `${t("promptConfig.formRules.nameMessage.required")}`, trigger: "blur" },
      { min: 1, max: 20, message: `${t("promptConfig.formRules.nameMessage.minMax")}`, trigger: "blur" },
    ],
    content: [
      { required: true, message: `${t("promptConfig.formRules.contentMessage.required")}`, trigger: "blur" },
      { min: 1, max: 4000, message: `${t("promptConfig.formRules.contentMessage.minMax")}`, trigger: "blur" },
    ],
  };
};

/**
 * onMounted
 */
onMounted(() => {
  refreshPrompts();
});
</script>

<style lang="less" scoped>
.prompt-table-div {
  .prompt-table-header-btns {
    margin-bottom: 10px;

    .mx-1 {
      font-family: PingFang SC;
      font-style: normal;
      font-weight: 600;
      color: #fff;
    }
  }

  .prompt-table {
    font-family: PingFang SC;
    font-style: normal;
    font-weight: 600;
  }
}
</style>
