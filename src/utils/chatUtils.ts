import { computed, ref } from "vue";

import i18n from "../locale/index.ts";
import { Chat, Message } from "./database/indexDB.ts";
import { dbLayer } from "./indexDBUtils.ts";
import { useAI } from "./api/useAI.ts";
import { usePrompt } from "./promptUtils.ts";
import { showNotification } from "./commonUtils.ts";
import { GenerateChatCompletionResponse, useApi } from "./api/useApi.ts";
import { withHistory } from "./database/localStorage.ts";

/**
 * 全部对话对象
 */
const chats = ref<Chat[]>([]);

/**
 * 当前对话对象
 */
const activeChat = ref<Chat | null>(null);

/**
 * 对话
 */
const messages = ref<Message[]>([]);

/**
 * 发送中的信息
 */
const ongoingAiMessages = ref<Map<number, Message>>(new Map());

/**
 * ai是否正在响应
 */
const isAiResponding = ref(false);

// 118n对象
const { t } = i18n.global;

// 通知信息
const { warning } = showNotification();

/**
 * 开始会话
 */
export function useChats() {
  const { generateChat } = useAI();
  const { getPromptById } = usePrompt();
  const { abort } = useApi();

  /**
   * 根据时间排序
   */
  const sortedChats = computed<Chat[]>(() => [...chats.value].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));

  /**
   * 是否有对话
   */
  const hasActiveChat = computed(() => activeChat.value !== null);

  /**
   * 是否有消息
   */
  const hasMessages = computed(() => messages.value.length > 0);

  /**
   * 设置当前对话
   */
  const setActiveChat = (chat: Chat) => (activeChat.value = chat);

  /**
   * 设置消息
   */
  const setMessages = (newMessages: Message[]) => (messages.value = newMessages);

  /**
   * 设置是否响应
   */
  const setIsAiResponding = (isResponding: boolean) => (isAiResponding.value = isResponding);

  /**
   * 初始化
   */
  const initialize = async () => {
    try {
      if (sortedChats.value && sortedChats.value.length > 0) {
        setActiveChat(sortedChats.value[0]);
      } else {
        chats.value = await dbLayer.getAllChats();
        if (chats.value.length > 0) {
          await switchChat(sortedChats.value[0].id!);
        } else {
          await startNewChat(`${t("sidebar.newChatText")}`, "n/a");
        }
      }
    } catch (error) {
      console.error("initialize error:", error);
    }
  };

  /**
   * 切换对话
   */
  const switchChat = async (chatId: number) => {
    try {
      const chat = await dbLayer.getChat(chatId);
      if (chat) {
        setActiveChat(chat);
        const chatMessages = await dbLayer.getMessages(chatId);
        setMessages(chatMessages);
      }
    } catch (error) {
      console.error("switchChat error:", error);
    }
  };

  /**
   * 切换模型
   */
  const switchModel = async (model: string) => {
    if (!activeChat.value || hasMessages.value) return;
    try {
      await dbLayer.updateChat(activeChat.value.id!, { model });
      activeChat.value.model = model;
      chats.value = await dbLayer.getAllChats();
    } catch (error) {
      console.error("switchModel error:", error);
    }
  };

  /**
   * 切换提示词
   */
  const switchPrompt = async (prompt: string) => {
    if (!activeChat.value || hasMessages.value) return;
    try {
      await dbLayer.updateChat(activeChat.value.id!, { prompt });
      activeChat.value.prompt = prompt;
      chats.value = await dbLayer.getAllChats();
    } catch (error) {
      console.error("switchPrompt error", error);
    }
  };

  /**
   * 重命名对话
   */
  const renameChat = async (newName: string) => {
    if (!activeChat.value) return;
    activeChat.value.name = newName;
    await dbLayer.updateChat(activeChat.value.id!, { name: newName });
    chats.value = await dbLayer.getAllChats();
  };

  /**
   * 新建对话
   */
  const startNewChat = async (name: string, model: string) => {
    const newChat: Chat = {
      name,
      model,
      createdAt: new Date(),
    };

    try {
      newChat.id = await dbLayer.addChat(newChat);
      chats.value.push(newChat);
      setActiveChat(newChat);
      setMessages([]);
    } catch (error) {
      console.error("startNewChat error", error);
    }
  };

  /**
   * 添加system的信息
   */
  const addSystemMessage = async (content: string, meta?: any) => {
    if (!activeChat.value) return;
    const message: Message = {
      chatId: activeChat.value.id!,
      role: "system",
      content,
      meta,
      createdAt: new Date(),
    };

    try {
      await dbLayer.addMessage(message);
      messages.value.push(message);
    } catch (error) {
      console.error("addSystemMessage error:", error);
    }
  };

  /**
   * 添加用户的信息
   */
  const addUserMessage = async (content: string, images: string[], desc: any) => {
    if (!activeChat.value) {
      console.warn("no chat choose");
      return;
    }

    const currentChatId = activeChat.value.id;
    // 当前信息
    const message: Message = {
      chatId: currentChatId,
      role: "user",
      content,
      images,
      desc,
      createdAt: new Date(),
    };

    try {
      // 要发送的对话信息
      let sendMessages: Message[] = [];
      // 添加当前对话信息到数据库
      message.id = await dbLayer.addMessage(message);
      messages.value.push(message);
      // 获取提示词并以system角色设置
      const promptContent = await getActiveChatPromptContent(activeChat.value?.prompt);
      promptContent &&
        sendMessages.push({
          role: "system",
          content: promptContent,
        });

      // 添加历史信息以及当前信息
      if (withHistory.value) {
        messages.value.forEach((message) => {
          sendMessages.push(message);
        });
      } else {
        // 只添加当前信息
        sendMessages.push(message);
      }

      // 发起请求
      await generateChat(
        activeChat.value.model,
        sendMessages,
        (data: GenerateChatCompletionResponse) => handleGenerateChatOnMessage(data, currentChatId),
        (isStream: boolean, data: GenerateChatCompletionResponse) => handleGenerateChatOnDone(isStream, data, currentChatId),
        (errorText: string) => handleGenerateChatOnError(errorText)
      );
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          ongoingAiMessages.value.delete(currentChatId);
          return;
        }
      }

      console.error("addUserMessage error:", error);
    }
  };

  /**
   * 添加AI的信息
   */
  const addAssistantMessage = async (isStream: boolean, content: string, chatId: number) => {
    const message: Message = {
      chatId: chatId,
      role: "assistant",
      content: content,
      createdAt: new Date(),
    };

    try {
      message.id = await dbLayer.addMessage(message);
      messages.value.push(message);
      // 如果是流式，需要设置当前正在发送的消息
      isStream && ongoingAiMessages.value.set(chatId, message);
    } catch (error) {
      console.error("addAssistantMessage error:", error);
    }
  };

  /**
   * 拼接AI的信息（流式的情况，结果是一段一段的返回的，要进行拼接）
   */
  const appendToAssistantMessage = async (content: string, chatId: number) => {
    const aiMessage = ongoingAiMessages.value.get(chatId);
    if (aiMessage) {
      aiMessage.content += content;
      try {
        await dbLayer.updateMessage(aiMessage.id!, { content: aiMessage.content });
        if (chatId == activeChat.value?.id) {
          setMessages(await dbLayer.getMessages(chatId));
        }
      } catch (error) {
        console.error("appendToAssistantMessage error:", error);
      }
    } else {
      console.log("no sending message");
    }
  };

  /**
   * 获取当前聊天对象的提示词
   */
  const getActiveChatPromptContent = async (currentPromptId: number) => {
    let promptContent = "";
    if (currentPromptId) {
      await getPromptById(currentPromptId).then((result) => {
        if (result?.success) {
          const prompt = result?.result?.prompt;
          if (prompt && prompt.length > 0) {
            promptContent = prompt[0].content;
          }
        }
      });
    }

    return promptContent;
  };

  /**
   * 处理未完成的响应
   */
  const handleGenerateChatOnMessage = (data: GenerateChatCompletionResponse, chatId: number) => {
    isAiResponding.value = false;
    const content = data?.message?.content;
    ongoingAiMessages.value.has(chatId) ? appendToAssistantMessage(content, chatId) : addAssistantMessage(true, content, chatId);
  };

  /**
   * 处理完成的响应
   */
  const handleGenerateChatOnDone = async (isStream: boolean, data: GenerateChatCompletionResponse, chatId: number) => {
    // 非流式响应处理
    if (!isStream) {
      try {
        isAiResponding.value = false;
        const content = data?.message?.content;
        content && addAssistantMessage(isStream, content, chatId);
      } catch (error) {
        console.error("handleGenerateChatOnDone error:", error);
      }

      return;
    }

    // 流式响应处理
    const aiMessage = ongoingAiMessages.value.get(chatId);
    if (aiMessage) {
      try {
        const content = data?.message?.content;
        content && (await dbLayer.updateMessage(chatId, { context: content }));
        ongoingAiMessages.value.delete(chatId);
      } catch (error) {
        console.error("handleGenerateChatOnDone error:", error);
      }
    } else {
      console.error("no message need handle");
    }
  };

  /**
   * 处理异常响应
   */
  const handleGenerateChatOnError = (errorText: string = "invoke error") => {
    isAiResponding.value = false;
    warning(`${t("chatUtils.generateChatError")}: ${errorText}`);
  };

  /**
   * 清除对话相关数据
   */
  const wipeDatabase = async () => {
    try {
      await dbLayer.clearChats();
      await dbLayer.clearMessages();
      const model = activeChat.value?.model;
      // 重置相关状态
      chats.value = [];
      activeChat.value = null;
      messages.value = [];
      ongoingAiMessages.value.clear();
      // 开启新的对话
      if (model) {
        await startNewChat(`${t("sidebar.newChatText")}`, model);
      } else {
        console.info("need to create new chat");
      }
    } catch (error) {
      console.error("wipeDatabase error:", error);
    }
  };

  /**
   * 删除对话
   */
  const deleteChat = async (chatId: number) => {
    try {
      await dbLayer.deleteChat(chatId);
      await dbLayer.deleteMessagesOfChat(chatId);
      chats.value = chats.value.filter((chat) => chat.id !== chatId);
      if (activeChat.value?.id === chatId) {
        if (sortedChats.value.length) {
          await switchChat(sortedChats.value[0].id!);
        } else {
          await startNewChat(`${t("sidebar.newChatText")}`, activeChat?.value.model);
        }
      }
    } catch (error) {
      console.error("deleteChat error", error);
    }
  };

  return {
    chats,
    activeChat,
    messages,
    isAiResponding,
    sortedChats,
    hasActiveChat,
    hasMessages,
    setIsAiResponding,
    initialize,
    switchChat,
    switchModel,
    switchPrompt,
    renameChat,
    startNewChat,
    addSystemMessage,
    addUserMessage,
    addAssistantMessage,
    wipeDatabase,
    deleteChat,
    abort,
  };
}
