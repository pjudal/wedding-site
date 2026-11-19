// Everything guests read lives in this file. Edit wording here, not in the components.
// Anything marked TODO is not confirmed yet - fill it in (or remove it) before launch.

export const site = {
  // TODO: confirm the order and how you want your names shown (first names only for now).
  coupleA: "PJ",
  coupleB: "Jedah",

  // Philippine time (UTC+8). Midnight is used only for the countdown.
  weddingDate: "2027-03-21T00:00:00+08:00",
  weddingDateLabel: "Sunday, March 21, 2027",
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

  // TODO: times are not set yet. Leave "TBA" until they are.
  schedule: [
    { label: "Guest arrival", time: "TBA" },
    { label: "Ceremony", time: "TBA" },
    { label: "Reception", time: "TBA" },
  ],

  // TODO: dress code. null shows "Details coming soon".
  dressCode: null as string | null,

  palette: [
    { name: "Dusty blue", hex: "#6F8FAF" },
    { name: "Soft blue", hex: "#A9BFD4" },
    { name: "Pastel yellow", hex: "#F2D675" },
    { name: "Butter", hex: "#F8E9A8" },
    { name: "Cream", hex: "#FCFAF4" },
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
    a: "Dress code details are coming soon. Our wedding colors are dusty blue and pastel yellow.",
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
