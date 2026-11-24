import Image from "next/image";
import { Caveat } from "next/font/google";
import bulodEntrance from "@/assets/bulod-entrance.webp";
import bulodBackdrop from "@/assets/bulod-venue-backdrop.webp";
import bulodPool from "@/assets/bulod-pool.webp";
import bulodCourtyard from "@/assets/bulod-courtyard.webp";
import engagementProposal from "@/assets/engagement-proposal.webp";
import engagementRing from "@/assets/engagement-ring.webp";
import engagementFromThis from "@/assets/engagement-from-this.jpg";
import engagementToThis from "@/assets/engagement-to-this.webp";
import { detailHeadings, saveTheDate, site } from "@/content";
import { Reveal } from "./Reveal";
import { SchedulePreview } from "./SchedulePreview";
import { ProposalDivider } from "./ProposalDivider";

const handwriting = Caveat({ subsets: ["latin"], weight: "600" });

const googleCalendarUrl = new URL("https://calendar.google.com/calendar/render");
googleCalendarUrl.search = new URLSearchParams({
  action: "TEMPLATE",
  text: `${site.coupleA} & ${site.coupleB}'s Wedding`,
  dates: "20270321/20270322",
  location: `${site.venueName}, ${site.venueLocality}`,
  details: `Venue directions: ${site.mapsUrl}`,
}).toString();

