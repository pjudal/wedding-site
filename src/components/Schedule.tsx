import { Caveat } from "next/font/google";
import Image from "next/image";
import dayOnePhoto from "@/assets/timeline-day-1.webp";
import dayTwoPhoto from "@/assets/timeline-day-2.webp";
import dayThreePhoto from "@/assets/timeline-day-3.webp";
import { weddingTimeline, weddingTimelineIntro } from "@/content";

import { timelineIcons } from "./timelineIcons";

const eventIcons: Readonly<Record<string, string>> = {
  "Settle in by the sea": timelineIcons.arrival,
  "Welcome Brunch": timelineIcons.brunch,
  "Unplugged Ceremony": timelineIcons.ceremony,
  "Cocktail Hour": timelineIcons.toast,
  Program: timelineIcons.program,
  Reception: timelineIcons.dinner,
  "Wrap up at Bulod": timelineIcons.farewell,
};

const handwriting = Caveat({ subsets: ["latin"], weight: "600" });

export function Schedule() {
  return (
    <section id="weekend-timeline" aria-labelledby="timeline-heading" className="bg-dusk-500 px-5 py-14 sm:px-10 lg:px-[6vw] lg:py-20">
      <header className="text-center">
        <h2 id="timeline-heading" className="font-serif text-4xl text-black md:text-5xl"><span className="bg-butter-400 px-1">Weekend Timeline</span></h2>
        <p className="mx-auto mt-4 font-serif text-2xl leading-snug text-black md:text-3xl lg:whitespace-nowrap">
          {weddingTimelineIntro}
        </p>
      </header>
      <ol className="mt-8 grid gap-10 lg:grid-cols-3 lg:gap-8">
        {weddingTimeline.map(({ date, title, note, events }, index) => (
          <li key={date} className="grid min-w-0 content-start gap-y-4 lg:row-span-3 lg:grid-rows-subgrid">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-black">{date}</p>
              <h3 className="mt-1 font-serif text-2xl font-semibold leading-tight text-black sm:text-3xl">{title}</h3>
              {note && <p className="mt-2 leading-relaxed text-black">{note}</p>}
            </div>
            <figure className="scrapbook-print relative self-start">
              <Image
                src={index === 0 ? dayOnePhoto : index === 1 ? dayTwoPhoto : dayThreePhoto}
                alt={index === 0 ? "Sunset over the sea reflected in Bulod’s pool" : index === 1 ? "PJ gives Jedah a piggyback ride under autumn trees" : "PJ and Jedah embrace beneath the trees with sunlight between them"}
                sizes="(min-width: 1024px) 29vw, 94vw"
                className="aspect-[2/3] w-full object-contain"
              />
              {index === 0 && (
                <figcaption className="absolute inset-x-[clamp(0.4rem,1vw,0.8rem)] bottom-1 text-xs text-dusk-700">
                  <a href="https://www.instagram.com/p/DV8QwB7k8Ha/" className="underline underline-offset-4">Photo by Bulod</a>
                </figcaption>
              )}
            </figure>
            {events.length > 0 && (
              <ol className={events.length > 1
                ? "relative mx-auto grid w-full max-w-md gap-6 self-start before:absolute before:inset-y-6 before:left-6 before:w-px before:bg-dusk-300 sm:before:left-1/2 sm:before:-translate-x-1/2"
                : "grid justify-items-center self-start"}>
                {events.map(({ label, time }, eventIndex) => (
                  <li key={label} className={events.length > 1
                    ? "relative grid min-h-12 grid-cols-[3rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)]"
                    : "flex flex-col items-center gap-3 text-center"}>
                    <span className="grid size-12 shrink-0 place-items-center rounded-full border border-dusk-300 bg-dusk-50 text-dusk-700 sm:col-start-2 sm:row-start-1" aria-hidden="true">
                      <svg viewBox="0 0 48 48" className="size-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d={eventIcons[label]} />
                      </svg>
                    </span>
                    <div className={events.length > 1
                      ? `min-w-0 sm:row-start-1 ${eventIndex % 2 === 0 ? "sm:col-start-3" : "sm:col-start-1 sm:text-right"}`
                      : "min-w-0"}>
                      <span className={`${handwriting.className} inline-block -rotate-2 whitespace-nowrap rounded-md bg-butter-200 px-2 py-0.5 text-2xl leading-none text-dusk-900`}>{time}</span>
                      <span className="mt-1 block font-serif text-2xl leading-tight text-black">{label}</span>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
