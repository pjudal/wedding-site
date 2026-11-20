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
      <section aria-labelledby="celebrate-with-us" className="relative bg-butter-50 px-6 pb-16 pt-20 text-center sm:px-12 md:pb-24 md:pt-28">
        <div aria-hidden="true" className="scrapbook-edge absolute inset-x-0 top-0 h-8 bg-dusk-50 sm:h-12" />
        <h2 id="celebrate-with-us" className="mx-auto max-w-7xl text-balance font-serif text-5xl font-semibold leading-[0.95] text-dusk-900 sm:text-7xl lg:text-8xl">
          We hope you can celebrate with us!
        </h2>
        <Link
          href="/rsvp"
          className="group relative mx-auto mt-8 block w-40 max-w-full rounded-2xl text-dusk-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dusk-700 sm:w-44"
        >
          <svg aria-hidden="true" viewBox="0 0 176 112" className="w-full motion-safe:transition-transform motion-safe:group-hover:-rotate-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 43 86 7q3-2 6 0l65 37v49H19Z" fill="var(--color-dusk-300)" />
            <path d="M34 51V22q0-5 5-5h98q5 0 5 5v29L89 81Z" fill="var(--color-cream)" />
            <path d="M19 44 88 81l69-37v51q0 6-6 6H25q-6 0-6-6Z" fill="var(--color-butter-200)" />
            <path d="m21 97 45-28m89 28-45-28" />
            <path d="M88 90c-6-4-12-8-12-13 0-6 8-7 12-2 4-5 12-4 12 2 0 5-6 9-12 13Z" fill="var(--color-dusk-300)" />
            <path d="M8 23v10m-5-5h10m151 1v12m-6-6h12" stroke="var(--color-dusk-500)" />
          </svg>
          <span className="absolute inset-x-0 top-[26%] text-sm font-bold tracking-[0.25em]">RSVP</span>
        </Link>
      </section>
    </main>
  );
}
