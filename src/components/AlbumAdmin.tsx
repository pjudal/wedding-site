"use client";

import { useState } from "react";
import { PhotoAlbum } from "./PhotoAlbum";

export function AlbumAdmin() {
  const [key, setKey] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  if (unlocked) return <PhotoAlbum adminKey={key} />;

  return (
    <form className="mx-auto grid max-w-sm gap-4" onSubmit={async (event) => {
      event.preventDefault();
      setPending(true);
      setError("");
      try {
        const response = await fetch("/api/album?action=unlock", { method: "POST", headers: { "x-album-admin": key } });
        if (!response.ok) throw new Error();
        setUnlocked(true);
      } catch {
        setError("Couldn’t unlock the album. Check the admin password.");
      } finally {
        setPending(false);
      }
    }}>
      <h1 className="font-serif text-4xl">Album admin</h1>
      <label className="grid gap-2">Photo admin password
        <input required type="password" autoComplete="current-password" value={key} onChange={(event) => setKey(event.target.value)} className="rounded-md border bg-white p-2" />
      </label>
      <button disabled={pending} className="rounded-full bg-butter-200 px-4 py-2">{pending ? "Unlocking…" : "Unlock editor"}</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
