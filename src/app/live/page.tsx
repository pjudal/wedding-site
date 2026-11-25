import type { Metadata } from "next";
import { Slideshow } from "@/components/Slideshow";

export const metadata: Metadata = { title: "Live photos" };

export default function LivePage() {
  return <Slideshow />;
}
