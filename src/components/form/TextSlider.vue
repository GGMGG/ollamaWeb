<template>
  <div>
    <span v-if="label">{{ label }}</span>
    <el-slider
      v-model="inputValue"
      :disabled="disabled"
      :show-input="showInput"
      :min="min"
      :max="max"
      :setp="step"
      size="large"
      placement="right"
      @change="changeValue"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

// 定义emit
const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
}>();

// 定义props
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  showInput: {
    type: Boolean,
    default: false,
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 100,
  },
  step: {
    type: Number,
    default: 1,
  },
  isFloat: {
    type: Boolean,
    default: false,
  },
  floatRate: {
    type: Number,
    default: 10,
  },
});

const inputValue = ref(props.modelValue);

/**
 * 数据更新
 * @param value
 */
const changeValue = (value: any) => {
  if (props.isFloat) {
    inputValue.value = inputValue.value / props.floatRate;
  }

  emit("update:modelValue", inputValue.value);
};

/**
 * onMounted
 */
onMounted(() => {});
</script>

<style lang="less" scoped>
:deep .el-slider__runway.show-input {
  margin-left: 10px;
  margin-right: 15px;
}

:deep .el-input-number {
  width: 150px;
}
</style>
