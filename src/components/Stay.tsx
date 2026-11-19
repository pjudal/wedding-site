import Link from "next/link";
import { site } from "@/content";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Stay() {
  return (
    <section id="stay" className="bg-dusk-700 px-4 py-20 text-cream md:py-28">
      <div className="mx-auto max-w-5xl">
        <SectionHeading eyebrow="Accommodation" title="Stay With Us" light />

        <div className="grid gap-5 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl bg-cream p-7 text-dusk-900 md:p-9">
              <span className="inline-block rounded-full bg-butter-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-dusk-900">
                On us
              </span>
              <h3 className="mt-5 font-serif text-3xl">The wedding day</h3>
              <p className="mt-3 leading-relaxed text-dusk-700">
                We’ll cover your room at {site.venueName} on {site.weddingDateLabel.replace(/, \d{4}$/, "")}.
                We’ll give you your room assignment when you arrive.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="h-full rounded-3xl bg-dusk-900/40 p-7 ring-1 ring-cream/20 md:p-9">
              <span className="inline-block rounded-full bg-cream/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-butter-200">
                Optional
              </span>
              <h3 className="mt-5 font-serif text-3xl">Arrive the day before</h3>
              <p className="mt-3 leading-relaxed text-dusk-100">
                Want to make a weekend of it? Stay the night of {site.nightBeforeLabel} for{" "}
                <strong className="font-semibold text-butter-200">{site.nightBeforePrice}</strong>. Please{" "}
                <Link href="/rsvp" className="font-semibold text-cream underline underline-offset-4">confirm in your RSVP</Link>
                {" "}by <strong className="font-semibold text-butter-200">{site.nightBeforeDeadlineLabel}</strong>.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
