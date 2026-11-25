// Download every guest photo from R2 into data/photos-export/ (git-ignored).
//   npm run photos:download
// Needs R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET in .env.local.
// Safe to re-run: files already downloaded are skipped. Hidden photos go into a "hidden" subfolder.
import { AwsClient } from "aws4fetch";
import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } = process.env;
if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET) {
  console.error("Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY and R2_BUCKET in .env.local first.");
  process.exit(1);
}

const aws = new AwsClient({ accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY, service: "s3", region: "auto" });
const base = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET}`;
const out = path.join(process.cwd(), "data", "photos-export");

const keys = [];
let token = "";
do {
  const url = new URL(base);
  url.searchParams.set("list-type", "2");
  if (token) url.searchParams.set("continuation-token", token);
  const res = await aws.fetch(url.toString());
  const xml = await res.text();
  if (!res.ok) throw new Error(`List failed: ${res.status} ${xml.slice(0, 300)}`);
  for (const m of xml.matchAll(/<Key>([^<]+)<\/Key>/g)) keys.push(m[1]);
  const next = /<NextContinuationToken>([^<]+)<\/NextContinuationToken>/.exec(xml);
  token = /<IsTruncated>true<\/IsTruncated>/.test(xml) && next ? next[1].replace(/&amp;/g, "&") : "";
} while (token);

const hidden = new Set(keys.filter((k) => k.startsWith("hidden/")).map((k) => k.slice(7)));
const stamp = (ms) => {
  // Philippine time, file-name friendly: 2027-03-21_17-05-09
  const d = new Date(ms + 8 * 3600_000).toISOString();
  return `${d.slice(0, 10)}_${d.slice(11, 19).replace(/:/g, "-")}`;
};

let got = 0;
let skipped = 0;
for (const key of keys) {
  const m = /^photos\/((\d{13})-[a-z0-9]{8})--([A-Za-z0-9_-]*)\.(\w+)$/.exec(key);
  if (!m) continue;
  const [, id, ms, nameB64, ext] = m;
  const who = Buffer.from(nameB64, "base64url").toString("utf8").replace(/[^\p{L}\p{N} .'-]/gu, "").trim();
  const dir = hidden.has(id) ? path.join(out, "hidden") : out;
  const file = path.join(dir, `${stamp(Number(ms))}${who ? `_${who}` : ""}_${id.slice(14)}.${ext}`);
  if (existsSync(file)) {
    skipped++;
    continue;
  }
  const res = await aws.fetch(`${base}/${key}`);
  if (!res.ok) {
    console.error(`  failed: ${key} (${res.status})`);
    continue;
  }
  await mkdir(dir, { recursive: true });
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
  got++;
  if (got % 25 === 0) console.log(`  ${got} downloaded...`);
}
console.log(`Done: ${got} downloaded, ${skipped} already there. Folder: ${out}`);
