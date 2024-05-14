import { ref } from "vue";
import i18n from "../locale/index.ts";
import { Prompt } from "../type/TIndexDB.ts";
import { PromptResponse } from "../type/TPrompt.ts";
import { dbLayer } from "./indexDBUtils.ts";

// 118n对象
const { t } = i18n.global;

/**
 * 全部提示词对象
 */
const prompts = ref<Prompt[]>([]);

/**
 * 开始会话
 */
export function usePrompt() {
  /**
   * 获取全部提示词
   */
  const getAllPrompts = async () => {
    try {
      const allPrompts = await dbLayer.getAllPrompts();
      return await { success: true, prompts: allPrompts };
    } catch (error) {
      return await { success: false, error: `获取提示词列表失败：${error}` };
    }
  };

  /**
   * 根据ID获取Prompt相关信息
   */
  const getPromptById = async (promptId: number) => {
    try {
      const prompt = await dbLayer.getPrompt(promptId);
      const result: PromptResponse = {
        success: prompt ? true : false,
        prompt: prompt,
      };

      return await { success: true, result: result };
    } catch (error) {
      return await { success: false, error: `获取提示词失败：${error}` };
    }
  };

  /**
   * 添加提示词
   */
  const addPrompt = async (name: string, content: string) => {
    try {
      const newPrompt: Prompt = {
        name,
        content,
      };

      await dbLayer.addPrompt(newPrompt);
      prompts.value.push(newPrompt);
      return await { success: true };
    } catch (error) {
      return await { success: false, error: `添加提示词失败：${error}` };
    }
  };

  /**
   * 更新提示词
   */
  const updatePrompt = async (promptId: number, name: string, content: string) => {
    try {
      const updatePrompt: Prompt = {
        name,
        content,
      };

      await dbLayer.updatePrompt(promptId, updatePrompt);
      await refreshPrompts();
      return await { success: true };
    } catch (error) {
      return await { success: false, error: `修改提示词失败：${error}` };
    }
  };

  /**
   * 删除提示词
   */
  const deletePrompt = async (promptId: number) => {
    try {
      await dbLayer.deletePrompt(promptId);
      prompts.value = prompts.value.filter((prompt) => prompt.id !== promptId);
      return await { success: true };
    } catch (error) {
      return await { success: false, error: `删除提示词失败：${error}` };
    }
  };

  /**
   * 清空提示词
   */
  const clearPrompts = async () => {
    try {
      await dbLayer.clearPrompts();
      await refreshPrompts();
      return await { success: true };
    } catch (error) {
      return await { success: false, error: `清空提示词失败：${error}` };
    }
  };

  /**
   * 刷新提示词
   */
  const refreshPrompts = async () => {
    const result = await getAllPrompts();
    if (result.success) {
      prompts.value = result.prompts;
    }
  };

  return {
    prompts,
    getAllPrompts,
    getPromptById,
    addPrompt,
    updatePrompt,
    deletePrompt,
    clearPrompts,
    refreshPrompts,
  };
}
