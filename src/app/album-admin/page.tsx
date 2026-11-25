import { AlbumAdmin } from "@/components/AlbumAdmin";

export const metadata = { title: "Album admin", robots: { index: false, follow: false } };

export default function AlbumAdminPage() {
  return <main className="mx-auto min-h-[70svh] max-w-[90rem] px-4 pb-16 pt-24"><AlbumAdmin /></main>;
}
