import { db, Chat, Message, Prompt } from "./database/indexDB.ts";

/**
 * indexdb操作
 */
export const dbLayer = {
  /**
   * 获取全部对话对象
   */
  async getAllChats() {
    return db.chats.toArray();
  },

  /**
   * 根据ID获取指定对话对象
   */
  async getChat(chatId: number) {
    return db.chats.get(chatId);
  },

  /**
   * 根据对话对象ID获取对话内容
   */
  async getMessages(chatId: number) {
    return db.messages.where("chatId").equals(chatId).toArray();
  },

  /**
   * 新增对话对象
   */
  async addChat(chat: Chat) {
    return db.chats.add(chat);
  },

  /**
   * 更新对话对象
   */
  async updateChat(chatId: number, updates: Partial<Chat>) {
    return db.chats.update(chatId, updates);
  },

  /**
   * 新增对话信息
   */
  async addMessage(message: Message) {
    return db.messages.add(message);
  },

  /**
   * 更新对话信息
   */
  async updateMessage(messageId: number, updates: Partial<Message>) {
    return db.messages.update(messageId, updates);
  },

  /**
   * 删除对话对象
   */
  async deleteChat(chatId: number) {
    return db.chats.delete(chatId);
  },

  /**
   * 删除对话对象相关对话信息
   */
  async deleteMessagesOfChat(chatId: number) {
    return db.messages.where("chatId").equals(chatId).delete();
  },

  /**
   * 清空对话对象和信息
   */
  async clearChats() {
    return db.chats.clear();
  },

  /**
   * 清空对话对象的信息
   */
  async clearMessages() {
    return db.messages.clear();
  },

  /**
   * 获取全部prompt
   */
  async getAllPrompts() {
    return db.prompts.toArray();
  },

  /**
   * 根据ID获取prompt
   */
  async getPrompt(promptId: number) {
    return db.prompts.where("id").equals(promptId).toArray();
  },

  /**
   * 添加prompt
   */
  async addPrompt(prompt: Prompt) {
    return db.prompts.add(prompt);
  },

  /**
   * 更新prompt
   */
  async updatePrompt(promptId: number, updates: Partial<Prompt>) {
    return db.prompts.update(promptId, updates);
  },

  /**
   * 删除prompt
   */
  async deletePrompt(promptId: number) {
    return db.prompts.delete(promptId);
  },

  /**
   * 清空prompt
   */
  async clearPrompts() {
    return db.prompts.clear();
  },
};
