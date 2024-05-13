import { ref } from "vue";
import { ChatMessage, GenerateChatCompletionResponse, PullModelResponse, Model, useApi } from "./useApi.ts";
import { isStream, numCtx, seed, topK, topP } from "../database/localStorage.ts";

/**
 * 可用的模型列表
 */
const availableModels = ref<Model[]>([]);

/**
 * useeAi
 */
export const useAI = () => {
  /**
   * 生成会话，模型列表，获取模型，删除模型
   */
  const { generateChatCompletion, listLocalModels, pullModel } = useApi();

  /**
   * 生成对话
   */
  const generateChat = async (
    model: string,
    messages: Record<ChatMessage>,
    onMessage?: (data: GenerateChatCompletionResponse) => void,
    onDone?: (isStream: boolean, data: GenerateChatCompletionResponse) => void,
    onError?: (errorText: string) => void
  ) => {
    // 模型参数
    const options = {
      num_ctx: numCtx.value,
      seed: seed.value,
      top_k: topK.value,
      top_p: topP.value,
    };

    // 请求参数
    const request = {
      model: model,
      messages: messages,
      options: options,
      stream: isStream.value,
    };

    await generateChatCompletion(request, (data: GenerateChatCompletionResponse) => {
      // 是否有报错信息
      if (data.error) {
        onError(data.error);
        return;
      }

      // 非流式处理，一次性获取到了最终回复
      if (!request.stream && data.done && onDone) {
        onDone(false, data as GenerateChatCompletionResponse);
        return;
      }

      // 流式处理
      if (request.stream) {
        if (!data.done && onMessage) {
          onMessage(data as GenerateChatCompletionResponse);
        } else if (data.done && onDone) {
          onDone(true, data as GenerateChatCompletionResponse);
        }
      }
    });
  };

  /**
   * 刷新模型
   */
  const refreshModels = async () => {
    const response = await listLocalModels();
    availableModels.value = response.models;
  };

  return {
    availableModels,
    generateChat,
    refreshModels,
  };
};
