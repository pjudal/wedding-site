import Link from "next/link";
import { detailHeadings, site, weddingTimelineIntro } from "@/content";

const weekend = [
  {
    day: "Saturday · March 20",
    events: [
      { label: "Settle in by the sea", time: "2:00 PM", icon: "M9 36V20q0-4 4-4h22q4 0 4 4v16q0 4-4 4H13q-4 0-4-4ZM18 16v-4q0-3 3-3h6q3 0 3 3v4M16 17v22m16-22v22M5 12l2-5m-4 3 6 1m31-4 1 6m-3-2 6-1" },
    ],
  },
  {
    day: "Sunday · March 21",
    events: [
      { label: "Welcome brunch", time: "10:00 AM", icon: "M8 21h25v7q-1 10-12 10T8 28Zm25 2h4q9 0 7 6-2 5-12 5M5 41q13 4 31 0M15 16q-5-4 0-8m7 8q-5-5 0-11m7 11q-4-4 0-8" },
      { label: "Ceremony", time: site.ceremonyTimeLabel, icon: "M23 22a11 11 0 1 0 0 15m-2-11a11 11 0 1 1 2 12m-4-19 5-5h9l5 5-10 9Zm0 0h19m-14-5 4 14 5-14M13 10v6m-3-3h6m24-4v5m-2-3h5" },
      { label: "Toast", time: "5:30 PM", icon: "m8 8 12 3-3 13q-2 6-7 4t-4-8Zm27 0-12 3 3 13q2 6 7 4t4-8ZM10 28 7 39m-5-1 11 3m20-13 3 11m-5 2 11-3M7 18l11 3m7 0 11-3M23 5V2m-5 4-3-4m12 4 3-4" },
      { label: "Dinner", time: "8:00 PM", icon: "M36 25c0 7-5 13-12 13s-13-6-13-13 6-13 13-13 12 6 12 13Zm-4 0a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM3 13v9q0 3 4 3v15M7 13v11m37-11q-6 4-5 16h5m0-16v27M16 6l1 3m13-3 1 3" },
    ],
  },
  {
    day: "Monday · March 22",
    events: [
      { label: "Till next time", time: "12:00 PM", icon: "M5 29q5-3 7-9l3-8q2-3 4 0l-1 9 6-14q2-3 4 0l-4 13 7-12q3-2 4 1l-6 13 8-9q4-1 3 3l-9 14q-4 7-12 8l-5 5M3 11l4 4M10 5l3 5m28 15 4-2m-5 9 5-1" },
    ],
  },
];

export function SchedulePreview() {
  return (
    <div className="bg-dusk-50 px-5 py-12 text-center sm:px-10 lg:px-[6vw] lg:py-20">
      <h2 className="font-sans text-xl font-medium text-dusk-700 sm:text-3xl">
        <span className="bg-linear-to-t from-butter-200 from-30% to-transparent to-30% px-1">{detailHeadings.timeline}</span>
      </h2>
      <p className="mx-auto mt-4 font-serif text-2xl leading-snug text-dusk-900 md:text-3xl lg:whitespace-nowrap 2xl:text-4xl">
        {weddingTimelineIntro}
      </p>
      <div className="mx-auto mt-8 grid gap-8 lg:w-[75vw] lg:grid-cols-[1fr_4fr_1fr] lg:gap-0">
        {weekend.map(({ day, events }, dayIndex) => (
          <div key={day}>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-dusk-700">{day}</h3>
            <ol className={`mt-4 grid gap-x-2 gap-y-5 ${events.length > 1 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-1"}`}>
              {events.map(({ label, time, icon }, eventIndex) => (
                <li key={label} className="min-w-0 text-dusk-900">
                  <svg aria-hidden="true" viewBox="0 0 48 48" className="mx-auto size-14 text-dusk-700 sm:size-16 lg:size-20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path
                      d={icon}
                      pathLength="1"
                      className="schedule-draw"
                      style={{ animationDelay: `${(dayIndex === 0 ? 0 : dayIndex === 1 ? eventIndex + 1 : 5) * 0.38}s` }}
                    />
                  </svg>
                  <svg aria-hidden="true" viewBox="0 0 120 14" preserveAspectRatio="none" className="mt-1 h-3 w-full text-dusk-500">
                    <path d="M0 7Q30 1 60 7T120 7" fill="none" stroke="currentColor" vectorEffect="non-scaling-stroke" />
                    <path d="M60 12 55.7 7.7c-2.5-2.5 1.3-6.1 4.3-3 3-3.1 6.8.5 4.3 3Z" fill="currentColor" />
                  </svg>
                  <span className="mt-2 block text-xs font-semibold lg:text-sm text-dusk-700">{time}</span>
                  <span className="mt-1 block font-serif text-xl font-semibold leading-tight lg:text-2xl">{label}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
      <Link href="/schedule" className="mt-8 inline-block text-sm font-semibold text-dusk-700 underline decoration-butter-400 decoration-2 underline-offset-4">
        See the full schedule
      </Link>
    </div>
  );
}
