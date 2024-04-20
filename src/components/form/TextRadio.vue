<template>
  <div>
    <span v-if="label">{{ label }}</span>
    <br />
    <el-radio-group v-model="radioValue" @change="$emit('update:modelValue', radioValue)" fill="#2454ff">
      <el-radio-button :label="t('textRadio.yes')" :value="true" size="large" />
      <el-radio-button :label="t('textRadio.no')" :value="false" size="large" />
    </el-radio-group>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

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

// 118n对象
const { t, locale } = useI18n();

const radioValue = ref(props.modelValue);
</script>
