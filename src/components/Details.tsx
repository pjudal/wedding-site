import Image from "next/image";
import { detailHeadings, outfitIdeas, site, weddingTimeline } from "@/content";
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
              <p className="mt-2 text-dusk-700">{site.ceremonyTimeLabel} · Unplugged ceremony</p>
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
            <ol className="grid gap-6 md:grid-cols-[1fr_1.6fr_1fr]">
              {weddingTimeline.map(({ date, note, events }) => (
                <li key={date} className="rounded-2xl bg-dusk-50 p-5">
                  <h4 className="font-serif text-2xl text-dusk-900">{date}</h4>
                  {note && <p className="mt-3 text-sm leading-relaxed text-dusk-700">{note}</p>}
                  {events.length > 0 && (
                    <ol className="mt-3 divide-y divide-dusk-100">
                      {events.map(({ label, time }) => (
                        <li key={label} className="grid grid-cols-[5.5rem_1fr] items-baseline gap-2 py-2">
                          <span className="text-sm font-semibold text-dusk-700">{time}</span>
                          <span className="font-serif text-xl leading-tight">{label}</span>
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
          <div className="rounded-3xl bg-dusk-50 p-7 ring-1 ring-dusk-100 md:p-8">
            <h3 id="dress-code" className="scroll-mt-20 text-xs font-semibold uppercase tracking-[0.2em] text-dusk-500">
              {detailHeadings.dressCode}
            </h3>
            <p className="mt-3 font-serif text-2xl">{site.dressCode}</p>
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-4" aria-label="Guest color palette">
              {site.guestPalette.map(({ name, hex }) => (
                <li key={name} className="flex min-w-16 flex-col items-center gap-2 text-xs text-dusk-700">
                  <span
                    aria-hidden="true"
                    className="block size-12 rounded-full shadow-inner ring-1 ring-dusk-900/10"
                    style={{ background: hex }}
                  />
                  {name}
                </li>
              ))}
            </ul>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {outfitIdeas.map(({ title, image, alt, looks }) => (
                <div key={title} className="rounded-2xl bg-white/70 p-5">
                  <h4 className="font-serif text-2xl">{title}</h4>
                  <Image
                    src={image}
                    alt={alt}
                    sizes="(min-width: 1152px) 500px, (min-width: 640px) 45vw, 90vw"
                    className="mt-3 h-auto w-full rounded-xl"
                  />
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-dusk-700">
                    {looks.map((look) => <li key={look}>{look}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
