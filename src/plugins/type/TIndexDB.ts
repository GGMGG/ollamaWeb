/**
 * 对话角色
 */
export type ChatRole = "user" | "assistant" | "system";

/**
 * 对话对象
 */
export type Chat = {
  id?: number;
  name: string;
  model: string;
  prompt?: number;
  createdAt: Date;
};

/**
 * 对话记录
 */
export type Message = {
  id?: number;
  chatId: number;
  role: ChatRole;
  content: string;
  images?: string[];
  meta?: any;
  context?: number[];
  desc?: any;
  createdAt: Date;
};

/**
 * 提示词
 */
export type Prompt = {
  id?: number;
  name: string;
  content: string;
};
