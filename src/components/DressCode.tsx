import Image from "next/image";
import entourageAttire from "@/assets/attire-entourage.webp";
import guestAttire from "@/assets/attire-guests.webp";
import ladiesLooks from "@/assets/attire-ladies-looks.webp";
import menLooks from "@/assets/attire-men-looks.webp";
import { GuestPalette } from "./GuestPalette";
import { attireToAvoid, dressCodeTagline, outfitIdeas, site } from "@/content";

const illustrations = {
  Ladies: { image: ladiesLooks, alt: "Guests in pastel and floral dresses chat with entourage friends in dusty blue and butter yellow" },
  Men: { image: menLooks, alt: "Guests in pastel button-downs and chinos mingle with entourage friends in dusty blue and butter yellow vests. Several men wear sunglasses." },
};

export function DressCode() {
  return (
    <section id="dress-code" aria-labelledby="dress-code-heading" className="relative bg-butter-200 pb-16 md:pb-24">
      <div aria-hidden="true" className="scrapbook-edge pointer-events-none absolute inset-x-0 top-0 h-7 bg-dusk-50 sm:h-10" />
      <header className="bg-butter-200 px-4 py-14 text-center md:py-20">
        <h2 id="dress-code-heading" className="font-serif text-4xl text-dusk-900 md:text-5xl">
          Dress Code
        </h2>
        <p className="mx-auto mt-3 w-fit max-w-full rounded-full bg-dusk-300 px-5 py-2 font-serif text-2xl italic text-black">{dressCodeTagline}</p>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-dusk-700 sm:text-base">{site.dressCode}</p>
      </header>

      <div className="mx-auto max-w-5xl px-4">
        <div className="isolate mx-auto grid max-w-2xl gap-8 rounded-2xl bg-butter-50 px-4 py-6 text-center sm:grid-cols-[1fr_2fr] sm:px-6">
          <div>
            <h3 className="mb-3 font-serif text-2xl italic text-dusk-700">Entourage</h3>
            <Image
              src={entourageAttire}
              alt="Watercolor outfits in dusty blue and pastel yellow, with airy dresses, closed-toe flats, and a linen vest with chinos"
              className="mx-auto mb-4 h-48 w-auto object-contain sm:h-56"
              sizes="200px"
            />
            <GuestPalette entourage />
          </div>
          <div>
            <h3 className="mb-3 font-serif text-2xl italic text-dusk-700">Guests</h3>
            <Image
              src={guestAttire}
              alt="Watercolor outfits in blush, sage, lilac and peach, with airy dresses and lightweight button-downs with chinos"
              className="mx-auto mb-4 h-48 w-auto object-contain mix-blend-multiply sm:h-56"
              sizes="224px"
            />
            <GuestPalette showGuestShades />
          </div>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_13rem]">
          <div className="grid gap-10">
            {outfitIdeas.map(({ title, description }) => (
              <article key={title} className="isolate rounded-2xl bg-butter-50 p-4 sm:p-6">
                <h3 className="font-serif text-4xl italic text-dusk-700">{title}</h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-dusk-700">{description}</p>
                <Image
                  src={illustrations[title].image}
                  alt={illustrations[title].alt}
                  sizes="(min-width: 1024px) 704px, (min-width: 640px) calc(100vw - 5rem), calc(100vw - 4rem)"
                  className="mt-4 h-auto w-full mix-blend-multiply"
                />
              </article>
            ))}
          </div>

          <aside aria-labelledby="attire-avoid" className="rounded-2xl bg-butter-50 p-6">
            <h3 id="attire-avoid" className="font-serif text-3xl italic text-dusk-900">Avoid</h3>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-dusk-700 md:grid-cols-1">
              {attireToAvoid.map((item) => (
                <li key={item} className="py-2">{item}</li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
