"use client";

import { useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { rsvpMessageLabel, site } from "@/content";
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
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [returning, setReturning] = useState(false);

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
        setMessage(data.party.find((m: Member) => m.message)?.message ?? "");
        setReturning(data.party.some((m: Member) => m.attending));
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
        }),
      });
      const data = await res.json();
      if (data.ok) setStep("done");
      else if (data.error === "closed") setClosed(true);
      else setError("We couldn't save your RSVP. Please try again, or message us directly.");
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setStep("search");
    setName("");
    setParty([]);
    setMessage("");
    setError("");
  }

  const anyoneComing = party.some((m) => m.attending === "yes");

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
            ) : step === "form" ? (
              <motion.form key="form" {...fade} onSubmit={submit} className="space-y-8">
                <div>
                  <p className="font-serif text-3xl">
                    Hi, {party.map((m) => m.name.split(" ")[0]).join(" & ")}!
                  </p>
                  <p className="mt-2 text-sm text-dusk-700">
                    {returning
                      ? "We already have your RSVP. Feel free to make changes below."
                      : "Will you be celebrating with us?"}
                  </p>
                </div>

                {party.map((m) => (
                  <fieldset key={m.id} className="space-y-4 rounded-3xl bg-dusk-50 p-5 ring-1 ring-dusk-100">
                    <legend className="sr-only">{m.name}</legend>
                    <p className="font-semibold">{m.name}</p>
                    <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={`Is ${m.name} attending?`}>
                      {(
                        [
                          ["yes", "Joyfully accepts"],
                          ["no", "Regretfully declines"],
                        ] as const
                      ).map(([v, label]) => (
                        <button
                          key={v}
                          type="button"
                          role="radio"
                          aria-checked={m.attending === v}
                          onClick={() => update(m.id, { attending: v })}
                          className={`rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                            m.attending === v
                              ? v === "yes"
                                ? "bg-butter-400 text-dusk-950 shadow-sm"
                                : "bg-dusk-700 text-cream"
                              : "bg-white text-dusk-700 ring-1 ring-dusk-100 hover:ring-dusk-300"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    <AnimatePresence initial={false}>
                      {m.attending === "yes" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="space-y-4 overflow-hidden"
                        >
                          <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-dusk-100">
                            <input
                              type="checkbox"
                              checked={m.nightBefore === "yes"}
                              onChange={(e) => update(m.id, { nightBefore: e.target.checked ? "yes" : "no" })}
                              className="mt-1 h-5 w-5 accent-dusk-700"
                            />
                            <span className="text-sm">
                              <span className="font-semibold">I&rsquo;ll also stay the night before</span>
                              <span className="block text-dusk-700">
                                {site.nightBeforeLabel} · {site.nightBeforePrice} · Confirm by {site.nightBeforeDeadlineLabel}
                              </span>
                            </span>
                          </label>
                          <div>
                            <label htmlFor={`diet-${m.id}`} className="mb-1.5 block text-sm font-semibold">
                              Allergies or dietary needs <span className="font-normal text-dusk-500">(optional)</span>
                            </label>
                            <input
                              id={`diet-${m.id}`}
                              className={inputCls}
                              value={m.dietary}
                              maxLength={500}
                              onChange={(e) => update(m.id, { dietary: e.target.value })}
                              placeholder="e.g. no shellfish, vegetarian"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </fieldset>
                ))}

                <div>
                  <label htmlFor="rsvp-message" className="mb-1.5 block text-sm font-semibold">
                    {rsvpMessageLabel} <span className="font-normal text-dusk-500">(optional)</span>
                  </label>
                  <textarea
                    id="rsvp-message"
                    rows={3}
                    maxLength={500}
                    className={inputCls}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hashtag ideas, song requests, or well wishes"
                  />
                </div>

                {error && <p className="text-sm font-medium text-red-700">{error}</p>}

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                  <button type="button" onClick={reset} className="text-sm font-semibold text-dusk-500 hover:text-dusk-900">
                    Not you? Search again
                  </button>
                  <button
                    type="submit"
                    disabled={busy}
                    className="rounded-2xl bg-dusk-700 px-8 py-3 font-semibold text-cream transition hover:bg-dusk-900 disabled:opacity-50"
                  >
                    {busy ? "Sending..." : returning ? "Update RSVP" : "Send RSVP"}
                  </button>
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
