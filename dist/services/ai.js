"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callAI = callAI;
async function callAI(prompt) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        throw new Error("ANTHROPIC_API_KEY is not set");
    }
    const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1024,
            messages: [{ role: "user", content: prompt }],
        }),
    });
    if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status}`);
    }
    const data = (await response.json());
    const text = data.content?.find((block) => block.type === "text")?.text;
    if (typeof text !== "string" || !text.trim()) {
        throw new Error("Invalid Anthropic API response");
    }
    return text.trim();
}
