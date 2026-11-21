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

  dressCode: "Dress up for the beach in light, breathable pastels. Blue and yellow are reserved for the entourage.",
  entouragePalette: [
    { name: "Dusty blue", hex: "#92A8BC" },
    { name: "Pastel yellow", hex: "#F4E3A3" },
  ],
  guestPalette: [
    { name: "Blush pink", hex: "#EEC5D1" },
    { name: "Peach", hex: "#F5CBB6" },
    { name: "Lilac", hex: "#DCC9EC" },
    { name: "Mint", hex: "#C8E7D4" },
    { name: "Soft sage", hex: "#C7D4B8" },
  ],
};

export const attireToAvoid = ["White", "Black", "Jeans", "Shorts", "Polo shirts", "Slippers"];

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
    a: `${site.dressCode} Airy or floral dresses and lightweight button-downs with chinos are welcome. Please avoid ${attireToAvoid.map((item) => item.toLowerCase()).join(", ")}.`,
  },
  {
    q: "Can I wear heels?",
    a: "Yes! Everything from the ceremony to the reception will take place on paved surfaces, so feel free to wear heels if you prefer.",
  },
];

export const weddingTabs = [
  { href: "/", label: "Home" },
  { href: "/wedding-details", label: "Sun, Sand, and Schedule" },
  { href: "/our-story", label: "Firsts & Favorites" },
  { href: "/photos", label: "Us, Lately" },
  { href: "/travel", label: "Pack Your Bags" },
  { href: "/wedding-party", label: "By Our Side" },
  { href: "/faq", label: "FAQs" },
  { href: "/rsvp", label: "RSVP" },
] as const;

export const firsts: { title: string; story?: string }[] = [
  { title: "Our first concert" },
  { title: "Our first international trip" },
];

export const weddingPages = {
  "wedding-details": { title: "Sun, Sand, and Schedule" },
  "our-story": { title: "Firsts & Favorites" },
  travel: { title: "Pack Your Bags", intro: "From Manila to Bulod, La Union. The ceremony, reception, and after-party will all take place at Bulod." },
  photos: { title: "Us, Lately", intro: "Photos coming soon." },
  "wedding-party": { title: "By Our Side", intro: "Meet our entourage here soon." },
  faq: { title: "FAQs" },
  rsvp: { title: "RSVP" },
};

export const rsvpMessageLabel = "A message for us or a wedding hashtag idea";

export const laUnionFavorites = [
  {
    id: "alpas",
    name: "Alpas",
    pin: { x: 57, y: 24 },
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Alpas+Coffee+and+Plant+Studio%2C+Bacnotan%2C+La+Union",
    photoCredit: { name: "leeart", href: "https://ecency.com/hive-163772/%40leeart/peeocpws" },
  },
  {
    id: "coffee",
    name: "The Coffee Library",
    pin: { x: 54, y: 58 },
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=The+Coffee+Library+San+Juan%2C+La+Union&query_place_id=ChIJbxXFr-qNkTMRwcGcDMLtdRw",
    photoCredit: { name: "xyzAsia", href: "https://www.xyzasia.com/home/best-philippines-road-trips-circumnavigation-north-luzon" },
  },
  {
    id: "gefseis",
    name: "Gefseis Greek Grill",
    pin: { x: 49, y: 64 },
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Gefseis+Greek+Grill%2C+Urbiztondo+Beach%2C+San+Juan%2C+La+Union&query_place_id=ChIJ81OuSZWNkTMRGJV39WTPNwU",
    photoCredit: { name: "When In Manila", href: "https://www.wheninmanila.com/gefseis-greek-grill-authentic-greek-cuisine-la-union/" },
  },
] as const;

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


export const dressCodeTagline = "Come as you are (but make it cute!)";

export const saveTheDate = "Save the date. We’d love to see you there!";
export const weddingTimelineIntro = "Sunday’s the big day, but we’d love to spend the weekend by the sea with you.";

export const weddingTimeline = [
  {
    date: "Saturday, March 20",
    title: "Ease into the weekend",
    note: "If you’re joining us a day early, settle in and take it easy by the beach.",
    events: [{ label: "Settle in by the sea", time: "2:00 PM" }],
  },
  {
    date: "Sunday, March 21",
    title: "The wedding day",
    note: "Come hungry for brunch, then join us for seaside vows, dinner, and dancing.",
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
    title: "Until next time",
    note: "Take it slow this morning. You’ve still got half the day to enjoy La Union before heading home.",
    events: [{ label: "Wrap up at Bulod", time: "12:00 PM" }],
  },
];

export const outfitIdeas = [
  {
    title: "Ladies",
    description: "Choose an airy midi or maxi dress in a pastel or floral print. Lightweight fabrics and dressy flats or sandals are great for the beach. Please skip heavy gowns.",
  },
  {
    title: "Men",
    description: "Wear a lightweight button-down with tailored chinos and loafers. Linen and breathable cotton are good choices. Entourage men wear a vest in dusty blue or pastel yellow.",
  },
] as const;
