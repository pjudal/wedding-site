import { site } from "@/content";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="h-full rounded-3xl bg-white/70 p-7 shadow-[0_10px_40px_-20px_rgba(38,56,74,0.35)] ring-1 ring-dusk-100 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-dusk-500">{label}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function Details() {
  return (
    <section id="details" className="px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Join us" title="The Day" />

        <div className="grid gap-5 md:grid-cols-3">
          <Reveal>
            <Card label="When">
              <p className="font-serif text-3xl leading-tight">{site.weddingDateLabel}</p>
              <a
                href="/calendar.ics"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-dusk-700 underline decoration-butter-400 decoration-2 underline-offset-4 hover:text-dusk-950"
              >
                Add to calendar
              </a>
            </Card>
          </Reveal>

          <Reveal delay={0.1}>
            <Card label="Where">
              <p className="font-serif text-3xl leading-tight">
                {site.venueName}
                <br />
                <span className="text-dusk-500">{site.venueArea}</span>
              </p>
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

          <Reveal delay={0.2}>
            <Card label="Schedule">
              <ol className="relative space-y-4 border-l border-dusk-100 pl-5">
                {site.schedule.map((s) => (
                  <li key={s.label} className="relative">
                    <span className="absolute -left-[25px] top-2 h-2.5 w-2.5 rounded-full bg-butter-400 ring-4 ring-white" />
                    <p className="font-serif text-xl">{s.label}</p>
                    <p className="text-sm text-dusk-500">{s.time}</p>
                  </li>
                ))}
              </ol>
            </Card>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-5">
          <div className="flex flex-col items-center gap-6 rounded-3xl bg-dusk-50 p-7 text-center ring-1 ring-dusk-100 md:flex-row md:justify-between md:p-8 md:text-left">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-dusk-500">Dress code</p>
              <p className="mt-2 font-serif text-2xl">{site.dressCode ?? "Details coming soon"}</p>
              <p className="mt-1 text-sm text-dusk-700">Our colors are dusty blue and pastel yellow.</p>
            </div>
            <ul className="flex gap-3">
              {site.palette.map((c) => (
                <li key={c.hex} className="flex flex-col items-center gap-2">
                  <span
                    className="block h-12 w-12 rounded-full shadow-inner ring-1 ring-dusk-900/10"
                    style={{ background: c.hex }}
                    title={c.name}
                  />
                  <span className="sr-only">{c.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
