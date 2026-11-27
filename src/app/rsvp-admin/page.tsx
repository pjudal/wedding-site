import { RsvpQuestionEditor } from "@/components/RsvpQuestionEditor";

export const metadata = { title: "RSVP question editor", robots: { index: false, follow: false } };

export default function RsvpAdminPage() {
  return <main className="mx-auto min-h-[70svh] max-w-3xl px-4 pb-16 pt-24">
    <RsvpQuestionEditor />
  </main>;
}
