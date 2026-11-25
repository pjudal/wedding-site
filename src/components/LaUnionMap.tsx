import { Caveat } from "next/font/google";
import Image from "next/image";
import postcard from "@/assets/la-union-watercolor-postcard.webp";
import alpas from "@/assets/la-union-alpas.webp";
import coffee from "@/assets/la-union-coffee.webp";
import gefseis from "@/assets/la-union-gefseis.webp";
import { laUnionFavorites, site } from "@/content";

const postcardLettering = Caveat({ subsets: ["latin"], weight: "600" });

const photos: Partial<Record<string, { image: typeof alpas; alt: string }>> = {
  alpas: { image: alpas, alt: "Alpas Coffee and Plant Studio’s thatched café and garden seating" },
  coffee: { image: coffee, alt: "The Coffee Library’s two-storey wooden café in San Juan" },
  gefseis: { image: gefseis, alt: "Baklava served at Gefseis Greek Grill" },
};

export function LaUnionMap() {
  return (
    <figure className="mt-10">
      <div className="mx-auto grid max-w-5xl items-start gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-8">
        <div className="bg-cream p-2 shadow-lg sm:p-3">
          <div className="relative isolate aspect-[2/3] overflow-hidden bg-dusk-300">
            <Image
              src={postcard}
              alt=""
              fill
              sizes="(min-width: 1024px) 600px, (min-width: 768px) 55vw, 92vw"
              className="object-cover"
            />
            <span aria-hidden="true" className={`${postcardLettering.className} absolute left-[5%] top-[12%] max-w-[32%] text-2xl leading-none text-white [text-shadow:0_1px_4px_#1d2b39] sm:text-4xl`}>
              La Union
            </span>
            {laUnionFavorites.map(({ id, name, pin, mapsUrl }, index) => (
              <a
                key={id}
                href={mapsUrl}
                aria-label={`${index + 1}. ${name} on Google Maps`}
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                className="absolute grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-cream bg-dusk-900 font-semibold text-cream shadow-md hover:bg-dusk-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusk-950"
              >
                {index + 1}
              </a>
            ))}
            <a
              href={site.mapsUrl}
              aria-label="Bulod, our wedding venue, on Google Maps"
              className="absolute bottom-[6%] left-[51%] flex -translate-x-1/2 flex-col items-center gap-1 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusk-950"
            >
              <span aria-hidden="true" className="grid size-11 place-items-center rounded-full border-2 border-cream bg-butter-400 text-xl text-dusk-950 shadow-md">♥</span>
              <span className="rounded-sm bg-cream px-2 py-0.5 font-serif text-xl font-semibold italic text-dusk-950 shadow-sm">{site.venueName}</span>
            </a>
          </div>
        </div>
        <ol className="grid gap-3">
          {laUnionFavorites.map((place, index) => {
            const photo = photos[place.id];
            return (
              <li key={place.id} className="bg-cream p-2 shadow-sm">
                <a
                  href={place.mapsUrl}
                  className="flex min-h-11 items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-dusk-700"
                  aria-label={`${index + 1}. ${place.name} on Google Maps`}
                >
                  {photo && <Image src={photo.image} alt={photo.alt} sizes="96px" className="aspect-square w-20 shrink-0 object-cover sm:w-24" />}
                  <div className="min-w-0 py-1">
                    <span aria-hidden="true" className="text-xs font-semibold text-dusk-700">{index + 1}.</span>
                    <span className="block font-serif text-xl font-semibold leading-tight text-dusk-900 sm:text-2xl">{place.name}</span>
                    <span className="text-xs text-dusk-700 underline underline-offset-2">Google Maps</span>
                  </div>
                </a>
                {photo && <a href={place.photoCredit.href} className="mt-1 block text-xs text-dusk-700 underline underline-offset-2">Photo: {place.photoCredit.name}</a>}
              </li>
            );
          })}
        </ol>
      </div>
      <figcaption className="mx-auto mt-3 max-w-5xl text-xs text-dusk-700">Illustrated map, not to scale. Tap a pin for Google Maps directions.</figcaption>
    </figure>
  );
}
