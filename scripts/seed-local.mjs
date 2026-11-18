// Builds data/guests.local.json from data/guest-list.csv for local testing,
// plus data/sheet-import.csv (all columns the Google Sheet needs) for File > Import.
// Keeps RSVP answers already recorded locally, unless run with --reset (`npm run seed -- --reset`).
import { readFileSync, writeFileSync, existsSync } from "fs";

const reset = process.argv.includes("--reset");

const csvPath = existsSync("data/guest-list.csv") ? "data/guest-list.csv" : "data/guest-list.example.csv";
const lines = readFileSync(csvPath, "utf8").trim().split(/\r?\n/);
const header = lines.shift().split(",").map((h) => h.trim().toLowerCase());
const col = (row, name) => (row[header.indexOf(name)] ?? "").trim();

const outPath = "data/guests.local.json";
const previous = !reset && existsSync(outPath) ? JSON.parse(readFileSync(outPath, "utf8")) : [];
const prevById = new Map(previous.map((g) => [g.id, g]));

const guests = lines.filter(Boolean).map((line) => {
  const row = line.split(",");
  const id = col(row, "id");
  const prev = prevById.get(id) ?? {};
  return {
    id,
    name: col(row, "name"),
    party: col(row, "party") || id,
    attending: prev.attending ?? "",
    nightBefore: prev.nightBefore ?? "",
    dietary: prev.dietary ?? "",
    message: prev.message ?? "",
    updatedAt: prev.updatedAt ?? "",
  };
});

writeFileSync(outPath, JSON.stringify(guests, null, 2));
console.log(`Seeded ${guests.length} guests from ${csvPath} -> ${outPath}${reset ? " (answers cleared)" : ""}`);

// Sheet import file: the original columns plus the empty RSVP columns the Apps Script writes to.
const rsvpCols = ["Attending", "Night Before", "Dietary", "Message", "Updated At"];
const original = readFileSync(csvPath, "utf8").trim().split(/\r?\n/);
const sheetCsv = [
  original[0].trim() + "," + rsvpCols.join(","),
  ...original.slice(1).filter(Boolean).map((l) => l.trim() + ",".repeat(rsvpCols.length)),
].join("\n");
writeFileSync("data/sheet-import.csv", sheetCsv + "\n");
console.log("Wrote data/sheet-import.csv for the Google Sheet");
