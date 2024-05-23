import { ref } from "vue";
import {
  GenerateChatCompletionRequest,
  GenerateChatCompletionResponse,
  CreateModelRequest,
  CreateModelResponse,
  ListLocalModelsResponse,
  ShowModelInformationRequest,
  ShowModelInformationResponse,
  CopyModelRequest,
  CopyModelResponse,
  DeleteModelRequest,
  DeleteModelResponse,
  PullModelRequest,
  PullModelResponse,
  PushModelRequest,
  PushModelResponse,
  GenerateEmbeddingsRequest,
  GenerateEmbeddingsResponse,
} from "../type/TApi";
import { Message } from "../type/TIndexDB.ts";
import { baseUrl } from "../database/localStorage.ts";

// ollama api url
const getApiUrl = (path: string) => `${baseUrl.value || "http://localhost:11434"}${path}`;
// 终止控制器
const abortController = ref<AbortController>(new AbortController());
// signal
const signal = ref<AbortSignal>(abortController.value.signal);

/**
 * useApi
 */
export const useApi = () => {
  /**
   * 错误信息
   */
  const error = ref(null);

  /**
   * api url
   */
  const apiUrl = getApiUrl("/api/tags");

  /**
   * 模型列表
   */
  const listLocalModels = async (): Promise<ListLocalModelsResponse> => {
    const response = await fetch(getApiUrl("/api/tags"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  };

  /**
   * 获取模型详情
   */
  const showModelInformation = async (request: ShowModelInformationRequest): Promise<ShowModelInformationResponse> => {
    const response = await fetch(getApiUrl("/api/show"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    return await response.json();
  };

  /**
   * 进行对话
   */
  const generateChatCompletion = async (
    request: GenerateChatCompletionRequest,
    onDataReceived: (data: GenerateChatCompletionResponse) => void
  ): Promise<GenerateChatCompletionResponse[]> => {
    try {
      const response = await fetch(getApiUrl("/api/chat"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
        signal: signal.value,
      });

      if (!response.ok) {
        response.text().then((text) => {
          onDataReceived({
            error: JSON.parse(text)?.error,
          });
        });

        throw new Error("generateChatCompletion error");
      }

      const reader = response.body?.getReader();
      let results: GenerateChatCompletionResponse[] = [];
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          const chunk = new TextDecoder().decode(value);
          const parsedChunk: GenerateChatCompletionResponse = JSON.parse(chunk);
          onDataReceived(parsedChunk);
          results.push(parsedChunk);
        }
      }

      return results;
    } catch (error) {
      onDataReceived({
        error: error,
      });

      throw new Error(`generateChatCompletion error: ${error}`);
    }
  };

  /**
   * 创建模型
   */
  const createModel = async (request: CreateModelRequest): Promise<CreateModelResponse> => {
    const response = await fetch(getApiUrl("/api/create"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    return await response.json();
  };

  /**
   * 复制模型
   */
  const copyModel = async (request: CopyModelRequest): Promise<CopyModelResponse> => {
    const response = await fetch(getApiUrl("/api/copy"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    return await response.json();
  };

  /**
   * 删除模型
   */
  const deleteModel = async (request: DeleteModelRequest): Promise<DeleteModelResponse> => {
    const response = await fetch(getApiUrl("/api/delete"), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (response.ok) {
      return { status: true };
    } else {
      return { status: false };
    }
  };

  /**
   * 获取模型
   */
  const pullModel = async (request: PullModelRequest, onDataReceived: (data: GenerateChatCompletionResponse) => void): Promise<PullModelResponse[]> => {
    try {
      const response = await fetch(getApiUrl("/api/pull"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        response.text().then((text) => {
          onDataReceived({
            error: JSON.parse(text)?.error,
          });
        });

        throw new Error("pullModel error");
      }

      const reader = response.body?.getReader();
      let results: PullModelResponse[] = [];
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          let parsedChunk: PullModelResponse = {};
          const chunk = new TextDecoder().decode(value);
          const resultArr = chunk.split("\n").filter((item) => item.length !== 0);
          resultArr.forEach((result) => {
            const resultJson = JSON.parse(result);
            const keys = Object.keys(resultJson);
            for (let i = 0; i < keys.length; i++) {
              let key = keys[i];
              let value = resultJson[key];
              parsedChunk[key] = value;
            }

            onDataReceived(parsedChunk);
            results.push(parsedChunk);
          });
        }
      }

      return results;
    } catch (error) {
      onDataReceived({
        error: error,
      });

      throw new Error(`pullModel error: ${error}`);
    }
  };

  /**
   * 推送模型
   */
  const pushModel = async (request: PushModelRequest): Promise<PushModelResponse> => {
    const response = await fetch(getApiUrl("/api/push"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    return await response.json();
  };

  /**
   * 文本嵌入
   */
  const generateEmbeddings = async (request: GenerateEmbeddingsRequest): Promise<GenerateEmbeddingsResponse> => {
    const response = await fetch(getApiUrl("/api/embeddings"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    return await response.json();
  };

  /**
   * 终止对话
   */
  const abort = () => {
    if (abortController.value) {
      abortController.value.abort();
      abortController.value = new AbortController();
      signal.value = abortController.value.signal;
    }
  };

  return {
    error,
    apiUrl,
    listLocalModels,
    showModelInformation,
    generateChatCompletion,
    createModel,
    copyModel,
    deleteModel,
    pullModel,
    pushModel,
    generateEmbeddings,
    abort,
  };
};
