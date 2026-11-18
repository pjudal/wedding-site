import { site } from "@/content";

// All-day calendar event. Swap to timed DTSTART/DTEND once the ceremony time is set.
export function GET() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//wedding-site//EN",
    "BEGIN:VEVENT",
    "UID:wedding-20270321@wedding-site",
    "DTSTAMP:20261201T000000Z",
    "DTSTART;VALUE=DATE:20270321",
    "DTEND;VALUE=DATE:20270322",
    `SUMMARY:${site.coupleA} & ${site.coupleB}'s Wedding`,
    `LOCATION:${site.venueName}\\, ${site.venueArea}`,
    `DESCRIPTION:RSVP by ${site.rsvpDeadlineLabel}.`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="wedding.ics"',
    },
  });
}
