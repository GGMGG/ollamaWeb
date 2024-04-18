<template>
  <div class="model-table-div">
    <el-table :data="availableModels" :empty-text="t('modelTable.noDataText')" :with-header="false" class="model-table">
      <el-table-column property="name" :label="t('modelTable.columnModelName')" />
      <el-table-column :label="t('modelTable.columnAction')" width="130">
        <template #default="scope">
          <el-popconfirm
            width="250"
            :title="t('modelTable.confirmDelete.title')"
            :confirm-button-text="t('modelTable.confirmDelete.confirmBtnText')"
            :cancel-button-text="t('modelTable.confirmDelete.cancelBtnText')"
            @confirm="handleDelete(scope.row)"
          >
            <template #reference>
              <el-button class="right-setting-action-btn" type="danger" :disabled="delModelBtnDisabled" :loading="delModelBtnLoading">{{ t("modelTable.deleteText") }}</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

// 脚本引入
import { useAI } from "../../utils/api/useAI.ts";
import { showNotification } from "../../utils/commonUtils.ts";
import { useApi } from "../../utils/api/useApi.ts";

// 118n对象
const { t, locale } = useI18n();
// 刷新模型，可用模型列表
const { refreshModels, availableModels } = useAI();
// 获取模型
const { deleteModel } = useApi();
// 通知提示
const { success, warning } = showNotification();
// 删除模型按钮是否可用
const delModelBtnDisabled = ref(false);
// 删除模型按钮是否loading
const delModelBtnLoading = ref(false);

/**
 * 执行删除
 * @param row
 */
const handleDelete = (row: any) => {
  deleteModel({ name: row.name })
    .then((result) => {
      delModelBtnDisabled.value = true;
      delModelBtnLoading.value = true;
      if (result?.status) {
        success(`${t("modelTable.deleteSuccess")}`, `${t("modelTable.deleteSuccess")}`);
      } else {
        warning(`${t("modelTable.deleteFailed")}`, `${t("modelTable.deleteFailed")}`);
      }

      delModelBtnDisabled.value = false;
      delModelBtnLoading.value = false;
      refreshModels();
    })
    .catch(() => {
      delModelBtnDisabled.value = false;
      delModelBtnLoading.value = false;
    });
};
</script>

<style lang="less" scoped>
.model-table-div {
  .model-table {
    font-family: PingFang SC;
    font-style: normal;
    font-weight: 600;
  }
}
</style>
