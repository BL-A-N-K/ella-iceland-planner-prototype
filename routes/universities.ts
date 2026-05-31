import { Router } from "express";
import { generateTask } from "../services";
import { query } from "../services/db";
import { requireAuth } from "../services/middleware";

export const universitiesRouter = Router();

type TaskInput = { text: string; link?: string | null };

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function randomChars(length: number): string {
  return Math.random().toString(36).slice(2, 2 + length);
}

function mapUniversityRow(row: Record<string, unknown>) {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    city: row.city,
    fee: row.fee,
    feeNum: row.fee_num,
    flag: row.flag,
    color: row.color,
    accent: row.accent,
    link: row.link,
    applyLink: row.apply_link,
    housingLink: row.housing_link,
    permitLink: row.permit_link,
    notes: row.notes,
    isCustom: row.is_custom,
    createdAt: row.created_at,
  };
}

function mapTaskRow(row: Record<string, unknown>) {
  return {
    id: row.id,
    text: row.text,
    link: row.link,
  };
}

function groupTasks(rows: Record<string, unknown>[]) {
  const sortByOrder = (a: Record<string, unknown>, b: Record<string, unknown>) =>
    (a.sort_order as number) - (b.sort_order as number);

  return {
    before: rows.filter((row) => row.phase === "before").sort(sortByOrder).map(mapTaskRow),
    after: rows.filter((row) => row.phase === "after").sort(sortByOrder).map(mapTaskRow),
  };
}

function normalizeTaskEntry(entry: unknown): TaskInput {
  if (typeof entry === "string" && entry.trim()) {
    return { text: entry.trim() };
  }

  if (typeof entry === "object" && entry !== null && typeof (entry as TaskInput).text === "string") {
    const task = entry as TaskInput;
    return { text: task.text.trim(), link: task.link ?? null };
  }

  throw new Error("Invalid task entry");
}

function parseGeneratedTasks(raw: string): { before: TaskInput[]; after: TaskInput[] } {
  let text = raw.trim();
  const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) {
    text = codeBlock[1].trim();
  }

  const parsed = JSON.parse(text) as { before?: unknown[]; after?: unknown[] };
  if (!Array.isArray(parsed.before) || !Array.isArray(parsed.after)) {
    throw new Error("Invalid AI task format");
  }

  return {
    before: parsed.before.map(normalizeTaskEntry),
    after: parsed.after.map(normalizeTaskEntry),
  };
}

async function insertGeneratedTasks(
  userId: string,
  uniId: string,
  generated: { before: TaskInput[]; after: TaskInput[] }
) {
  for (let i = 0; i < generated.before.length; i++) {
    const task = generated.before[i];
    await query(
      `INSERT INTO tasks (id, user_id, uni_id, phase, text, link, sort_order)
       VALUES ($1, $2, $3, 'before', $4, $5, $6)`,
      [`${uniId}_b${i}`, userId, uniId, task.text, task.link ?? null, i]
    );
  }

  for (let i = 0; i < generated.after.length; i++) {
    const task = generated.after[i];
    await query(
      `INSERT INTO tasks (id, user_id, uni_id, phase, text, link, sort_order)
       VALUES ($1, $2, $3, 'after', $4, $5, $6)`,
      [`${uniId}_a${i}`, userId, uniId, task.text, task.link ?? null, i]
    );
  }
}

universitiesRouter.get("/", requireAuth, async (req, res) => {
  const result = await query(
    "SELECT * FROM universities WHERE user_id = $1 ORDER BY created_at",
    [req.user!.id]
  );

  return res.status(200).json(result.rows.map(mapUniversityRow));
});

universitiesRouter.post("/", requireAuth, async (req, res) => {
  const { name, city } = req.body;

  if (typeof name !== "string" || typeof city !== "string") {
    return res.status(400).json({ error: "name and city are required strings" });
  }

  const id = slugify(`${name}${randomChars(4)}`);
  const result = await query(
    `INSERT INTO universities (id, user_id, name, city, color, accent, flag, fee_num)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [id, req.user!.id, name, city, "#1A7A5A", "#2AE890", "🏛️", 0]
  );

  return res.status(200).json(mapUniversityRow(result.rows[0]));
});

universitiesRouter.get("/:uniId/tasks", requireAuth, async (req, res) => {
  const userId = req.user!.id;
  const { uniId } = req.params;

  const uniResult = await query(
    "SELECT * FROM universities WHERE id = $1 AND user_id = $2",
    [uniId, userId]
  );
  const uniRow = uniResult.rows[0];
  if (!uniRow) {
    return res.status(404).json({ error: "University not found" });
  }

  const tasksResult = await query(
    "SELECT * FROM tasks WHERE user_id = $1 AND uni_id = $2 ORDER BY sort_order",
    [userId, uniId]
  );

  if (tasksResult.rows.length > 0) {
    return res.status(200).json(groupTasks(tasksResult.rows));
  }

  try {
    const uni = {
      name: uniRow.name,
      city: uniRow.city,
      fee: uniRow.fee,
      feeNum: uniRow.fee_num,
      link: uniRow.link,
      applyLink: uniRow.apply_link,
      housingLink: uniRow.housing_link,
      permitLink: uniRow.permit_link,
      notes: uniRow.notes,
      isCustom: uniRow.is_custom,
    };

    const generatedRaw = await generateTask(uni);
    const generated = parseGeneratedTasks(generatedRaw);
    await insertGeneratedTasks(userId, uniId, generated);

    const insertedResult = await query(
      "SELECT * FROM tasks WHERE user_id = $1 AND uni_id = $2 ORDER BY sort_order",
      [userId, uniId]
    );

    return res.status(200).json(groupTasks(insertedResult.rows));
  } catch {
    return res.status(500).json({ error: "Failed to generate tasks" });
  }
});
