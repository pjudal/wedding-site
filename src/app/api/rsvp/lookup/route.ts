import { readQuestions } from "@/lib/rsvp-question-store";
import { findGuest } from "@/lib/match";
import { listGuests } from "@/lib/store";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const name = typeof body?.name === "string" ? body.name.slice(0, 100) : "";
  if (!name.trim()) return Response.json({ status: "none" }, { status: 400 });

  try {
    const guests = await listGuests();
    const result = findGuest(guests, name);
    if (result.status !== "found") return Response.json({ status: result.status });

    // Only ever return the matched guest's own party, never the wider list.
    const party = guests
      .filter((g) => g.party === result.guest.party)
      .map(({ id, name, attending, nightBefore, dietary, message }) => ({
        id, name, attending, nightBefore, dietary, message,
      }));
    const questions = await readQuestions();
    let savedAnswers: unknown = [];
    try {
      savedAnswers = JSON.parse(result.guest.extraAnswers || "[]");
    } catch {}
    return Response.json({ status: "found", party, questions, savedAnswers });
  } catch (err) {
    console.error(err);
    return Response.json({ status: "error" }, { status: 500 });
  }
}
