import Link from "next/link";
import { detailHeadings, site, weddingTimelineIntro } from "@/content";
import { timelineIcons } from "./timelineIcons";

const weekend = [
  {
    day: "Saturday · March 20",
    events: [
      { label: "Settle in by the sea", time: "2:00 PM", icon: timelineIcons.arrival },
    ],
  },
  {
    day: "Sunday · March 21",
    events: [
      { label: "Welcome brunch", time: "10:00 AM", icon: timelineIcons.brunch },
      { label: "Ceremony", time: site.ceremonyTimeLabel, icon: timelineIcons.ceremony },
      { label: "Toast", time: "5:30 PM", icon: timelineIcons.toast },
      { label: "Dinner", time: "8:00 PM", icon: timelineIcons.dinner },
    ],
  },
  {
    day: "Monday · March 22",
    events: [
      { label: "Till next time", time: "12:00 PM", icon: timelineIcons.farewell },
    ],
  },
];

export function SchedulePreview() {
  return (
    <div className="bg-dusk-50 px-5 py-12 text-center sm:px-10 lg:px-[6vw] lg:py-20">
      <h2 className="font-sans text-xl font-medium leading-tight sm:text-3xl">
        <span className="bg-linear-to-t from-butter-200 from-30% to-transparent to-30% px-1 text-dusk-700">{detailHeadings.timeline}</span>
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
      <Link href="/wedding-details#weekend-timeline" className="mt-8 inline-block text-sm font-semibold text-dusk-700 underline decoration-butter-400 decoration-2 underline-offset-4">
        See the full schedule
      </Link>
    </div>
  );
}
