import { QrCode } from "./QrCode";
import type { Question } from "@/lib/rsvp-questions";

export function RsvpQuestionField({ question, value, onChange }: {
  question: Question;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const input = "w-full rounded-xl border border-dusk-200 bg-white px-4 py-3";
  if (question.type === "instructions") {
    return <p className="whitespace-pre-wrap break-words text-dusk-700">{question.content}</p>;
  }
  if (question.type === "image") {
    if (!question.content?.startsWith("https://")) return null;
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={question.content} alt={question.label} referrerPolicy="no-referrer" className="max-h-64 max-w-full rounded-xl object-contain" />;
  }
  if (question.type === "QR code") {
    return <QrCode value={question.content ?? ""} className="size-44 bg-white p-4" />;
  }
  if (question.type === "paragraph") {
    return <textarea className={input} aria-label={question.label} required={question.required}
      maxLength={500} rows={3} value={value[0] ?? ""} onChange={(event) => onChange([event.target.value])} />;
  }
  if (question.type === "short text") {
    return <input className={input} aria-label={question.label} required={question.required}
      maxLength={500} value={value[0] ?? ""} onChange={(event) => onChange([event.target.value])} />;
  }
  if (question.type === "dropdown") {
    return <select className={input} aria-label={question.label} required={question.required}
      value={value[0] ?? ""} onChange={(event) => onChange(event.target.value ? [event.target.value] : [])}>
      <option value="">Choose an answer</option>
      {question.options.map((option) => <option key={option}>{option}</option>)}
    </select>;
  }
  return <fieldset className="grid gap-2">
    <legend className="sr-only">{question.label}</legend>
    {question.options.map((option) => <label key={option} className="flex items-center gap-3 rounded-xl bg-dusk-50 p-3">
      <input type={question.type === "checkboxes" ? "checkbox" : "radio"} name={question.id}
        checked={value.includes(option)} className="accent-dusk-700" onChange={(event) => {
          onChange(question.type === "checkboxes"
            ? (event.target.checked ? [...value, option] : value.filter((answer) => answer !== option))
            : [option]);
        }} />
      {option}
    </label>)}
    {!question.required && value.length > 0 && <button type="button" className="justify-self-start text-sm underline" onClick={() => onChange([])}>Clear answer</button>}
  </fieldset>;
}
