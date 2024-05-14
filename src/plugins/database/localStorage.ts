import { useLocalStorage } from "@vueuse/core";

// 语言
export const language = useLocalStorage("language", "zh");
// 暗黑模式
export const isDarkMode = useLocalStorage("isDarkMode", false);
// ollama API地址
export const baseUrl = useLocalStorage("baseUrl", "http://localhost:11434");
// 是否流式处理响应
export const isStream = useLocalStorage("isStream", false);
// 是否携带历史记录
export const withHistory = useLocalStorage("withHistory", true);
// num_ctx配置，上下文窗口的大小
export const numCtx = useLocalStorage("numCtx", 2048);
// seed配置，设置用于生成的随机数种子。将其设置为特定数字将使模型为同一提示生成相同的文本
export const seed = useLocalStorage("seed", 0);
// top_k配置，降低产生废话的可能性。较高的值（例如 100）将给出更多样化的答案，而较低的值（例如 10）将更保守。（默认值：40）
export const topK = useLocalStorage("topK", 40);
// top_p配置，与 top_k 配合使用。较高的值（例如，0.95）将导致更多样化的文本，而较低的值（例如，0.5）将生成更集中和保守的文本。（默认值：0.9）
export const topP = useLocalStorage("topP", 0.9);
// 图片上传最大限制配置
export const uploadImagesLimit = useLocalStorage("uploadImagesLimit", 3);
