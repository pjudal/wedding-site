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
            <svg aria-hidden="true" viewBox="0 0 56 40" className="block h-7 w-10 max-w-full sm:h-10 sm:w-14">
              {shades && (
                <defs>
                  <linearGradient id={`guest-shell-${index}`} x2="100%" y2="70%">
                    <stop stopColor={shades[0]} />
                    <stop offset="100%" stopColor={shades[1]} />
                  </linearGradient>
                </defs>
              )}
              <path
                d="M28 37c-5 0-6-4-9-7C11 26 3 22 3 16c0-4 4-7 8-7 2-4 7-6 12-5 3-3 7-3 10 0 5-1 10 1 12 5 4 0 8 3 8 7 0 6-8 10-16 14-3 3-4 7-9 7Z"
                fill={shades ? `url(#guest-shell-${index})` : hex}
                stroke="currentColor"
                strokeOpacity=".35"
              />
              <path d="M28 31C20 23 14 16 11 9m17 22c-3-10-5-19-5-27m5 27c3-10 5-19 5-27m-5 27c8-8 14-15 17-22" fill="none" stroke="currentColor" strokeOpacity=".3" strokeLinecap="round" />
            </svg>
            {name}
          </li>
        );
      })}
    </ul>
  );
}
