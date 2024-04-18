<template>
  <div>
    <span v-if="label">{{ label }}</span>
    <el-input
      v-model="inputValue"
      size="large"
      :type="type"
      :autofocus="autofocus"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', inputValue)"
      @blur="$emit('blur')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

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
</script>
