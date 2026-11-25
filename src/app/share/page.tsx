import type { Metadata } from "next";
import { ShareUploader } from "@/components/ShareUploader";
import { photos } from "@/content";

export const metadata: Metadata = { title: photos.shareTitle };

export default function SharePage() {
  return <ShareUploader />;
}
