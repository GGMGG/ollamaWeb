import { ref } from "vue";
import { baseUrl } from "../database/localStorage.ts";
import { Message } from "../database/indexDB.ts";

/**
 * chat message结构
 */
export interface ChatMessage {
  role: string;
  content: string;
  images?: Record<string>;
}

/**
 * 生成会话请求
 */
export type GenerateChatCompletionRequest = {
  model: string;
  messages: Record<ChatMessage>;
  format: string;
  options?: Record<string, any>;
  stream?: boolean;
  keep_alive?: number;
};

/**
 * 生成会话响应
 */
export type GenerateChatCompletionResponse = {
  model: string;
  created_at: string;
  message: ChatMessage;
  done: boolean;
  total_duration: number;
  load_duration: number;
  prompt_eval_count: number;
  prompt_eval_duration: number;
  eval_count: number;
  eval_duration: number;
};

/**
 * 创建模型请求
 */
export type CreateModelRequest = {
  name: string;
  path: string;
};

/**
 * 创建模型响应
 */
export type CreateModelResponse = {
  status: string;
};

/**
 * 模型
 */
export type Model = {
  name: string;
  modified_at: string;
  size: number;
};

/**
 * 模型列表
 */
export type ListLocalModelsResponse = {
  models: Model[];
};

/**
 * 模型详情请求
 */
export type ShowModelInformationRequest = {
  name: string;
};

/**
 * 模型详情响应
 */
export type ShowModelInformationResponse = {
  license: string;
  modelfile: string;
  parameters: string;
  template: string;
};

/**
 * 复制模型请求
 */
export type CopyModelRequest = {
  source: string;
  destination: string;
};

/**
 * 复制模型响应
 */
export type CopyModelResponse = {
  status: string;
};

/**
 * 删除模型请求
 */
export type DeleteModelRequest = {
  name: string;
};

/**
 * 删除模型响应
 */
export type DeleteModelResponse = {
  status: string;
};

/**
 * 获取模型请求
 */
export type PullModelRequest = {
  name: string;
  insecure?: boolean;
  stream?: boolean;
};

/**
 * 获取模型响应
 */
export type PullModelResponse = {
  status: string;
  digest: string;
  total: number;
  completed: number;
  error: string;
};

/**
 * 推送模型请求
 */
export type PushModelRequest = {
  name: string;
  insecure?: boolean;
};

/**
 * 推送模型相关
 */
export type PushModelResponse = {
  status: string;
};

/**
 * 文本嵌入请求
 */
export type GenerateEmbeddingsRequest = {
  model: string;
  prompt: string;
  options?: Record<string, any>;
};

/**
 * 文本嵌入响应
 */
export type GenerateEmbeddingsResponse = {
  embeddings: number[];
};

// ollama api url
const getApiUrl = (path: string) => `${baseUrl.value || "http://localhost:11434/api"}${path}`;
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
  const apiUrl = getApiUrl("/tags");

  /**
   * 模型列表
   */
  const listLocalModels = async (): Promise<ListLocalModelsResponse> => {
    const response = await fetch(getApiUrl("/tags"), {
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
    const response = await fetch(getApiUrl("/show"), {
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
    const response = await fetch(getApiUrl("/chat"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      signal: signal.value,
    });

    if (!response.ok) {
      throw new Error("network error");
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
  };

  /**
   * 创建模型
   */
  const createModel = async (request: CreateModelRequest): Promise<CreateModelResponse> => {
    const response = await fetch(getApiUrl("/create"), {
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
    const response = await fetch(getApiUrl("/copy"), {
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
    const response = await fetch(getApiUrl("/delete"), {
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
  const pullModel = async (request: PullModelRequest): Promise<PullModelResponse[]> => {
    const response = await fetch(getApiUrl("/pull"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error("network error");
    }

    const contentType = response.headers.get("content-type");
    if (contentType === "application/json") {
      return await response.json();
    } else {
      // 非流式，一次性获取结果
      return await response.text().then((result) => {
        const resultArr = result.split("\n").filter((item) => item.length !== 0);
        let pullResponse: PullModelResponse = {};
        resultArr.forEach((result) => {
          const resultJson = JSON.parse(result);
          const keys = Object.keys(resultJson);
          for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let value = resultJson[key];
            pullResponse[key] = value;
          }
        });

        return pullResponse;
      });
    }
  };

  /**
   * 推送模型
   */
  const pushModel = async (request: PushModelRequest): Promise<PushModelResponse> => {
    const response = await fetch(getApiUrl("/push"), {
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
    const response = await fetch(getApiUrl("/embeddings"), {
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
