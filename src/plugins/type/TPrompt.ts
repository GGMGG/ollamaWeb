import { Prompt } from "./TIndexDB.ts";

/**
 * 提示词返回结果
 */
export type PromptResponse = {
  success: boolean;
  prompt: Prompt;
};
