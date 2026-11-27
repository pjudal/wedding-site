"use client";

import { useEffect, useState } from "react";
import { isChoiceField, isDisplayField, questionPages, questionTypes, validateQuestions, type Answers, type Question } from "@/lib/rsvp-questions";
import { RsvpQuestionField } from "./RsvpQuestionField";

const input = "rounded-lg border border-dusk-200 bg-white px-3 py-2";
const button = "rounded-lg bg-dusk-700 px-4 py-2 font-semibold text-white disabled:opacity-50";

export function RsvpQuestionEditor() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [status, setStatus] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const pages = preview ? questionPages(questions, answers) : [];

  function addField(startsPage: boolean) {
    setQuestions((current) => [...current, {
      id: crypto.randomUUID(), label: "", type: "short text", required: false, options: [], startsPage,
    }]);
  }

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/rsvp/questions", { signal: controller.signal }).then(async (response) => {
      const data: unknown = await response.json();
      if (!response.ok || !validateQuestions(data)) throw new Error();
      setQuestions(data);
      setLoaded(true);
    }).catch(() => {
      if (!controller.signal.aborted) setStatus("Couldn’t load the published questions. Reload to try again.");
    });
    return () => controller.abort();
  }, []);

  function update(id: string, patch: Partial<Question>) {
    setQuestions((current) => current.map((question) => question.id === id ? { ...question, ...patch } : question));
    setStatus("");
  }

  async function publish() {
    if (!validateQuestions(questions)) {
      setStatus("Check field labels, content, answer options, and reveal rules.");
      return;
    }
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/rsvp/questions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questions),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setStatus("Questions published.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Couldn’t publish questions.");
    } finally {
      setBusy(false);
    }
  }

  return <section className="space-y-5">
    <h1 className="font-serif text-4xl">RSVP questions</h1>
    <p className="text-dusk-700">Group questions, instructions, images, and QR codes into pages that appear once per invitation when someone accepts. Guests answer the built-in attendance question first. Add any follow-up questions here.</p>
    {loaded && <fieldset disabled={busy} className="space-y-5">
      <button type="button" className="text-sm font-semibold underline" onClick={() => {
        setPreview(!preview);
        setAnswers({});
        setPageIndex(0);
      }}>{preview ? "Back to editor" : "Preview questions"}</button>
      {preview ? (
        <div className="space-y-4">
          {(pages[pageIndex] ?? []).map((question) => <div key={question.id} className="space-y-2 rounded-xl bg-white p-4">
            <p className="font-semibold">{question.label}{question.required && " *"}</p>
            <RsvpQuestionField question={question} value={answers[question.id] ?? []}
              onChange={(value) => setAnswers((current) => ({ ...current, [question.id]: value }))} />
          </div>)}
          {pages.length === 0 && <p>Add a field to preview a page.</p>}
          {pages.length > 0 && <div className="flex flex-wrap items-center justify-between gap-2">
            <button type="button" className={button} disabled={pageIndex === 0} onClick={() => setPageIndex(pageIndex - 1)}>Back</button>
            <span>Page {pageIndex + 1} of {pages.length}</span>
            <button type="button" className={button} disabled={pageIndex >= pages.length - 1} onClick={() => setPageIndex(pageIndex + 1)}>Next page</button>
          </div>}
        </div>
      ) : <>
        {questions.map((question, index) => {
          const earlier = questions.slice(0, index).filter((candidate) => candidate.options.length);
          const trigger = earlier.find((candidate) => candidate.id === question.condition?.questionId);
          const choice = isChoiceField(question.type);
          const display = isDisplayField(question.type);
          return <fieldset key={question.id} className="grid gap-3 rounded-2xl border border-dusk-200 bg-white p-4">
            <legend className="px-2 font-semibold">Field {index + 1}</legend>
            {index > 0 && <label className="flex items-center gap-2">
              <input type="checkbox" checked={question.startsPage !== false} onChange={(event) => update(question.id, { startsPage: event.target.checked })} />
              Start on a new page
            </label>}
            <label className="grid gap-1">{display ? "Heading or image description" : "Question text"}
              <input className={input} maxLength={160} value={question.label} onChange={(event) => update(question.id, { label: event.target.value })} />
            </label>
            <label className="grid gap-1">Field type
              <select className={input} value={question.type} onChange={(event) => {
                const type = event.target.value as Question["type"];
                update(question.id, { type, options: isChoiceField(type) ? question.options : [], required: !isDisplayField(type) && question.required });
              }}>
                {questionTypes.map((type) => <option key={type}>{type}</option>)}
              </select>
            </label>
            {choice && <label className="grid gap-1">Answer options, one per line
              <textarea className={input} rows={3} value={question.options.join("\n")} placeholder={"Yes\nNo"}
                onChange={(event) => update(question.id, { options: event.target.value.split("\n") })} />
            </label>}
            {display ? <label className="grid gap-1">
              {question.type === "instructions" ? "Instruction text" : question.type === "image" ? "Direct HTTPS image link" : "Link or text to encode"}
              <textarea className={input} rows={3} maxLength={2000} value={question.content ?? ""}
                onChange={(event) => update(question.id, { content: event.target.value })} />
            </label> : <label className="flex items-center gap-2"><input type="checkbox" checked={question.required}
              onChange={(event) => update(question.id, { required: event.target.checked })} /> Required</label>}
            {(earlier.length > 0 || question.condition) && <label className="grid gap-1">Show when a guest answers
              <select className={input} value={question.condition?.questionId ?? ""} onChange={(event) => {
                const selected = earlier.find((candidate) => candidate.id === event.target.value);
                update(question.id, { condition: selected ? { questionId: selected.id, option: selected.options[0] } : undefined });
              }}>
                <option value="">Always show to attending invitations</option>
                {question.condition && !trigger && <option value={question.condition.questionId}>Select a new trigger question</option>}
                {earlier.map((candidate) => <option value={candidate.id} key={candidate.id}>{candidate.label || "Untitled question"}</option>)}
              </select>
            </label>}
            {trigger && question.condition && <label className="grid gap-1">With this answer
              <select className={input} value={question.condition.option} onChange={(event) => update(question.id, {
                condition: { questionId: trigger.id, option: event.target.value },
              })}>
                {!trigger.options.includes(question.condition.option) && <option value={question.condition.option}>Choose a valid answer</option>}
                {trigger.options.filter(Boolean).map((option, i) => <option key={i}>{option}</option>)}
              </select>
            </label>}
            <button type="button" className="justify-self-start text-sm text-red-800 underline" onClick={() =>
              setQuestions((current) => current.filter((candidate) => candidate.id !== question.id)
                .map((candidate) => candidate.condition?.questionId === question.id ? { ...candidate, condition: undefined } : candidate))
            }>Remove question</button>
          </fieldset>;
        })}
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={questions.length >= 20} className={button} onClick={() => addField(false)}>Add field</button>
          <button type="button" disabled={!questions.length || questions.length >= 20} className={button} onClick={() => addField(true)}>Add next page</button>
        </div>
        <button type="button" disabled={busy} className={button} onClick={() => void publish()}>Publish questions</button>
      </>}
    </fieldset>}
    <p role="status">{status}</p>
  </section>;
}
