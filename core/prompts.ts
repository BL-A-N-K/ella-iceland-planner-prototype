export function buildTaskPrompt(uni: {
  name: string;
  city?: string;
  fee?: string;
  link?: string;
  applyLink?: string;
  housingLink?: string;
  permitLink?: string;
  notes?: string;
  isCustom?: boolean;
  [key: string]: unknown;
}): string {
  return `You are helping a young Nigerian woman named Ella who wants to study nursing in Iceland. She has selected ${uni.name} in ${uni.city ?? "Iceland"}.

University info:
- Registration fee: ${uni.fee ?? "not specified"} per year (no tuition fees)
- Nursing programme: ${uni.link ?? "see university website"}
- Apply: ${uni.applyLink ?? "see university website"}
- Housing: ${uni.housingLink ?? "see university website"}
- Visa/permit info: ${uni.permitLink ?? "https://utl.is"}
- Notes: ${uni.notes ?? ""}
${uni.isCustom ? "- This is a university Ella added herself." : ""}

Generate two sets of tasks for Ella, personalised to ${uni.name}:

BEFORE: Tasks to complete BEFORE arriving in Iceland (language, application, documents, visa, finances). 8-10 tasks.
AFTER: Tasks to complete AFTER arriving (settling in, studying, qualifying, permanent residency). 8-10 tasks.

Write like a friend talking to her — warm, direct, practical. Not corporate. Not a boring list. Mention this specific university by name where helpful. Include real links where they add value.

Return ONLY valid JSON, nothing else:
{"before":[{"id":"b0","text":"...","link":"...or null"}],"after":[{"id":"a0","text":"...","link":"...or null"}]}`;
}
