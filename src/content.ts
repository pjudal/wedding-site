import womenOutfits from "@/assets/beach-outfits-women.webp";
import menOutfits from "@/assets/beach-outfits-men.webp";

// Everything guests read lives in this file. Edit wording here, not in the components.
// Anything marked TODO is not confirmed yet - fill it in (or remove it) before launch.

export const site = {
  // TODO: confirm the order and how you want your names shown (first names only for now).
  coupleA: "PJ",
  coupleB: "Jedah",

  // Philippine time (UTC+8). Midnight is used only for the countdown.
  weddingDate: "2027-03-21T00:00:00+08:00",
  weddingDateLabel: "Sunday, March 21, 2027",
  heroDateLabel: "21 March 2027",
  shortDate: "03.21.27",

  venueName: "Bulod",
  venueArea: "La Union",
  mapsUrl: "https://www.google.com/maps/place/Bulod+La+Union/@16.4326335,120.3328873,17z/data=!3m1!4b1!4m6!3m5!1s0x33918300d5e55647:0x7b83f228836e65ab!8m2!3d16.4326284!4d120.3354622!16s%2Fg%2F11mrhr1xy2",
  drivingDirectionsUrl: "https://www.google.com/maps/dir/?api=1&origin=Manila%2C+Philippines&destination=16.4326284%2C120.3354622&travelmode=driving",

  // TODO: tentative. Responses are blocked after this moment (Philippine time).
  rsvpDeadline: "2027-01-15T23:59:59+08:00",
  rsvpDeadlineLabel: "January 15, 2027",

  // TODO: confirm payment instructions.
  nightBeforePrice: "₱2,000 per person",
  nightBeforeDeadlineLabel: "January 10, 2027",
  nightBeforeLabel: "Saturday, March 20",

  ceremonyTimeLabel: "4:30 PM",
  venueLocality: "Caba, La Union",
  venueSummary: "From the ceremony to the reception, we’ll be together right here at Bulod.",
  mapsEmbedUrl: "https://maps.google.com/maps?q=16.4326284%2C120.3354622&z=16&output=embed",

  dressCode: "Dress up for the beach in light, breathable pastels. Airy or floral dresses and lightweight collared polos with chinos are welcome. Please skip heavy gowns and save blue and yellow for the entourage.",
  guestPalette: [
    { name: "Blush pink", hex: "#EEC5D1" },
    { name: "Peach", hex: "#F5CBB6" },
    { name: "Lilac", hex: "#DCC9EC" },
    { name: "Mint", hex: "#C8E7D4" },
    { name: "Soft sage", hex: "#C7D4B8" },
  ],
};

export const faqs: { q: string; a: string }[] = [
  {
    q: "Can I bring a plus one?",
    a: "We're keeping our celebration intimate, so we can only host the guests named on your invitation. Thank you for understanding!",
  },
  {
    q: "When do I need to RSVP?",
    a: `Please RSVP by ${site.rsvpDeadlineLabel}. You can change your answer any time before then by looking up your name again.`,
  },
  {
    q: "Where will I stay?",
    a: `Rooms are at Bulod, and we’ll give you your room assignment when you arrive. We cover your stay on the wedding day. To stay the night before (${site.nightBeforeLabel}) for ${site.nightBeforePrice}, please confirm in your RSVP by ${site.nightBeforeDeadlineLabel}.`,
  },
  {
    q: "What should I wear?",
    a: site.dressCode,
  },
];

export const weddingTabs = [
  { href: "/", label: "Home" },
  { href: "/our-story", label: "Our Firsts Together" },
  { href: "/travel", label: "Pack Your Bags" },
  { href: "/things-to-do", label: "While You're Here" },
  { href: "/photos", label: "Us, Lately" },
  { href: "/wedding-party", label: "By Our Side" },
  { href: "/faq", label: "FAQs" },
  { href: "/rsvp", label: "RSVP" },
] as const;

export const firsts: { title: string; story?: string }[] = [
  { title: "Our first concert" },
  { title: "Our first international trip" },
];

export const weddingPages = {
  "our-story": { title: "Our Firsts Together" },
  travel: { title: "Pack Your Bags", intro: "From Manila to Bulod, La Union. The ceremony, reception, and after-party will all take place at Bulod." },
  "things-to-do": { title: "While You're Here", intro: "A few of our favorite spots in La Union." },
  photos: { title: "Us, Lately", intro: "Photos coming soon." },
  "wedding-party": { title: "By Our Side", intro: "Meet our entourage here soon." },
  faq: { title: "FAQs" },
  rsvp: { title: "RSVP" },
};

export const rsvpMessageLabel = "A message for us or a wedding hashtag idea";

export const laUnionFavorites = ["Alpas", "The Coffee Library", "Gefseis Greek Grill"];

export const travelTips = [
  {
    title: "Driving from Manila",
    text: "Head north via NLEX, SCTEX, and TPLEX toward La Union, then follow the directions to the Bulod venue pin. Set your exact starting point in Maps before leaving.",
    link: { href: site.drivingDirectionsUrl, label: "Get driving directions from Manila" },
  },
  {
    title: "Taking the bus from Manila",
    text: "Look for a Manila departure bound for San Fernando, La Union. Confirm the terminal, schedule, and drop-off with the bus operator, then arrange a ride from the drop-off to Bulod and share the venue pin with your driver.",
    link: { href: site.mapsUrl, label: "Open the Bulod venue pin" },
  },
];

export const detailHeadings = {
  date: "When We Say “I Do”",
  venue: "Where forever begins",
  timeline: "How the Day Unfolds",
  dressCode: "Look good, feel good ;)",
};

export const weddingTimeline = [
  {
    date: "Saturday, March 20",
    note: "If you’re joining us a day early, settle in and take it easy by the beach.",
    events: [],
  },
  {
    date: "Sunday, March 21",
    events: [
      { label: "Welcome Brunch", time: "10:00 AM" },
      { label: "Unplugged Ceremony", time: site.ceremonyTimeLabel },
      { label: "Cocktail Hour", time: "5:30 PM" },
      { label: "Program", time: "7:00 PM" },
      { label: "Reception", time: "8:00 PM" },
    ],
  },
  {
    date: "Monday, March 22",
    events: [{ label: "Time to Go Home", time: "12:00 noon" }],
  },
];

export const outfitIdeas = [
  {
    title: "For women",
    image: womenOutfits,
    alt: "Three airy beach wedding dresses in blush pink, lilac floral, and soft sage.",
    looks: [
      "An airy blush pink midi dress with flat sandals",
      "A lightweight lilac floral midi dress with dressy flats",
      "A flowy soft sage maxi dress with flat sandals",
    ],
  },
  {
    title: "For men",
    image: menOutfits,
    alt: "Three lightweight collared polos in peach, lilac, and sage paired with chinos and loafers.",
    looks: [
      "A peach short-sleeve polo with stone chinos",
      "A lightweight lilac knit polo with light gray chinos",
      "A soft sage collared polo with tan chinos and loafers",
    ],
  },
];
