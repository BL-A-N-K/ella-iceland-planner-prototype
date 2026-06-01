"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTask = generateTask;
const prompts_1 = require("../core/prompts");
const ai_1 = require("./ai");
async function generateTask(uni) {
    return (0, ai_1.callAI)((0, prompts_1.buildTaskPrompt)(uni));
}
