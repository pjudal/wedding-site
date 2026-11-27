import { RsvpEnvelope } from "@/components/RsvpEnvelope";
import Link from "next/link";
import { Details } from "@/components/Details";
import { Hero } from "@/components/Hero";
import { Welcome } from "@/components/Welcome";

export default function Home() {
  return (
    <main>
      <Welcome />
      <Hero />
      <Details />
      <section aria-labelledby="celebrate-with-us" className="relative bg-butter-50 px-6 pb-16 pt-3 text-center sm:px-12 md:pb-24 md:pt-5">
        <div aria-hidden="true" className="scrapbook-edge absolute inset-x-0 top-0 h-8 bg-dusk-50 sm:h-12" />
        <div aria-hidden="true" className="relative -mx-6 mb-5 flex overflow-hidden sm:-mx-12 sm:mb-8">
          {[0, 1, 2].map((strand) => (
            <svg
              key={strand}
              viewBox="0 0 720 120"
              className={`h-auto w-full shrink-0 text-black md:w-1/3 ${strand === 0 ? "block" : "hidden md:block"}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M0 12Q45 33 81 40T167 42Q187 39 205 33C243 21 207-10 207 18Q207 39 260 46Q313 56 358 54T447 44C487 36 507 23 500 12C492-4 475 12 481 26Q498 52 548 51Q601 54 639 44T720 12" />
              {[
                [81, 40, 9], [167, 42, -9], [260, 46, 8],
                [358, 54, -5], [447, 44, 10], [548, 51, -7], [639, 44, 12],
              ].map(([x, y, rotation]) => (
                <g key={x} transform={`translate(${x} ${y}) rotate(${rotation})`}>
                  <path d="M-6 1h12l1 13H-7Z M-6 5h12m-12 5h12" />
                  <path d="M-7 14C-8 20-19 27-19 39c0 11 8 18 19 18s19-7 19-18C19 27 8 20 7 14" />
                  <path d="M0 15v13m0 13c-4-4-8-6-8-10 0-4 5-5 8-1 3-4 8-3 8 1 0 4-4 6-8 10Z" />
                </g>
              ))}
            </svg>
          ))}
        </div>
        <h2 id="celebrate-with-us" className="mx-auto max-w-7xl text-balance font-serif text-xl font-semibold leading-tight text-dusk-900 sm:text-3xl">
          We hope you can celebrate with us!
        </h2>
        <Link
          href="/rsvp"
          className="group relative mx-auto mt-8 block w-40 max-w-full cursor-pointer rounded-2xl text-dusk-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dusk-700 sm:w-44"
        >
          <span className="illustrated-link relative block">
            <RsvpEnvelope />
            <span className="absolute inset-x-0 top-[26%] text-sm font-bold tracking-[0.25em] group-hover:underline group-focus-visible:underline">RSVP</span>
          </span>
        </Link>
        <figure className="mx-auto mt-10 max-w-3xl bg-[#171717] px-3 shadow-lg sm:mt-12 sm:px-5">
          <div aria-hidden="true" className="closing-film-perforations h-5 sm:h-7" />
          <video
            autoPlay
            muted
            loop
            playsInline
            controls
            preload="none"
            poster="/celebrate-film-poster.webp"
            aria-label="PJ and Jedah together on a mountainside"
            className="aspect-video w-full bg-black"
          >
            <source src="/celebrate-film.mp4" type="video/mp4" />
          </video>
          <div aria-hidden="true" className="closing-film-perforations h-5 sm:h-7" />
        </figure>
      </section>
    </main>
  );
}
