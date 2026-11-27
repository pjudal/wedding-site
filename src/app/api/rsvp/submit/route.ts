import { readQuestions } from "@/lib/rsvp-question-store";
import { cleanAnswers } from "@/lib/rsvp-questions";
import { site } from "@/content";
import { listGuests, saveResponses, type ResponseUpdate } from "@/lib/store";

const MAX = 500;
const text = (v: unknown) => (typeof v === "string" ? v.trim().slice(0, MAX) : "");

export async function POST(request: Request) {
  if (Date.now() > new Date(site.rsvpDeadline).getTime()) {
    return Response.json({ error: "closed" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const rows: unknown[] = Array.isArray(body?.responses) ? body.responses.slice(0, 20) : [];
  const message = text(body?.message);
  if (rows.length === 0) return Response.json({ error: "invalid" }, { status: 400 });

  const updates: ResponseUpdate[] = [];
  for (const r of rows as Record<string, unknown>[]) {
    const attending = r?.attending;
    if (attending !== "yes" && attending !== "no") return Response.json({ error: "invalid" }, { status: 400 });
    updates.push({
      id: String(r.id ?? ""),
      attending,
      nightBefore: attending === "yes" && r.nightBefore === "yes" ? "yes" : "no",
      dietary: attending === "yes" ? text(r.dietary) : "",
      message,
    });
  }

  try {
    const guests = await listGuests();
    const found = updates.map((u) => guests.find((g) => g.id === u.id));
    // Every id must exist and belong to the same party.
    if (found.some((g) => !g) || new Set(found.map((g) => g!.party)).size !== 1) {
      return Response.json({ error: "invalid" }, { status: 400 });
    }
    const questions = await readQuestions();
    if (questions.length && updates.some((update) => update.attending === "yes")) {
      const answers = cleanAnswers(questions, body?.answers);
      if (!answers) return Response.json({ error: "questions" }, { status: 400 });
      const saved = JSON.stringify(questions.filter((question) => answers[question.id]?.length)
        .map((question) => ({ id: question.id, question: question.label, answers: answers[question.id] })));
      if (saved.length > 48_000) return Response.json({ error: "questions" }, { status: 400 });
      for (const update of updates) update.extraAnswers = saved;
    }
    await saveResponses(updates);
    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "server" }, { status: 500 });
  }
}
