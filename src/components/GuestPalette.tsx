import { site } from "@/content";

export function GuestPalette({ entourage = false }: { entourage?: boolean }) {
  const colors = entourage ? site.entouragePalette : site.guestPalette;
  const label = entourage ? "Entourage color palette" : "Guest color palette";

  return (
    <ul className={`mx-auto grid max-w-md gap-1 sm:gap-4 ${entourage ? "w-fit grid-cols-2" : "grid-cols-5"}`} aria-label={label}>
      {colors.map(({ name, hex }) => (
        <li key={name} className="flex min-w-0 flex-col items-center gap-2 text-center text-xs leading-tight text-dusk-700">
          <span
            aria-hidden="true"
            className="block size-8 rounded-full shadow-inner ring-1 ring-dusk-900/10 sm:size-12"
            style={{ background: hex }}
          />
          {name}
        </li>
      ))}
    </ul>
  );
}
