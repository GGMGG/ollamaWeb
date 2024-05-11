import Dexie from "dexie";

/**
 * 对话角色
 */
export type ChatRole = "user" | "assistant" | "system";

/**
 * 对话对象
 */
export interface Chat {
  id?: number;
  name: string;
  model: string;
  prompt?: number;
  createdAt: Date;
}

/**
 * 对话记录
 */
export interface Message {
  id?: number;
  chatId: number;
  role: ChatRole;
  content: string;
  images?: string[];
  meta?: any;
  context?: number[];
  desc?: any;
  createdAt: Date;
}

/**
 * 提示词
 */
export interface Prompt {
  id?: number;
  name: string;
  content: string;
}

/**
 * indexDB类
 */
class ChatDatabase extends Dexie {
  /**
   * 全部对话对象
   */
  chats: Dexie.Table<Chat, number>;

  /**
   * 全部对话记录
   */
  messages: Dexie.Table<Message, number>;

  /**
   * 全部提示词
   */
  prompts: Dexie.Table<Prompt, number>;

  /**
   * 构造函数
   */
  constructor() {
    super("ChatDatabase");
    this.version(1).stores({
      chats: "++id,name,model,prompt,createdAt",
      messages: "++id,chatId,role,content,images,meta,context,desc,createdAt",
      prompts: "++id,name,content",
    });

    this.chats = this.table("chats");
    this.messages = this.table("messages");
    this.prompts = this.table("prompts");
  }
}

export const db = new ChatDatabase();
