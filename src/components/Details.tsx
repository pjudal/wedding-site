import Link from "next/link";
import { detailHeadings, saveTheDate, site, weddingTimeline, weddingTimelineIntro } from "@/content";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="h-full rounded-3xl bg-white/70 p-7 shadow-[0_10px_40px_-20px_rgba(38,56,74,0.35)] ring-1 ring-dusk-100 md:p-8">
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-dusk-500">{label}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function Details() {
  return (
    <section id="details" className="px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Join us" title="The Day" />

        <div className="grid gap-5 md:grid-cols-2">
          <Reveal>
            <Card label={detailHeadings.date}>
              <p className="font-serif text-3xl leading-tight">{site.weddingDateLabel}</p>
              <p className="mt-2 text-dusk-700">{saveTheDate}</p>
              <a
                href="/calendar.ics"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-dusk-700 underline decoration-butter-400 decoration-2 underline-offset-4 hover:text-dusk-950"
              >
                Add to calendar
              </a>
            </Card>
          </Reveal>

          <Reveal delay={0.1}>
            <Card label={detailHeadings.venue}>
              <p className="font-serif text-3xl leading-tight">
                {site.venueName}, {site.venueLocality}
              </p>
              <p className="mt-3 text-dusk-700">{site.venueSummary}</p>
              <iframe
                src={site.mapsEmbedUrl}
                title={`Google Maps location of ${site.venueName}, ${site.venueLocality}`}
                loading="lazy"
                allowFullScreen
                className="mt-5 h-56 w-full rounded-2xl border border-dusk-100"
              />
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-dusk-700 underline decoration-butter-400 decoration-2 underline-offset-4 hover:text-dusk-950"
              >
                Open in Google Maps
              </a>
            </Card>
          </Reveal>

        </div>

        <Reveal delay={0.1} className="mt-5">
          <Card label={detailHeadings.timeline}>
            <p className="max-w-2xl font-serif text-2xl leading-snug text-dusk-900 md:text-3xl">
              {weddingTimelineIntro}
            </p>
            <ol className="ml-2 mt-8 space-y-8 border-l border-dusk-200 pl-6 sm:ml-3 sm:pl-8">
              {weddingTimeline.map(({ date, title, note, events }) => (
                <li key={date} className="relative">
                  <span aria-hidden="true" className="absolute -left-[31px] top-1.5 size-3 rounded-full bg-butter-400 ring-4 ring-cream sm:-left-[39px]" />
                  <p className="text-xs font-semibold uppercase tracking-widest text-dusk-600">{date}</p>
                  <h4 className="mt-1 font-serif text-3xl text-dusk-900">{title}</h4>
                  {note && <p className="mt-2 leading-relaxed text-dusk-700">{note}</p>}
                  {events.length > 0 && (
                    <ol className="mt-4 flex flex-wrap gap-2.5">
                      {events.map(({ label, time }) => (
                        <li key={label} className="rounded-xl bg-dusk-50 px-4 py-3">
                          <span className="block text-xs font-semibold text-dusk-600">{time}</span>
                          <span className="font-serif text-xl text-dusk-900">{label}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </li>
              ))}
            </ol>
          </Card>
        </Reveal>

        <Reveal delay={0.1} className="mt-5">
          <Card label={detailHeadings.dressCode}>
            <Link href="/dress-code" className="text-sm font-semibold text-dusk-700 underline underline-offset-4 hover:text-dusk-950">
              See the dress code and outfit ideas
            </Link>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