export function Details() {
  const [weddingWeekday, weddingDate] = site.weddingDateLabel.split(/, (.+)/);

  return (
    <div id="details" className="scroll-mt-18">
      <section className="bg-dusk-500 px-5 py-14 sm:px-6 lg:px-[4vw] xl:px-[6vw] lg:py-9">
        <Reveal className="mx-auto grid max-w-[110rem] items-center gap-10 px-3 sm:max-lg:px-0 lg:grid-cols-[minmax(0,1fr)_clamp(24rem,39vw,46rem)_minmax(0,1fr)] lg:gap-10">
          <div className="mx-auto w-full max-w-2xl sm:max-lg:max-w-none lg:col-start-1 lg:row-start-1">
            <figure className="scrapbook-print relative w-full max-w-lg -rotate-3 sm:max-lg:max-w-xl lg:w-[83%] lg:max-w-[min(32rem,30svh)]">
              <Image
                src={engagementFromThis}
                alt="An early black-and-white photo of Jedah and PJ"
                sizes="(min-width: 1024px) 32vw, (min-width: 640px) 576px, 86vw"
                className="h-auto w-full"
              />
              <figcaption className="scrapbook-tape -rotate-6">from this</figcaption>
            </figure>
            <svg aria-hidden="true" viewBox="0 0 70 52" className="ml-[45%] my-2 h-12 w-16 lg:my-1 lg:h-9 text-butter-200" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 6c6 17 19 29 50 33m-12-13 13 13-15 6" />
            </svg>
            <figure className="scrapbook-print relative ml-auto w-3/4 max-w-96 rotate-4 sm:max-lg:max-w-md lg:w-[62.25%] lg:max-w-[min(24rem,22.5svh)]">
              <div className="relative aspect-[3/4]">
                <Image
                  src={engagementToThis}
                  alt="PJ and Jedah embrace beside a tree, holding a bouquet of white roses"
                  fill
                  sizes="(min-width: 1024px) 24vw, (min-width: 640px) 448px, 65vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="scrapbook-tape -rotate-6">to this</figcaption>
            </figure>
          </div>

          <div className="text-center text-black lg:col-start-2 lg:row-start-1">
            <h2 className="font-sans text-xl font-medium leading-tight sm:text-3xl">
              <span className="inline-block rounded-md bg-butter-200 px-3 py-1 text-dusk-950">{detailHeadings.date}</span>
            </h2>
            <p className="mt-4 font-typewriter text-base font-bold leading-snug sm:text-lg">
              The two donuts back in 2015 paid off!
            </p>
            <p className="mt-4 font-serif text-5xl font-semibold leading-none text-white [text-shadow:0_1px_3px_#26384a] sm:text-6xl 2xl:text-8xl">
              <span className="block">{weddingWeekday}</span>
              <span className="mt-1 block text-[clamp(2.5rem,10vw,3rem)] sm:text-6xl lg:whitespace-nowrap 2xl:text-8xl">{weddingDate}</span>
            </p>
            <a
              href={googleCalendarUrl.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block text-sm font-semibold underline decoration-butter-200 decoration-2 underline-offset-4"
            >
              Add to Google Calendar
            </a>
            <p className="mt-5 font-serif text-3xl italic leading-tight lg:whitespace-nowrap lg:text-2xl xl:text-3xl">{saveTheDate}</p>
          </div>

          <div className="mx-auto grid w-full max-w-2xl gap-8 sm:max-lg:max-w-none lg:col-start-3 lg:gap-5 lg:row-start-1">
            <figure className="scrapbook-print relative w-full max-w-lg rotate-3 sm:max-lg:max-w-xl lg:w-[83%] lg:max-w-[min(32rem,30svh)]">
              <div className="relative aspect-[4/3]">
                <Image
                  src={engagementProposal}
                  alt="PJ down on one knee proposing to Jedah beneath a leafy arch"
                  fill
                  sizes="(min-width: 1024px) 32vw, (min-width: 640px) 576px, 86vw"
                  className="object-cover object-[center_79%]"
                />
              </div>
              <figcaption className="scrapbook-tape -rotate-8">the proposal</figcaption>
            </figure>
            <figure className="scrapbook-print relative ml-auto w-full max-w-lg -rotate-4 sm:max-lg:max-w-xl lg:w-[83%] lg:max-w-[min(32rem,30svh)]">
              <div className="relative aspect-[4/3]">
                <Image
                  src={engagementRing}
                  alt="Jedah shows her engagement ring as she and PJ smile together"
                  fill
                  sizes="(min-width: 1024px) 32vw, (min-width: 640px) 576px, 86vw"
                  className="object-cover object-[center_65%]"
                />
              </div>
              <figcaption className="scrapbook-tape rotate-8">on our 11th!</figcaption>
            </figure>
          </div>
        </Reveal>
        <ProposalDivider />
      </section>

      <section className="relative isolate -mt-1 overflow-hidden bg-dusk-900 px-5 pb-20 pt-24 text-cream sm:px-6 lg:px-[4vw] xl:px-[6vw] lg:pb-32 lg:pt-36">
        <Image src={bulodBackdrop} alt="" fill sizes="100vw" className="-z-20 object-cover" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-dusk-950/65" />
        <div aria-hidden="true" className="scrapbook-edge absolute inset-x-0 -top-1 h-9 bg-dusk-500 sm:h-13" />
        <Reveal className="mx-auto grid max-w-[108rem] items-center gap-9 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1.25fr)_minmax(0,0.7fr)] lg:gap-10">
          <div>
            <h2 className="font-sans text-xl font-medium leading-tight sm:text-3xl">
              <span className="inline-block rounded-md bg-dusk-300 px-3 py-1 text-dusk-950">{detailHeadings.venue}</span>
            </h2>
            <p className="mt-5 font-serif text-5xl font-semibold leading-none sm:text-6xl 2xl:text-8xl">
              <span className="block">{site.venueName}</span>
              <span className="block">{site.venueLocality}</span>
            </p>
            <p className="mt-5 max-w-sm text-base text-cream sm:text-lg">{site.venueSummary}</p>
            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <a href="https://bulod.ph/" className="underline underline-offset-4">Photos by Bulod</a>
              <a href="https://www.instagram.com/p/DZ9dE6-zExz/" className="underline underline-offset-4">Bulod on Instagram</a>
              <a href="https://www.instagram.com/p/DeLKtt5zYSS/" className="underline underline-offset-4">Courtyard photo</a>
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

          <figure className="mx-auto grid w-full max-w-2xl grid-cols-3 items-start gap-2 px-2 sm:gap-4 sm:max-lg:max-w-none sm:max-lg:px-1">
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
            <div className="scrapbook-print mt-3 -rotate-3">
              <Image
                src={bulodCourtyard}
                alt="A tree in Bulod’s courtyard at dusk"
                sizes="(min-width: 1024px) 13vw, (min-width: 640px) 180px, 30vw"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </figure>

          <a
            href={site.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group mx-auto block w-full max-w-64 rounded-xl px-3 py-2 text-center text-butter-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-butter-200"
          >
            <span className="illustrated-link block">
              <svg aria-hidden="true" viewBox="0 0 160 112" className="mx-auto w-full max-w-52" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="m10 42 43-14 52 16 43-16-6 61-40 14-53-16-39 13Zm43-14-4 59m56-43-3 59" />
                <path d="M19 82q13-2 19-18t24-10q10 4 20 2m18 17q12 11 33-9" strokeDasharray="3 6" />
                <path d="M107 68c-6-9-20-19-20-36a20 20 0 0 1 40 0c0 17-14 27-20 36Z" fill="var(--color-dusk-900)" />
                <path d="M107 43c-5-4-10-7-10-12 0-5 6-6 10-2 4-4 10-3 10 2 0 5-5 8-10 12Z" />
                <path d="M134 10v12m-6-6h12M25 20v9m-4-4h9" />
              </svg>
              <span className={`${handwriting.className} mt-1 block text-3xl sm:text-4xl group-hover:underline group-focus-visible:underline`}>Get directions</span>
            </span>
          </a>
        </Reveal>
        <div aria-hidden="true" className="scrapbook-edge absolute inset-x-0 -bottom-px h-8 rotate-180 bg-dusk-50 sm:h-12" />
      </section>

      <section className="-mt-px">
        <SchedulePreview />
      </section>
    </div>
  );
}
