import type { Metadata } from "next";
import { Gallery } from "@/components/Gallery";
import { photos } from "@/content";

export const metadata: Metadata = { title: photos.galleryTitle };

export default function GalleryPage() {
  return <Gallery />;
}
