export const questionTypes = ["short text", "paragraph", "single choice", "checkboxes", "dropdown"] as const;

export type Question = {
  id: string;
  label: string;
  type: typeof questionTypes[number];
  required: boolean;
  options: string[];
  condition?: { questionId: string; option: string };
};

export type Answers = Record<string, string[]>;

export function visibleQuestions(questions: Question[], answers: Answers) {
  const shown = new Set<string>();
  return questions.filter(({ id, condition }) => {
    if (condition && !(shown.has(condition.questionId) && answers[condition.questionId]?.includes(condition.option))) return false;
    shown.add(id);
    return true;
  });
}

export function validateQuestions(value: unknown): value is Question[] {
  if (!Array.isArray(value) || value.length > 20) return false;
  const seen = new Map<string, Question>();
  return value.every((question: Question) => {
    if (!question || typeof question.id !== "string" || !/^[a-f0-9-]{36}$/.test(question.id) || seen.has(question.id) ||
      typeof question.label !== "string" || !question.label.trim() || question.label.length > 160 ||
      !questionTypes.includes(question.type) || typeof question.required !== "boolean" ||
      !Array.isArray(question.options) || question.options.length > 15 ||
      !question.options.every((option) => typeof option === "string" && !!option.trim() && option.length <= 80) ||
      new Set(question.options).size !== question.options.length) return false;
    const isChoice = question.type !== "short text" && question.type !== "paragraph";
    if (isChoice ? question.options.length < 2 : question.options.length > 0) return false;
    if (question.condition !== undefined && (!question.condition ||
      !seen.get(question.condition.questionId)?.options.includes(question.condition.option))) return false;
    seen.set(question.id, question);
    return true;
  });
}

export function cleanAnswers(questions: Question[], raw: unknown, enforceRequired = true): Answers | null {
  const input = raw && typeof raw === "object" ? raw as Record<string, unknown> : {};
  const result: Answers = {};
  const shown = new Set<string>();
  for (const question of questions) {
    if (question.condition && !(shown.has(question.condition.questionId) &&
      result[question.condition.questionId]?.includes(question.condition.option))) continue;
    shown.add(question.id);
    const value = input[question.id] ?? [];
    if (!Array.isArray(value) || value.length > (question.type === "checkboxes" ? question.options.length : 1) ||
      value.some((item) => typeof item !== "string" || item.length > 500)) return null;
    const answers = [...new Set(value.map((item: string) => item.trim()).filter(Boolean))];
    if (question.options.length && answers.some((answer) => !question.options.includes(answer))) return null;
    if (enforceRequired && question.required && !answers.length) return null;
    if (answers.length) result[question.id] = answers;
  }
  return result;
}
