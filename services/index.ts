import { buildTaskPrompt } from "../core/prompts";
import { callAI } from "./ai";

export async function generateTask(uni: { name: string; [key: string]: unknown }): Promise<string> {
  return callAI(buildTaskPrompt(uni));
}
