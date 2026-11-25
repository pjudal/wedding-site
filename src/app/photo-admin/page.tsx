import type { Metadata } from "next";
import { PhotoAdmin } from "@/components/PhotoAdmin";

export const metadata: Metadata = { title: "Photo admin" };

export default function PhotoAdminPage() {
  return <PhotoAdmin />;
}
