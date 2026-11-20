import Image from "next/image";
import Link from "next/link";
import { Caveat } from "next/font/google";
import bulodEntrance from "@/assets/bulod-entrance.webp";
import bulodBackdrop from "@/assets/bulod-venue-backdrop.webp";
import bulodPool from "@/assets/bulod-pool.webp";
import engagementProposal from "@/assets/engagement-proposal.webp";
import engagementRing from "@/assets/engagement-ring.webp";
import { detailHeadings, homepageAttireNote, saveTheDate, site, weddingTimeline, weddingTimelineIntro } from "@/content";
import entourageAttire from "@/assets/attire-entourage.webp";
import guestAttire from "@/assets/attire-guests.webp";
import dayOnePhoto from "@/assets/timeline-day-1.webp";
import dayTwoPhoto from "@/assets/timeline-day-2.webp";
import dayThreePhoto from "@/assets/timeline-day-3.webp";
import { GuestPalette } from "./GuestPalette";
import { Reveal } from "./Reveal";
import { ProposalDivider } from "./ProposalDivider";

const handwriting = Caveat({ subsets: ["latin"], weight: "600" });

function DetailHeading({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <h2 className={`font-sans text-xl font-medium leading-tight sm:text-2xl ${light ? "text-cream" : "text-dusk-700"}`}>
      <span className={`box-decoration-clone bg-linear-to-t from-30% to-transparent to-30% px-1 ${light ? "from-butter-200/25" : "from-butter-200"}`}>
        {children}
      </span>
    </h2>
  );
}

