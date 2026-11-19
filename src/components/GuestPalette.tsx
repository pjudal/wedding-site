import { site } from "@/content";

const guestShadePairs = [
  ["#FFD6D6", "#FF9EB7"],
  ["#FFE3C6", "#FFCC99"],
  ["#E6CCFF", "#D8C1FF"],
  ["#BFE7C6", "#A9E3BF"],
  ["#E4F7BF", "#CFF3A8"],
];

export function GuestPalette({
  entourage = false,
  showGuestShades = false,
}: {
  entourage?: boolean;
  showGuestShades?: boolean;
}) {
  const colors = entourage ? site.entouragePalette : site.guestPalette;
  const label = entourage ? "Entourage color palette" : "Guest color palette";

  return (
    <ul className={`mx-auto grid max-w-md gap-1 sm:gap-4 ${entourage ? "w-fit grid-cols-2" : "grid-cols-5"}`} aria-label={label}>
      {colors.map(({ name, hex }, index) => {
        const shades = showGuestShades && !entourage ? guestShadePairs[index] : undefined;
        return (
          <li key={name} className="flex min-w-0 flex-col items-center gap-2 text-center text-xs leading-tight text-dusk-700">
            <span
              aria-hidden="true"
              className="block size-8 rounded-full shadow-inner ring-1 ring-dusk-900/10 sm:size-12"
              style={{ background: shades ? `linear-gradient(115deg, ${shades[0]} 50%, ${shades[1]} 50%)` : hex }}
            />
            {name}
          </li>
        );
      })}
    </ul>
  );
}
