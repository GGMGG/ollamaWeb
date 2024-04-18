import i18n from "../locale/index.ts";

// 118n对象
const { t } = i18n.global;

/**
 * 获取prompt form默认配置
 */
export const getPromptForm = () => {
  return { name: "", content: "" };
};

/**
 * 获取prompt form规则
 */
export const getPromptFormRules = () => {
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
