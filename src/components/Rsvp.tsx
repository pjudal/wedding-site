"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { site } from "@/content";
import { cleanAnswers, isDisplayField, questionPages, type Answers, type Question } from "@/lib/rsvp-questions";
import { RsvpQuestionField } from "./RsvpQuestionField";
import { RsvpEnvelope } from "./RsvpEnvelope";

type YesNo = "" | "yes" | "no";
type Member = { id: string; name: string; attending: YesNo; nightBefore: YesNo; dietary: string; message: string };
type Step = "search" | "form" | "done";

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
};

const inputCls =
  "w-full rounded-2xl border border-dusk-100 bg-white px-4 py-3 text-base text-dusk-950 outline-none transition placeholder:text-dusk-300 focus:border-dusk-500 focus:ring-4 focus:ring-dusk-100";

const noSubscribe = () => () => {};
const pastDeadline = () => Date.now() > new Date(site.rsvpDeadline).getTime();

export function Rsvp() {
  // Checked in the browser on load; the server also refuses late submissions.
  const deadlinePassed = useSyncExternalStore(noSubscribe, pastDeadline, () => false);
  const [serverClosed, setClosed] = useState(false);
  const closed = deadlinePassed || serverClosed;
  const [step, setStep] = useState<Step>("search");
  const [name, setName] = useState("");
  const [party, setParty] = useState<Member[]>([]);
  const [message, setMessage] = useState("");
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [returning, setReturning] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const reducedMotion = useReducedMotion();
  const questionHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (step === "form" && !celebrating) questionHeading.current?.focus({ preventScroll: true });
  }, [step, questionIndex, celebrating]);

  useEffect(() => {
    if (!celebrating) return;
    const timer = window.setTimeout(() => {
      setQuestionIndex((index) => index + 1);
      setCelebrating(false);
    }, 1400);
    return () => window.clearTimeout(timer);
  }, [celebrating]);

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/rsvp/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.status === "found") {
        setParty(data.party);
        const questions: Question[] = data.questions ?? [];
        const saved = Array.isArray(data.savedAnswers)
          ? Object.fromEntries(data.savedAnswers.map((entry: { id: string; answers: string[] }) => [entry.id, entry.answers]))
          : {};
        setCustomQuestions(questions);
        setAnswers(cleanAnswers(questions, saved, false) ?? {});
        setMessage(data.party.find((m: Member) => m.message)?.message ?? "");
        setReturning(data.party.some((m: Member) => m.attending));
        if (!reducedMotion) {
          const gif = new window.Image();
          gif.src = "/images/rsvp-yeah.gif";
        }
        setStep("form");
      } else if (data.status === "ambiguous") {
        setError("We found more than one guest with that name. Please type your full name as it appears on your invitation.");
      } else if (data.status === "none") {
        setError("We couldn’t find that name. Try your full name or the nickname we know you by, or message us directly.");
      } else {
        setError("Something went wrong on our side. Please try again in a moment.");
      }
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  function update(id: string, patch: Partial<Member>) {
    setParty((p) => p.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (party.some((m) => !m.attending)) {
      setError("Please let us know for everyone listed.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/rsvp/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          responses: party.map(({ id, attending, nightBefore, dietary }) => ({ id, attending, nightBefore, dietary })),
          message,
          answers,
        }),
      });
      const data = await res.json();
      if (data.ok) setStep("done");
      else if (data.error === "closed") setClosed(true);
      else if (data.error === "questions") setError("Please check your answers. If the form changed, search for your invitation again.");
      else setError("We couldn't save your RSVP. Please try again, or message us directly.");
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setStep("search");
    setQuestionIndex(0);
    setName("");
    setParty([]);
    setCustomQuestions([]);
    setAnswers({});
    setMessage("");
    setError("");
  }

  const anyoneComing = party.some((m) => m.attending === "yes");
  const customPages = questionPages(customQuestions, answers);
  const hasDecline = party.some((guest) => guest.attending === "no");
  const questions = [
    ...party.map((guest) => ({ kind: "attendance" as const, guest })),
    ...(hasDecline ? [{ kind: "decline" as const }] : []),
    ...(anyoneComing ? customPages.map((fields) => ({ kind: "custom" as const, fields })) : []),
    ...(anyoneComing && !hasDecline && !customPages.length ? [{ kind: "submit" as const }] : []),
  ];
  const question = questions[questionIndex];
  const lastQuestion = questionIndex === questions.length - 1;
  const nextQuestion = () => {
    setError("");
    setQuestionIndex((index) => index + 1);
  };

  return (
    <section id="rsvp" className="min-h-[75svh] bg-butter-50 bg-cover bg-center px-4 pt-5 pb-12 sm:pt-7"
      style={{ backgroundImage: "linear-gradient(rgba(250, 246, 226, 0.84), rgba(250, 246, 226, 0.3)), url(/images/rsvp-background.webp)" }}>
      <div className="mx-auto max-w-2xl">
        <header className="mb-5 text-center sm:mb-7">
          <div className="illustrated-link mx-auto mb-1 w-20 text-dusk-950 sm:w-24">
            <RsvpEnvelope />
          </div>
          <h1 className="font-serif text-7xl font-medium leading-none text-dusk-950 [text-shadow:0_0_12px_#fde68a,0_0_28px_#facc15] sm:text-8xl md:text-9xl">
            RSVP
          </h1>
          <p className="mt-2 inline-block rounded-lg bg-butter-200 px-4 py-1.5 text-base font-semibold text-dusk-950 sm:text-lg">
            Kindly reply by {site.rsvpDeadlineLabel}
          </p>
        </header>

        <div className="relative rounded-[2rem] bg-white p-5 shadow-[0_20px_60px_-30px_rgba(38,56,74,0.45)] ring-1 ring-butter-200 sm:p-7">
          <AnimatePresence mode="wait">
            {closed ? (
              <motion.div key="closed" {...fade} className="text-center">
                <p className="font-serif text-3xl">RSVPs are closed</p>
                <p className="mt-3 text-dusk-700">Need to change something? Message us directly and we&rsquo;ll sort it out.</p>
              </motion.div>
            ) : step === "search" ? (
              <motion.form key="search" {...fade} onSubmit={lookup}>
                <label htmlFor="rsvp-name" className="block font-serif text-2xl md:text-3xl">
                  Find your invitation
                </label>
                <p className="mt-2 text-sm text-dusk-700">Enter your full name or nickname to find your invitation.</p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <input
                    id="rsvp-name"
                    className={inputCls}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name or nickname"
                    autoComplete="name"
                    required
                  />
                  <button
                    type="submit"
                    disabled={busy || !name.trim()}
                    className="shrink-0 rounded-2xl bg-dusk-700 px-7 py-3 font-semibold text-cream transition hover:bg-dusk-900 disabled:opacity-50"
                  >
                    {busy ? "Searching..." : "Continue"}
                  </button>
                </div>
              </motion.form>
            ) : step === "form" && celebrating ? (
              <div key="celebration" role="status" className="py-3 text-center">
                <p className="font-serif text-3xl">Yay, you’re coming!</p>
                <Image src="/images/rsvp-yeah.gif" alt="" width={240} height={223} unoptimized loading="eager"
                  className="mx-auto mt-3 w-44 rounded-xl motion-reduce:hidden" />
              </div>
            ) : step === "form" && question ? (
              <motion.form key="form" {...fade} onSubmit={(event) => {
                event.preventDefault();
                if (question.kind === "attendance" || busy) return;
                if (question.kind === "custom" && question.fields.some((field) => field.required &&
                  !answers[field.id]?.some((value) => value.trim()))) {
                  setError("Please answer this question to continue.");
                  return;
                }
                if (lastQuestion) void submit(event);
                else nextQuestion();
              }} className="space-y-5">
                <p className="text-sm text-dusk-700">
                  {returning && "Updating your RSVP · "}
                  {question.kind === "attendance"
                    ? `Guest ${questionIndex + 1} of ${party.length}`
                    : `Step ${questionIndex + 1} of ${questions.length}`}
                </p>

                {question.kind === "attendance" && (
                  <>
                    <h2 ref={questionHeading} tabIndex={-1} className="font-serif text-3xl">
                      Will {question.guest.name} be celebrating with us?
                    </h2>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {([["yes", "Joyfully accepts"], ["no", "Regretfully declines"]] as const).map(([value, label]) => (
                        <button key={value} type="button" aria-pressed={question.guest.attending === value}
                          className="rounded-2xl bg-dusk-50 px-4 py-3 text-sm font-semibold text-dusk-950 ring-1 ring-dusk-200 hover:bg-butter-100 aria-pressed:bg-butter-200"
                          onClick={() => {
                            update(question.guest.id, { attending: value });
                            if (value === "yes" && !reducedMotion) setCelebrating(true);
                            else nextQuestion();
                          }}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {question.kind === "decline" && (
                  <div className="text-center">
                    <h2 ref={questionHeading} tabIndex={-1} className="font-serif text-3xl">That’s okay!</h2>
                    <p className="mt-2 text-dusk-700">We’ll miss you, and we’ll find another time to celebrate together.</p>
                    <Image src="/images/rsvp-crybaby.gif" alt="" width={319} height={224} unoptimized className="mx-auto mt-4 w-44 rounded-xl motion-reduce:hidden" />
                  </div>
                )}

                {question.kind === "custom" && question.fields.map((field, index) => (
                  <div className="space-y-2" key={field.id}>
                    <h2 ref={index === 0 ? questionHeading : undefined} tabIndex={index === 0 ? -1 : undefined} className="font-serif text-2xl">
                      {field.label}
                      {!field.required && !isDisplayField(field.type) && <span className="ml-2 font-sans text-sm text-dusk-600">(optional)</span>}
                    </h2>
                    <RsvpQuestionField question={field} value={answers[field.id] ?? []}
                      onChange={(value) => setAnswers((current) => ({ ...current, [field.id]: value }))} />
                  </div>
                ))}

                {question.kind === "submit" && (
                  <h2 ref={questionHeading} tabIndex={-1} className="font-serif text-3xl">Ready to send your RSVP?</h2>
                )}

                {error && <p role="alert" className="text-sm font-medium text-red-700">{error}</p>}

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button type="button" disabled={busy} onClick={() => {
                    if (questionIndex === 0) reset();
                    else {
                      setError("");
                      setQuestionIndex((index) => index - 1);
                    }
                  }} className="min-h-11 text-sm font-semibold text-dusk-700 hover:text-dusk-900">
                    {questionIndex === 0 ? "Not you? Search again" : "Back"}
                  </button>
                  {question.kind !== "attendance" && (
                    <button type="submit" disabled={busy}
                      className="rounded-2xl bg-dusk-700 px-6 py-3 font-semibold text-cream hover:bg-dusk-900 disabled:opacity-50">
                      {busy ? "Sending…" : lastQuestion ? (returning ? "Update RSVP" : "Send RSVP") : "Continue"}
                    </button>
                  )}
                </div>
              </motion.form>
            ) : (
              <motion.div key="done" {...fade} className="py-4 text-center">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
                  className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-butter-200 text-3xl"
                  aria-hidden
                >
                  {anyoneComing ? "♥" : "✉"}
                </motion.div>
                <p className="mt-5 font-serif text-3xl">
                  {anyoneComing ? "We can't wait to celebrate with you!" : "We'll miss you!"}
                </p>
                <p className="mt-3 text-dusk-700">
                  Your RSVP is saved. Need to change something? Look up your name again any time before{" "}
                  {site.rsvpDeadlineLabel}.
                </p>
                <button onClick={reset} className="mt-6 text-sm font-semibold text-dusk-500 hover:text-dusk-900">
                  RSVP for someone else
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          {!closed && step === "search" && busy && (
            <div className="mt-3 flex justify-center lg:pointer-events-none lg:absolute lg:top-1/2 lg:left-full lg:mt-0 lg:ml-5 lg:-translate-y-1/2 xl:ml-12">
              {/* Serve the small GIF directly to preserve its animation. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/rsvp-on-my-way.gif" alt="" width={120} height={120} className="rounded-xl shadow-sm motion-reduce:hidden lg:w-32 xl:w-48" />
            </div>
          )}
          {step === "search" && error && !closed && <p className="mt-4 text-sm font-medium text-red-700">{error}</p>}
        </div>
      </div>
    </section>
  );
}
