<template>
  <div class="main-container">
    <el-row class="main-row">
      <el-col :span="4" class="left-sidebar"><Sidebar :available="apiUrlAvailable" /></el-col>
      <el-col :span="16" class="middle-container"><Conversation /></el-col>
      <el-col :span="4" class="right-setting"><Settings :available="apiUrlAvailable" /></el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
// 脚本引入
import { useApi } from "./utils/api/useApi.ts";
import { isUrlValid } from "./utils/commonUtils.ts";
// 数据引入
import { isDarkMode } from "./utils/database/localStorage.ts";
// 组件引入
import Sidebar from "./components/layout/Sidebar.vue";
import Settings from "./components/layout/Settings.vue";
import Conversation from "./components/layout/Conversation.vue";

// apiUrl对象
const { apiUrl } = useApi();
// apiUrl是否可用
const apiUrlAvailable = ref(false);

/**
 * onMounted
 */
onMounted(() => {
  // html dom
  const html = document.documentElement;
  isDarkMode.value ? (html.className = "dark") : (html.className = "");
  // 验证apiUrl可用性
  isUrlValid(apiUrl).then((result) => {
    if (result) {
      apiUrlAvailable.value = true;
    }
  });
});
</script>

<style lang="less">
.main-container {
  width: 100vw;
  height: 100vh;

  .main-row,
  .left-sidebar,
  .middle-container,
  .right-setting {
    height: 100%;
  }
}
</style>
