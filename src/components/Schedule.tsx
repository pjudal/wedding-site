import Image from "next/image";
import dayOnePhoto from "@/assets/timeline-day-1.webp";
import dayTwoPhoto from "@/assets/timeline-day-2.webp";
import dayThreePhoto from "@/assets/timeline-day-3.webp";
import { weddingTimeline, weddingTimelineIntro } from "@/content";

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
                alt={index === 0 ? "Sunset over the sea reflected in Bulod’s pool" : index === 1 ? "PJ and Jedah embrace beside a lake framed by snowy mountains" : "PJ photographs Jedah as snow falls around them"}
                sizes="(min-width: 1024px) 29vw, 94vw"
                className={index === 0 ? "aspect-square w-full object-cover object-[center_75%]" : "h-auto w-full"}
              />
              {index === 0 && (
                <figcaption className="mt-2 text-xs text-dusk-700">
                  <a href="https://www.instagram.com/p/DV8QwB7k8Ha/" className="underline underline-offset-4">Photo by Bulod</a>
                </figcaption>
              )}
            </figure>
            {events.length > 0 && (
              <ol className="flex flex-wrap gap-2.5 self-start">
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
    </section>
  );
}
