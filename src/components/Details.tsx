import Image from "next/image";
import Link from "next/link";
import bulodEntrance from "@/assets/bulod-entrance.webp";
import bulodPool from "@/assets/bulod-pool.webp";
import { detailHeadings, homepageAttireNote, saveTheDate, site, weddingTimeline, weddingTimelineIntro } from "@/content";
import entourageAttire from "@/assets/attire-entourage.webp";
import guestAttire from "@/assets/attire-guests.webp";
import dayOnePhoto from "@/assets/timeline-day-1.webp";
import dayTwoPhoto from "@/assets/timeline-day-2.webp";
import dayThreePhoto from "@/assets/timeline-day-3.webp";
import { GuestPalette } from "./GuestPalette";
import { Reveal } from "./Reveal";

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="h-full rounded-3xl bg-cream p-7 shadow-[0_10px_40px_-20px_rgba(38,56,74,0.35)] ring-1 ring-dusk-100 md:p-8">
      <h2 className="font-serif text-2xl font-semibold leading-tight text-dusk-500 sm:text-3xl">
        <span className="box-decoration-clone bg-linear-to-t from-butter-200 from-30% to-transparent to-30% px-1">
          {label}
        </span>
      </h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function Details() {
  return (
    <section id="details" className="bg-dusk-500 px-4 pb-20 pt-12 md:pb-28 md:pt-16">
      <div className="mx-auto max-w-6xl">

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
              <figure className="mt-5">
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <Image
                    src={bulodEntrance}
                    alt="Sunlight on the Bulod entrance sign beside the pool"
                    sizes="(min-width: 1152px) 245px, (min-width: 768px) 24vw, 44vw"
                    className="aspect-[4/3] w-full rounded-xl object-cover"
                  />
                  <Image
                    src={bulodPool}
                    alt="Bulod’s pool and guest rooms overlooking the sea"
                    sizes="(min-width: 1152px) 245px, (min-width: 768px) 24vw, 44vw"
                    className="aspect-[4/3] w-full rounded-xl object-cover"
                  />
                </div>
                <figcaption className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-dusk-700">
                  <a href="https://bulod.ph/" className="underline underline-offset-4">Photos by Bulod</a>
                  <a href="https://www.instagram.com/p/DbhkkkVE8vC/" className="underline underline-offset-4">See Bulod on Instagram</a>
                </figcaption>
              </figure>
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
              {weddingTimeline.map(({ date, title, note, events }, index) => (
                <li key={date} className="relative">
                  <span aria-hidden="true" className="absolute -left-[31px] top-1.5 size-3 rounded-full bg-butter-400 ring-4 ring-cream sm:-left-[39px]" />
                  <p className="text-xs font-semibold uppercase tracking-widest text-dusk-600">{date}</p>
                  <h3 className="mt-1 font-serif text-2xl font-semibold leading-tight text-dusk-500 sm:text-3xl">{title}</h3>
                  {note && <p className="mt-2 leading-relaxed text-dusk-700">{note}</p>}
                  {index === 0 && (
                    <figure className="mt-4 max-w-80">
                      <Image
                        src={dayOnePhoto}
                        alt="Sunset over the sea reflected in Bulod’s pool"
                        sizes="(max-width: 420px) 75vw, 320px"
                        className="aspect-square w-full rounded-2xl object-cover object-[center_75%]"
                      />
                      <figcaption className="mt-2 text-xs text-dusk-700">
                        <a href="https://www.instagram.com/p/DV8QwB7k8Ha/" className="underline underline-offset-4">Photo by Bulod</a>
                      </figcaption>
                    </figure>
                  )}
                  {index > 0 && (
                    <Image
                      src={index === 1 ? dayTwoPhoto : dayThreePhoto}
                      alt={index === 1 ? "PJ and Jedah embrace beside a lake framed by snowy mountains" : "PJ photographs Jedah as snow falls around them"}
                      sizes="(max-width: 640px) 80vw, 560px"
                      className="mt-4 h-auto w-full max-w-[560px] rounded-2xl"
                    />
                  )}
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
            <p className="max-w-xl text-sm leading-relaxed text-dusk-700">{homepageAttireNote}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <figure className="rounded-2xl bg-cream p-4 text-center">
                <figcaption className="font-serif text-3xl italic text-dusk-900">Entourage</figcaption>
                <Image
                  src={entourageAttire}
                  alt="Watercolor outfits in dusty blue and pastel yellow, with airy dresses, closed-toe flats, and a linen vest with chinos"
                  className="mx-auto mb-3 mt-2 h-52 w-full object-contain sm:h-64"
                  sizes="(min-width: 640px) 40vw, 80vw"
                />
                <GuestPalette entourage />
              </figure>
              <figure className="rounded-2xl bg-cream p-4 text-center">
                <figcaption className="font-serif text-3xl italic text-dusk-900">Guests</figcaption>
                <Image
                  src={guestAttire}
                  alt="Watercolor outfits in blush, sage, lilac and peach, with airy dresses and lightweight button-downs with chinos"
                  className="mx-auto mb-3 mt-2 h-52 w-full object-contain sm:h-64"
                  sizes="(min-width: 640px) 40vw, 80vw"
                />
                <GuestPalette />
              </figure>
            </div>
            <Link href="/dress-code" className="mt-4 inline-block text-sm font-semibold text-dusk-700 underline underline-offset-4 hover:text-dusk-950">
              See the dress code and outfit ideas
            </Link>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
