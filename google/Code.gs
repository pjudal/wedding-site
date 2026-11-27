/**
 * RSVP backend for the wedding site. Paste into the guest-list Google Sheet:
 * Extensions > Apps Script. Setup steps are in README.md ("Connect the Google Sheet").
 *
 * Sheet tab "Guests", row 1 headers (any order, extra columns are fine):
 *   ID | Name | Nickname (optional) | Party | Side | Role | Relationship | Attending | Night Before | Dietary | Message | Updated At
 * A "Log" tab is created automatically and gets one row per submission (full history).
 *
 * Script property SECRET must match GOOGLE_SCRIPT_SECRET on Vercel.
 */

const FIELD_TO_HEADER = {
  id: 'ID',
  name: 'Name',
  nickname: 'Nickname',
  party: 'Party',
  attending: 'Attending',
  nightBefore: 'Night Before',
  dietary: 'Dietary',
  message: 'Message',
  updatedAt: 'Updated At',
};

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ error: 'bad request' });
  }
  const secret = PropertiesService.getScriptProperties().getProperty('SECRET');
  if (!secret || body.secret !== secret) return json_({ error: 'unauthorized' });

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sheet = SpreadsheetApp.getActive().getSheetByName('Guests');
    if (!sheet) return json_({ error: 'no Guests tab' });
    if (body.action === 'list') return json_({ guests: readGuests_(sheet) });
    if (body.action === 'save') return json_(save_(sheet, body.updates || []));
    return json_({ error: 'unknown action' });
  } finally {
    lock.releaseLock();
  }
}

function columns_(sheet) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  const cols = {};
  Object.keys(FIELD_TO_HEADER).forEach(function (field) {
    const i = field === 'nickname'
      ? headers.findIndex((header) => header.trim().toLowerCase() === 'nickname')
      : headers.indexOf(FIELD_TO_HEADER[field]);
    if (i === -1 && field === 'nickname') return;
    if (i === -1) throw new Error('Missing column: ' + FIELD_TO_HEADER[field]);
    cols[field] = i;
  });
  return cols;
}

function readGuests_(sheet) {
  const cols = columns_(sheet);
  const rows = sheet.getDataRange().getValues().slice(1);
  let added = false;
  const guests = rows
    .map(function (row, r) {
      if (!String(row[cols.name]).trim()) return null;
      // Give new rows an ID automatically so you can just type names into the sheet.
      if (!String(row[cols.id]).trim()) {
        row[cols.id] = 'G' + Utilities.getUuid().slice(0, 6);
        sheet.getRange(r + 2, cols.id + 1).setValue(row[cols.id]);
        added = true;
      }
      const g = {};
      Object.keys(cols).forEach(function (f) {
        g[f] = String(row[cols[f]]);
      });
      return g;
    })
    .filter(Boolean);
  if (added) SpreadsheetApp.flush();
  return guests;
}

// Stops guest-typed text like "=HYPERLINK(...)" from becoming a formula.
function safe_(v) {
  const s = String(v == null ? '' : v);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function save_(sheet, updates) {
  const cols = columns_(sheet);
  const values = sheet.getDataRange().getValues();
  const now = new Date();
  const ss = SpreadsheetApp.getActive();
  let logSheet = ss.getSheetByName('Log');
  if (!logSheet) {
    logSheet = ss.insertSheet('Log');
    logSheet.appendRow(['Timestamp', 'ID', 'Name', 'Attending', 'Night Before', 'Dietary', 'Message']);
  }

  updates.forEach(function (u) {
    for (let r = 1; r < values.length; r++) {
      if (String(values[r][cols.id]) !== String(u.id)) continue;
      const rowNum = r + 1;
      sheet.getRange(rowNum, cols.attending + 1).setValue(safe_(u.attending));
      sheet.getRange(rowNum, cols.nightBefore + 1).setValue(safe_(u.nightBefore));
      sheet.getRange(rowNum, cols.dietary + 1).setValue(safe_(u.dietary));
      sheet.getRange(rowNum, cols.message + 1).setValue(safe_(u.message));
      sheet.getRange(rowNum, cols.updatedAt + 1).setValue(now);
      logSheet.appendRow([now, safe_(u.id), safe_(values[r][cols.name]), safe_(u.attending),
        safe_(u.nightBefore), safe_(u.dietary), safe_(u.message)]);
      break;
    }
  });
  return { ok: true };
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