export function Details() {
  return (
    <div id="details" className="scroll-mt-18">
      <section className="bg-dusk-500 px-5 py-14 sm:px-10 lg:px-[6vw] lg:py-20">
        <Reveal className="mx-auto grid max-w-[96rem] items-center gap-8 px-3 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,0.85fr)_minmax(0,1fr)] lg:gap-10">
          <div className="text-center text-black lg:col-start-2 lg:row-start-1">
            <h2 className="font-sans text-xl font-medium leading-tight sm:text-2xl">{detailHeadings.date}</h2>
            <p className={`${handwriting.className} mt-3 text-2xl leading-tight sm:text-3xl`}>
              The two donuts back in 2015 paid off!
            </p>
            <p className="mt-4 font-serif text-3xl leading-tight">{site.weddingDateLabel}</p>
            <a
              href="/calendar.ics"
              className="mt-5 inline-block text-sm font-semibold underline decoration-butter-200 decoration-2 underline-offset-4"
            >
              Add to calendar
            </a>
            <p className="mt-5 font-serif text-2xl italic">{saveTheDate}</p>
          </div>
          <figure className="scrapbook-print relative mx-auto w-full max-w-lg -rotate-3 lg:col-start-1 lg:row-start-1">
            <span aria-hidden="true" className="scrapbook-tape -rotate-8 bg-butter-200/90">🍩 🍩</span>
            <div className="relative aspect-[4/3]">
              <Image
                src={engagementProposal}
                alt="PJ down on one knee proposing to Jedah beneath a leafy arch"
                fill
                sizes="(min-width: 1024px) 32vw, (min-width: 640px) 512px, 86vw"
                className="object-cover object-[center_79%]"
              />
            </div>
            <figcaption className={`${handwriting.className} absolute bottom-[calc(clamp(1.15rem,3vw,2.5rem)+0.65rem)] right-5 -rotate-6 text-2xl text-white [text-shadow:0_1px_4px_black] sm:text-3xl`}>
              the proposal
            </figcaption>
          </figure>
          <figure className="scrapbook-print relative mx-auto w-full max-w-lg rotate-3 lg:col-start-3 lg:row-start-1">
            <span aria-hidden="true" className="scrapbook-tape rotate-8 bg-dusk-100/90">💍 💍</span>
            <div className="relative aspect-[3/2]">
              <Image
                src={engagementRing}
                alt="Jedah shows her engagement ring as she and PJ smile together"
                fill
                sizes="(min-width: 1024px) 32vw, (min-width: 640px) 512px, 86vw"
                className="object-cover object-[center_65%]"
              />
            </div>
          </figure>
        </Reveal>
        <ProposalDivider />
      </section>

      <section className="relative isolate -mt-px overflow-hidden bg-dusk-900 px-5 pb-16 pt-20 text-cream sm:px-10 lg:px-[6vw] lg:pb-24 lg:pt-28">
        <Image src={bulodBackdrop} alt="" fill sizes="100vw" className="-z-20 object-cover" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-dusk-950/65" />
        <div aria-hidden="true" className="scrapbook-edge absolute inset-x-0 top-0 h-8 bg-dusk-500 sm:h-12" />
        <Reveal className="grid items-center gap-8 lg:grid-cols-[3fr_2fr] lg:gap-12">
          <div>
            <DetailHeading light>{detailHeadings.venue}</DetailHeading>
            <p className="mt-4 font-serif text-3xl leading-tight">
              {site.venueName}, {site.venueLocality}
            </p>
            <p className="mt-3 text-cream">{site.venueSummary}</p>
            <figure className="mt-7">
              <div className="grid grid-cols-2 gap-3 px-2 sm:gap-6">
                <div className="scrapbook-print -rotate-4">
                  <Image
                    src={bulodEntrance}
                    alt="Sunlight on the Bulod entrance sign beside the pool"
                    sizes="(min-width: 1024px) 25vw, 44vw"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
                <div className="scrapbook-print mt-3 rotate-4">
                  <Image
                    src={bulodPool}
                    alt="Bulod’s pool and guest rooms overlooking the sea"
                    sizes="(min-width: 1024px) 25vw, 44vw"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              </div>
              <figcaption className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                <a href="https://bulod.ph/" className="underline underline-offset-4">Photos by Bulod</a>
                <a href="https://www.instagram.com/p/DZ9dE6-zExz/" className="underline underline-offset-4">Backdrop on Instagram</a>
              </figcaption>
              </figure>
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cream underline decoration-butter-400 decoration-2 underline-offset-4 hover:text-butter-200"
              >
                Open in Google Maps
              </a>
          </div>
          <iframe
            src={site.mapsEmbedUrl}
            title={`Google Maps location of ${site.venueName}, ${site.venueLocality}`}
            loading="lazy"
            allowFullScreen
            className="h-72 w-full rounded-2xl border border-dusk-100 lg:h-full lg:min-h-80"
          />
        </Reveal>
      </section>

      <section className="relative -mt-8 sm:-mt-12">
        <div aria-hidden="true" className="scrapbook-edge absolute inset-x-0 top-0 h-8 rotate-180 bg-dusk-50 sm:h-12" />
        <div className="pt-8 sm:pt-12">
          <div className="bg-dusk-50 px-5 py-12 sm:px-10 lg:px-[6vw] lg:py-20">
            <Reveal>
              <div className="text-center">
                <DetailHeading>{detailHeadings.timeline}</DetailHeading>
                <p className="mx-auto mt-4 max-w-4xl font-serif text-2xl leading-snug text-dusk-900 md:text-3xl">
                  {weddingTimelineIntro}
                </p>
              </div>
              <ol className="mt-8 grid gap-10 lg:grid-cols-3 lg:gap-8">
                {weddingTimeline.map(({ date, title, note, events }, index) => (
                  <li key={date} className="min-w-0 border-t border-dusk-300 pt-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-dusk-700">{date}</p>
                    <h3 className="mt-1 font-serif text-2xl font-semibold leading-tight text-dusk-700 sm:text-3xl">{title}</h3>
                    {note && <p className="mt-2 leading-relaxed text-dusk-700">{note}</p>}
                    {index === 0 && (
                      <figure className="mt-4">
                        <Image
                          src={dayOnePhoto}
                          alt="Sunset over the sea reflected in Bulod’s pool"
                          sizes="(min-width: 1024px) 29vw, 94vw"
                          className="aspect-square w-full object-cover object-[center_75%]"
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
                        sizes="(min-width: 1024px) 29vw, 94vw"
                        className="mt-4 h-auto w-full"
                      />
                    )}
                    {events.length > 0 && (
                      <ol className="mt-4 flex flex-wrap gap-2.5">
                        {events.map(({ label, time }) => (
                          <li key={label} className="rounded-xl bg-white px-4 py-3">
                            <span className="block text-xs font-semibold text-dusk-700">{time}</span>
                            <span className="font-serif text-xl text-dusk-900">{label}</span>
                          </li>
                        ))}
                      </ol>
                    )}
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative bg-cream px-5 pb-12 pt-20 text-center sm:px-10 lg:px-[6vw] lg:pb-20 lg:pt-28">
        <div aria-hidden="true" className="scrapbook-edge absolute inset-x-0 top-0 h-8 bg-dusk-50 sm:h-12" />
        <Reveal>
          <DetailHeading>{detailHeadings.dressCode}</DetailHeading>
          <p className="mt-4 text-sm leading-relaxed text-dusk-700">{homepageAttireNote}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <figure className="min-w-0 p-4 text-center">
              <figcaption className="font-serif text-2xl italic text-dusk-900">Entourage</figcaption>
              <Image
                src={entourageAttire}
                alt="Watercolor outfits in dusty blue and pastel yellow, with airy dresses, closed-toe flats, and a linen vest with chinos"
                className="mx-auto mb-3 mt-2 h-52 w-full object-contain sm:h-64 lg:h-80"
                sizes="(min-width: 640px) 40vw, 80vw"
              />
              <GuestPalette entourage />
            </figure>
            <figure className="min-w-0 p-4 text-center">
              <figcaption className="font-serif text-2xl italic text-dusk-900">Guests</figcaption>
              <Image
                src={guestAttire}
                alt="Watercolor outfits in blush, sage, lilac and peach, with airy dresses and lightweight button-downs with chinos"
                className="mx-auto mb-3 mt-2 h-52 w-full object-contain sm:h-64 lg:h-80"
                sizes="(min-width: 640px) 40vw, 80vw"
              />
              <GuestPalette />
            </figure>
          </div>
          <Link href="/dress-code" className="mt-4 inline-block text-sm font-semibold text-dusk-700 underline underline-offset-4 hover:text-dusk-950">
            See the dress code and outfit ideas
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
