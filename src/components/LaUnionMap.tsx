"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { LatLngTuple } from "leaflet";
import alpas from "@/assets/la-union-alpas.webp";
import coffee from "@/assets/la-union-coffee.webp";
import gefseis from "@/assets/la-union-gefseis.webp";
import { laUnionFavorites } from "@/content";
import "leaflet/dist/leaflet.css";

const photos = {
  alpas: { image: alpas, alt: "Alpas Coffee and Plant Studio’s thatched café and garden seating" },
  coffee: { image: coffee, alt: "The Coffee Library’s two-storey wooden café in San Juan" },
  gefseis: { image: gefseis, alt: "Baklava served at Gefseis Greek Grill" },
};

export function LaUnionMap() {
  const layout = useRef<HTMLDivElement>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const cards = useRef<Array<HTMLAnchorElement | null>>([]);
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const container = mapContainer.current;
    const panel = layout.current;
    if (!container || !panel) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    void import("leaflet").then((L) => {
      if (disposed) return;
      const points = laUnionFavorites.map(({ coordinates }) => [...coordinates] as LatLngTuple);
      const map = L.map(container, { scrollWheelZoom: false, zoomSnap: 0.25, attributionControl: false });
      L.control.attribution({ prefix: false, position: "bottomleft" }).addTo(map);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [26, 36] });

      const markers = points.map((point, index) => {
        const place = laUnionFavorites[index];
        return L.marker(point, {
          title: place.name,
          icon: L.divIcon({
            className: "la-union-pin",
            html: '<span aria-hidden="true"></span>',
            iconSize: [30, 18],
            // The San Juan stops are very close together, so stagger their pin labels.
            iconAnchor: [8, index === 1 ? 21 : index === 2 ? -3 : 9],
          }),
        }).addTo(map).on("click", () => cards.current[index]?.focus({ preventScroll: true }));
      });

      function drawLines() {
        const panelBox = panel!.getBoundingClientRect();
        const mapBox = container!.getBoundingClientRect();
        setLines(markers.map((marker, index) => {
          const pin = marker.getElement()?.querySelector("span")?.getBoundingClientRect();
          const card = cards.current[index]?.getBoundingClientRect();
          if (!pin || !card || !map.getBounds().contains(marker.getLatLng())) return "";
          const x = pin.right - panelBox.left;
          const y = pin.top + pin.height / 2 - panelBox.top;
          const endX = card.left - panelBox.left;
          const endY = card.top + Math.min(card.height / 2, 70) - panelBox.top;
          const bendX = (mapBox.right + card.left) / 2 - panelBox.left;
          return `M ${x} ${y} C ${bendX} ${y}, ${bendX} ${endY}, ${endX} ${endY}`;
        }));
      }

      const resize = new ResizeObserver(() => {
        map.invalidateSize({ pan: false });
        drawLines();
      });
      resize.observe(panel);
      cards.current.forEach((card) => { if (card) resize.observe(card); });
      map.on("move zoomend resize", drawLines);
      drawLines();
      cleanup = () => {
        resize.disconnect();
        map.remove();
      };
    });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <div ref={layout} className="relative mt-10 grid grid-cols-[minmax(0,1fr)_minmax(8rem,38%)] gap-3 sm:gap-5 md:grid-cols-[minmax(0,1fr)_minmax(15rem,32%)]">
      <div
        ref={mapContainer}
        aria-label="Map of our favorite La Union spots"
        className="z-0 min-h-[28rem] rounded-2xl border border-dusk-100 bg-dusk-100"
      />
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] h-full w-full overflow-visible" fill="none">
        {lines.map((line, index) => (
          <path key={laUnionFavorites[index].id} d={line} className="stroke-dusk-700" strokeWidth="1.5" strokeDasharray="4 3" />
        ))}
      </svg>
      <ul className="relative z-[2] grid content-center gap-4">
        {laUnionFavorites.map((place, index) => (
          <li key={place.id}>
            <article className="overflow-hidden rounded-xl border border-dusk-100 bg-white shadow-sm">
              <a
                ref={(element) => { cards.current[index] = element; }}
                href={place.mapsUrl}
                className="block focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-dusk-700"
                aria-label={`${place.name} on Google Maps`}
              >
                <Image src={photos[place.id].image} alt={photos[place.id].alt} sizes="(min-width: 1024px) 300px, 36vw" className="aspect-[16/10] w-full object-cover" />
                <h2 className="px-2 pt-2 font-serif text-lg leading-none text-dusk-900 sm:px-3 sm:text-2xl">{place.name}</h2>
                <span className="block px-2 pb-2 pt-1 text-xs text-dusk-700 underline underline-offset-2 sm:px-3">Google Maps</span>
              </a>
              <a href={place.photoCredit.href} className="block border-t border-dusk-100 px-2 py-1.5 text-[11px] text-dusk-700 sm:px-3">
                Photo: {place.photoCredit.name}
              </a>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
