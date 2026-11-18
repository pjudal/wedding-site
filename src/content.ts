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
  // TODO: swap for the venue's exact Google Maps link once you have it.
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Bulod%2C+La+Union",

  // TODO: tentative. Responses are blocked after this moment (Philippine time).
  rsvpDeadline: "2027-01-15T23:59:59+08:00",
  rsvpDeadlineLabel: "January 15, 2027",

  // TODO: per person or per room? And how do guests pay it?
  nightBeforePrice: "Php 2,000",
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
    a: `Your room on the wedding day is on us. If you'd like to arrive early, you can stay the night before (${site.nightBeforeLabel}) for ${site.nightBeforePrice}. Just let us know in your RSVP.`,
  },
  {
    q: "What should I wear?",
    a: "Dress code details are coming soon. Our wedding colors are dusty blue and pastel yellow.",
  },
];
