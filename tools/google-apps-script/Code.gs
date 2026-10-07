/**
 * Shiva Swarodaya · registrations and contact messages
 * ------------------------------------------------------
 * Lives inside the Google Sheet "Shiva Swarodaya · Students" (Extensions → Apps Script),
 * owned by the swarodayashiva@gmail.com account. The website sends each form here.
 *
 *  - Meet your Swara registration → new row in the "Registrations" tab, then the
 *    student's email and first name only are added to the Brevo list, which starts
 *    the welcome email and the 8 daily emails.
 *  - Contact form → new row in the "Messages" tab, and a notification email to you.
 *  - Brevo unsubscribe webhook (optional) → marks the student as unsubscribed in the Sheet.
 *
 * Script properties (Project Settings → Script properties):
 *   BREVO_API_KEY   your Brevo API key (never put it in the website code)
 *   BREVO_LIST_ID   the number of the Brevo list "Meet your Swara"
 *   NOTIFY_EMAIL    where contact-form notifications go, e.g. swarodayashiva@gmail.com
 *   HOOK_TOKEN      any long random text; also used in the Brevo webhook URL
 */

const REG_HEADERS = ['Registered (IST)', 'First name', 'Email', 'Country', 'WhatsApp', 'Experience',
  'Consent given', 'Consent text version', 'Page', 'Sent to Brevo', 'Status', 'Status updated'];
const MSG_HEADERS = ['Received (IST)', 'Name', 'Email', 'Topic', 'Message', 'Replied'];
const CONSENT_VERSION = '2026-10-07';

function doPost(e) {
  const p = (e && e.parameter) || {};
  try {
    // Brevo webhook: https://…/exec?hook=brevo&token=HOOK_TOKEN
    if (p.hook === 'brevo') return brevoHook_(e, p);
    if (p.website) return json_({ ok: true });            // honeypot filled in: a bot
    if (p.form === 'contact') return contact_(p);
    return register_(p);
  } catch (err) {
    console.error(err);
    return json_({ ok: false });
  }
}

function register_(p) {
  const email = clean_(p.email).toLowerCase();
  const first = clean_(p.firstname);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !first || p.consent !== 'yes') return json_({ ok: false });

  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const sh = sheet_('Registrations', REG_HEADERS);
    const existing = findRow_(sh, 3, email);
    const row = existing || sh.getLastRow() + 1;
    const prev = existing ? sh.getRange(row, 1, 1, REG_HEADERS.length).getValues()[0] : [];
    const keep = (v, i) => v || prev[i] || '';            // a repeat sign-up keeps details given earlier
    const values = [now_(), first, email, keep(clean_(p.country), 3), keep(clean_(p.whatsapp), 4), keep(clean_(p.experience), 5),
      'Yes', CONSENT_VERSION, clean_(p.page), '', 'Registered', now_()];
    sh.getRange(row, 1, 1, values.length).setValues([values]);

    const sent = toBrevo_(email, first);
    sh.getRange(row, 10).setValue(sent ? 'Yes' : 'Failed: retry');
    return json_({ ok: true });
  } finally { lock.releaseLock(); }
}

function contact_(p) {
  const email = clean_(p.email);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !clean_(p.message)) return json_({ ok: false });
  const sh = sheet_('Messages', MSG_HEADERS);
  sh.appendRow([now_(), clean_(p.name), email, clean_(p.topic), clean_(p.message, 5000), '']);
  const to = PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL');
  if (to) MailApp.sendEmail({ to, replyTo: email, subject: 'Website message: ' + clean_(p.topic),
    body: clean_(p.name) + ' <' + email + '> wrote:\n\n' + clean_(p.message, 5000) + '\n\n(Saved in the Messages tab of the Students sheet.)' });
  return json_({ ok: true });
}

/** Adds or updates the contact in Brevo with email and first name only. */
function toBrevo_(email, first) {
  const props = PropertiesService.getScriptProperties();
  const key = props.getProperty('BREVO_API_KEY'); const list = Number(props.getProperty('BREVO_LIST_ID'));
  if (!key || !list) return false;
  const res = UrlFetchApp.fetch('https://api.brevo.com/v3/contacts', {
    method: 'post', contentType: 'application/json', muteHttpExceptions: true,
    headers: { 'api-key': key, accept: 'application/json' },
    payload: JSON.stringify({ email, attributes: { FIRSTNAME: first }, listIds: [list], updateEnabled: true }),
  });
  const code = res.getResponseCode();
  if (code >= 300) console.error('Brevo ' + code + ': ' + res.getContentText());
  return code < 300;
}

/** Brevo → "Transactional/Marketing webhooks": event "unsubscribed" marks the row. */
function brevoHook_(e, p) {
  const token = PropertiesService.getScriptProperties().getProperty('HOOK_TOKEN');
  if (!token || p.token !== token) return json_({ ok: false });
  const body = JSON.parse((e.postData && e.postData.contents) || '{}');
  const events = Array.isArray(body) ? body : [body];
  const sh = sheet_('Registrations', REG_HEADERS);
  events.forEach((ev) => {
    if (!ev || !ev.email) return;
    const row = findRow_(sh, 3, String(ev.email).toLowerCase());
    if (row && /unsub/i.test(ev.event || '')) sh.getRange(row, 11, 1, 2).setValues([['Unsubscribed', now_()]]);
  });
  return json_({ ok: true });
}

/** Run by hand from the editor: re-sends rows marked "Failed: retry" to Brevo. */
function retryFailed() {
  const sh = sheet_('Registrations', REG_HEADERS);
  const data = sh.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][9]).indexOf('Failed') === 0 && toBrevo_(data[i][2], data[i][1])) sh.getRange(i + 1, 10).setValue('Yes');
  }
}

// ---------- helpers ----------
function sheet_(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(headers); sh.setFrozenRows(1); sh.getRange(1, 1, 1, headers.length).setFontWeight('bold'); }
  return sh;
}
function findRow_(sh, col, value) {
  const last = sh.getLastRow(); if (last < 2) return 0;
  const vals = sh.getRange(2, col, last - 1, 1).getValues();
  for (let i = 0; i < vals.length; i++) if (String(vals[i][0]).toLowerCase() === value) return i + 2;
  return 0;
}
function clean_(v, max) {
  let s = String(v == null ? '' : v).trim().slice(0, max || 200);
  if (/^[=+\-@]/.test(s)) s = "'" + s;                 // stops text being read as a spreadsheet formula
  return s;
}
function now_() { return Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd HH:mm'); }
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
