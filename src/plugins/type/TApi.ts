/**
 * chat message结构
 */
export type ChatMessage = {
  role: string;
  content: string;
  images?: Record<string>;
};

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
  error: string;
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
  keep_alive?: string | number;
  options?: Record<string, any>;
};

/**
 * 文本嵌入响应
 */
export type GenerateEmbeddingsResponse = {
  embeddings: number[];
};
