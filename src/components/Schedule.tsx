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
    <section id="weekend-timeline" aria-labelledby="timeline-heading" className="bg-dusk-50 px-5 py-14 sm:px-10 lg:px-[6vw] lg:py-20">
      <header className="text-center">
        <h2 id="timeline-heading" className="font-serif text-4xl text-dusk-900 md:text-5xl">Weekend Timeline</h2>
        <p className="mx-auto mt-4 font-serif text-2xl leading-snug text-dusk-900 md:text-3xl lg:whitespace-nowrap">
          {weddingTimelineIntro}
        </p>
      </header>
      <ol className="mt-8 grid gap-10 lg:grid-cols-3 lg:gap-8">
        {weddingTimeline.map(({ date, title, note, events }, index) => (
          <li key={date} className="grid min-w-0 content-start gap-y-4 border-t border-dusk-300 pt-5 lg:row-span-3 lg:grid-rows-subgrid">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-dusk-700">{date}</p>
              <h3 className="mt-1 font-serif text-2xl font-semibold leading-tight text-dusk-700 sm:text-3xl">{title}</h3>
              {note && <p className="mt-2 leading-relaxed text-dusk-700">{note}</p>}
            </div>
            <figure className="scrapbook-print self-start">
              <Image
                src={index === 0 ? dayOnePhoto : index === 1 ? dayTwoPhoto : dayThreePhoto}
                alt={index === 0 ? "Sunset over the sea reflected in Bulod’s pool" : index === 1 ? "PJ gives Jedah a piggyback ride under autumn trees" : "PJ and Jedah embrace beneath the trees with sunlight between them"}
                sizes="(min-width: 1024px) 29vw, 94vw"
                className="h-auto w-full"
              />
              {index === 0 && (
                <figcaption className="mt-2 text-xs text-dusk-700">
                  <a href="https://www.instagram.com/p/DV8QwB7k8Ha/" className="underline underline-offset-4">Photo by Bulod</a>
                </figcaption>
              )}
            </figure>
            {events.length > 0 && (
              <ol className="relative grid gap-5 self-start before:absolute before:inset-y-5 before:left-[1.21875rem] before:w-px before:bg-dusk-300">
                {events.map(({ label, time }) => (
                  <li key={label} className="relative flex items-center gap-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full border border-dusk-300 bg-dusk-50 text-dusk-700" aria-hidden="true">
                      <svg viewBox="0 0 48 48" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d={eventIcons[label]} />
                      </svg>
                    </span>
                    <div className="min-w-0">
                      <span className={`${handwriting.className} inline-block -rotate-2 whitespace-nowrap rounded-md bg-butter-200 px-2 py-0.5 text-xl leading-none text-dusk-900`}>{time}</span>
                      <span className="mt-1 block font-serif text-xl leading-tight text-dusk-900">{label}</span>
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
