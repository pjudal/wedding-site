import Image from "next/image";
import postcard from "@/assets/la-union-watercolor-postcard.webp";
import alpas from "@/assets/la-union-alpas.webp";
import coffee from "@/assets/la-union-coffee.webp";
import gefseis from "@/assets/la-union-gefseis.webp";
import { laUnionFavorites, site } from "@/content";

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
              alt="La Union, Philippines, hand-lettered on a watercolor postcard of the coast"
              fill
              sizes="(min-width: 1024px) 600px, (min-width: 768px) 55vw, 92vw"
              className="object-cover"
            />
            {laUnionFavorites.map(({ id, name, pin, mapsUrl }) => (
              <a
                key={id}
                href={mapsUrl}
                aria-label={`${name} on Google Maps`}
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                className="absolute h-11 w-[28%] min-w-11 -translate-x-3 -translate-y-1/2 rounded-md hover:bg-cream/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusk-950"
              />
            ))}
            <a
              href={site.mapsUrl}
              aria-label="Bulod, our wedding venue, on Google Maps"
              className="absolute left-[34%] top-[86%] h-11 w-[30%] min-w-11 -translate-x-3 -translate-y-1/2 rounded-md hover:bg-cream/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusk-950"
            />
          </div>
        </div>
        <ol className="grid gap-3">
          {laUnionFavorites.map((place) => {
            const photo = photos[place.id];
            return (
              <li key={place.id} className="bg-cream p-2 shadow-sm">
                <a
                  href={place.mapsUrl}
                  className="flex min-h-11 items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-dusk-700"
                  aria-label={`${place.name} on Google Maps`}
                >
                  {photo && <Image src={photo.image} alt={photo.alt} sizes="96px" className="aspect-square w-20 shrink-0 object-cover sm:w-24" />}
                  <div className="min-w-0 py-1">
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
      <figcaption className="mx-auto mt-3 max-w-5xl text-xs text-dusk-700">Illustrated map, not to scale. Tap a place on the postcard for Google Maps directions.</figcaption>
    </figure>
  );
}
