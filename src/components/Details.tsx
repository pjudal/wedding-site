import Image from "next/image";
import { Caveat } from "next/font/google";
import bulodEntrance from "@/assets/bulod-entrance.webp";
import bulodBackdrop from "@/assets/bulod-venue-backdrop.webp";
import bulodPool from "@/assets/bulod-pool.webp";
import illustratedCoast from "@/assets/la-union-illustrated-map.webp";
import engagementProposal from "@/assets/engagement-proposal.webp";
import engagementRing from "@/assets/engagement-ring.webp";
import engagementToThis from "@/assets/engagement-to-this.webp";
import { detailHeadings, saveTheDate, site } from "@/content";
import { Reveal } from "./Reveal";
import { SchedulePreview } from "./SchedulePreview";
import { ProposalDivider } from "./ProposalDivider";

const handwriting = Caveat({ subsets: ["latin"], weight: "600" });

export function Details() {
  return (
    <div id="details" className="scroll-mt-18">
      <section className="bg-dusk-500 px-5 py-14 sm:px-10 lg:px-[6vw] lg:py-20">
        <Reveal className="mx-auto grid max-w-[96rem] items-center gap-8 px-3 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,0.85fr)_minmax(0,1fr)] lg:gap-10">
          <div className="text-center text-black lg:col-start-2 lg:row-start-1">
            <h2 className="font-sans text-xl font-medium leading-tight sm:text-2xl">
              <span className="box-decoration-clone bg-linear-to-t from-butter-200 from-35% to-transparent to-35% px-1">{detailHeadings.date}</span>
            </h2>
            <p className={`${handwriting.className} mt-3 text-2xl leading-tight sm:text-3xl`}>
              The two donuts back in 2015 paid off!
            </p>
            <p className="mt-4 font-serif text-4xl font-semibold leading-none text-white [text-shadow:0_1px_3px_#26384a] sm:text-5xl 2xl:text-6xl">{site.weddingDateLabel}</p>
            <a
              href="/calendar.ics"
              className="mt-5 inline-block text-sm font-semibold underline decoration-butter-200 decoration-2 underline-offset-4"
            >
              Add to calendar
            </a>
            <p className="mt-5 font-serif text-2xl italic">{saveTheDate}</p>
          </div>
          <figure className="scrapbook-print mx-auto w-full max-w-64 -rotate-5 lg:col-start-1 lg:row-start-1">
            <Image
              src={engagementToThis}
              alt="PJ and Jedah embrace beside a tree, holding a bouquet of white roses"
              sizes="256px"
              className="h-auto w-full"
            />
            <figcaption className={`${handwriting.className} mt-2 text-center text-2xl text-dusk-900`}>to this</figcaption>
          </figure>

          <div className="mx-auto grid w-full max-w-lg gap-6 lg:col-start-3 lg:row-start-1">
            <figure className="scrapbook-print relative w-full rotate-3">
              <span aria-hidden="true" className="scrapbook-tape -rotate-8 bg-butter-200/90 text-dusk-700">
                <svg viewBox="0 0 70 32" className="h-8 w-[4.4rem]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M30 16c0 8-6 13-13 13S4 23 4 16 9 3 17 3s13 5 13 13Zm-8 0a5 5 0 1 0-10 0 5 5 0 0 0 10 0ZM5 15c3-4 4 3 7 1m10 0c3-2 3 5 7 2M12 9l2-1m7 2 2 1m-13 9-1 2m13 1 2-1" />
                  <path d="M66 16c0 8-6 13-13 13s-13-6-13-13S45 3 53 3s13 5 13 13Zm-8 0a5 5 0 1 0-10 0 5 5 0 0 0 10 0ZM44 11c2-4 7-6 12-4m5 8c1 4-1 8-5 10" />
                </svg>
              </span>
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
            <figure className="scrapbook-print relative ml-auto w-[66%] -rotate-4">
              <span aria-hidden="true" className="scrapbook-tape rotate-8 bg-dusk-100/90 text-dusk-700">
                <svg viewBox="0 0 52 34" className="h-8 w-12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M28 13a11 11 0 1 1-14-2m15 6a11 11 0 1 1 1 12M11 7l4-5h8l4 5-8 8Zm0 0h16m-12-5 4 13 4-13M36 3v5m-2-2h5" />
                </svg>
              </span>
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
          </div>
        </Reveal>
        <ProposalDivider />
      </section>

      <section className="relative isolate -mt-px overflow-hidden bg-dusk-900 px-5 pb-16 pt-20 text-cream sm:px-10 lg:px-[6vw] lg:pb-24 lg:pt-28">
        <Image src={bulodBackdrop} alt="" fill sizes="100vw" className="-z-20 object-cover" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-dusk-950/65" />
        <div aria-hidden="true" className="scrapbook-edge absolute inset-x-0 top-0 h-8 bg-dusk-500 sm:h-12" />
        <Reveal className="mx-auto grid max-w-[96rem] items-center gap-9 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1.25fr)_minmax(0,0.8fr)] lg:gap-10">
          <div>
            <h2 className="font-sans text-xl font-medium leading-tight sm:text-2xl">
              <span className="inline-block rounded-md bg-dusk-300 px-3 py-1 text-dusk-950">{detailHeadings.venue}</span>
            </h2>
            <p className="mt-5 font-serif text-5xl font-semibold leading-none sm:text-6xl 2xl:text-7xl">
              {site.venueName}, {site.venueLocality}
            </p>
            <p className="mt-5 max-w-xs text-cream">{site.venueSummary}</p>
            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <a href="https://bulod.ph/" className="underline underline-offset-4">Photos by Bulod</a>
              <a href="https://www.instagram.com/p/DZ9dE6-zExz/" className="underline underline-offset-4">Bulod on Instagram</a>
            </div>
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-semibold underline decoration-butter-200 underline-offset-4"
            >
              Open in Google Maps
            </a>
          </div>

          <figure className="mx-auto grid w-full max-w-lg grid-cols-2 items-start gap-3 px-3 sm:gap-6">
            <div className="scrapbook-print -rotate-5">
              <Image
                src={bulodEntrance}
                alt="Sunlight on the Bulod entrance sign beside the pool"
                sizes="(min-width: 1024px) 18vw, (min-width: 600px) 240px, 42vw"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div className="scrapbook-print mt-9 rotate-5 sm:mt-14">
              <Image
                src={bulodPool}
                alt="Bulod’s pool and guest rooms overlooking the sea"
                sizes="(min-width: 1024px) 18vw, (min-width: 600px) 240px, 42vw"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </figure>

          <a
            href={site.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group mx-auto block w-full max-w-60 overflow-hidden rounded-xl bg-cream text-dusk-900 shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-butter-200"
          >
            <Image
              src={illustratedCoast}
              alt=""
              sizes="240px"
              className="h-28 w-full object-cover object-[center_70%]"
            />
            <span className="flex items-center justify-between gap-4 px-4 py-3">
              <span>
                <span className="block font-serif text-2xl leading-tight">{site.venueName}</span>
                <span className="block text-sm font-semibold text-dusk-700 group-hover:underline">Get directions</span>
              </span>
              <span aria-hidden="true" className="text-lg">↗</span>
            </span>
          </a>
        </Reveal>
      </section>

      <section className="relative -mt-8 sm:-mt-12">
        <div aria-hidden="true" className="scrapbook-edge absolute inset-x-0 top-0 h-8 rotate-180 bg-dusk-50 sm:h-12" />
        <div className="pt-8 sm:pt-12">
          <SchedulePreview />
        </div>
      </section>
    </div>
  );
}
