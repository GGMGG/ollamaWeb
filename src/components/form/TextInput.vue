<template>
  <div>
    <span v-if="label">{{ label }}</span>
    <el-input v-model="inputValue" size="large" :type="type" :autofocus="autofocus" :placeholder="placeholder" @input="changeValue" @blur="$emit('blur')" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
// 脚本引入
import { isDecimal } from "../../plugins/utils/commonUtils.ts";

// 定义emit
const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
  (event: "blur"): void;
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
  type: {
    type: String,
    default: "text",
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "",
  },
});

const inputValue = ref(props.modelValue);

/**
 * 数据更新
 * @param value
 */
const changeValue = (value: any) => {
  if (props.type === "number") {
    if (isDecimal(inputValue.value)) {
      inputValue.value = parseFloat(inputValue.value);
    } else {
      inputValue.value = parseInt(inputValue.value);
    }
  }

  emit("update:modelValue", inputValue.value);
};

</script>
