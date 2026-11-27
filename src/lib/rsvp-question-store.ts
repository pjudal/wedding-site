import { readAlbumObject, writeAlbumObject } from "@/lib/photos";
import { validateQuestions, type Question } from "@/lib/rsvp-questions";

const key = "rsvp-questions.json";

export async function readQuestions(): Promise<Question[]> {
  const object = await readAlbumObject(key);
  if (!object) return [];
  const questions: unknown = await object.json();
  if (!validateQuestions(questions)) throw new Error("Invalid stored RSVP questions");
  return questions;
}

export async function writeQuestions(questions: Question[]) {
  await writeAlbumObject(key, new TextEncoder().encode(JSON.stringify(questions)).buffer, "application/json");
}
