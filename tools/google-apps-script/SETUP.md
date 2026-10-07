# Student register (Google Sheet) + course emails (Brevo)

How it fits together:

```
Website form ──► Google Apps Script ──► Google Sheet "Shiva Swarodaya · Students"   (the student database, Ma's copy)
                         │
                         └──► Brevo (first name + email only) ──► welcome email + 8 daily emails
Brevo unsubscribe ──► Apps Script ──► marks the row "Unsubscribed" + adds email and date to the "Unsubscribed" tab
Every night ──► dailyCleanup() applies the retention rules in the Privacy policy
Contact form ──► Apps Script ──► "Messages" tab + notification email
```

Do everything while signed in as **swarodayashiva@gmail.com**, with two-step sign-in turned on.

## 1. The Google Sheet and script (about 15 minutes)

1. Create a Google Sheet named **Shiva Swarodaya · Students**. Leave it private (do not share or publish it). **File → Settings → Time zone: (GMT+05:30) India Standard Time.**
2. In the Sheet: **Extensions → Apps Script**. Delete what is there, paste the whole of `Code.gs`, save.
3. **Project Settings (gear) → Script properties → Add**:
   - `BREVO_API_KEY`: from Brevo (step 2 below)
   - `BREVO_LIST_ID`: the number of the Brevo list (step 2)
   - `NOTIFY_EMAIL`: swarodayashiva@gmail.com
   - `HOOK_TOKEN`: any long random text, e.g. 30 letters and numbers
4. **Deploy → New deployment → Web app**. Execute as: *Me*. Who has access: *Anyone*. Deploy, allow the permissions, and copy the **Web app URL**.
5. In the script editor, choose the function **setupDailyCleanup** from the list at the top and press **Run** once (allow the permissions). This schedules the nightly clean-up.
6. Send the Web app URL to Claude (or paste it into `formEndpoint` in `src/data/site.ts`). The tabs "Registrations", "Messages" and "Unsubscribed" are created when first needed.

If you change the script later: **Deploy → Manage deployments → Edit → Version: New version**, so the URL stays the same.

## 2. Brevo (about 20 minutes, plus waiting for domain checks)

1. Create the account with swarodayashiva@gmail.com; turn on two-step sign-in.
2. **Contacts → Lists → Create a list** "Meet your Swara". Note its ID number (BREVO_LIST_ID).
3. **SMTP & API → API keys → Generate a new API key** (BREVO_API_KEY). Keep it only in the script properties.
4. **Senders, domains & dedicated IPs → Domains → Add a domain**: shivaswarodaya.com. Brevo shows DNS records (Brevo code, DKIM, DMARC). Add them where the domain's DNS is managed, then press *Authenticate*.
5. **Senders → Add a sender**: e.g. *Ma Shakti Devpriya · Shiva Swarodaya* `namaste@shivaswarodaya.com`.
6. **Automations → Create**: trigger *Contact added to list "Meet your Swara"* → welcome email → wait 1 day → Day 1 … Day 8. Claude will write the emails.
7. Needed for the "Unsubscribed" tab: **Transactional/Marketing → Settings → Webhooks → Add**: URL = the Web app URL followed by `?hook=brevo&token=` and your HOOK_TOKEN; event *Unsubscribed*.

## 3. Your own email address on the domain (free)

Brevo sends emails but does not provide an inbox. For `namaste@shivaswarodaya.com` to receive and reply:

- **Receiving:** forward the address to swarodayashiva@gmail.com. Cloudflare Email Routing (free) does this if the domain's DNS is on Cloudflare; many registrars also offer free forwarding.
- **Replying from Gmail as namaste@…:** Gmail → Settings → Accounts → *Send mail as* → add the address, using Brevo's SMTP relay (Brevo → SMTP & API → SMTP: server, port 587, login and SMTP key). Replies count towards Brevo's 300 emails a day.
- Only one SPF record is allowed per domain. If Cloudflare and Brevo both ask for one, combine them into a single record.

## Retention rules (Privacy policy, section 7)

| Data | Kept | How |
|---|---|---|
| Course registration | Up to 5 years after the last activity (registration date or later status change) | Deleted by the nightly clean-up, and removed from Brevo |
| Someone who unsubscribes | Removed from the Brevo list at once; row deleted from Registrations after 30 days | Nightly clean-up |
| Record of unsubscribing | Email and date only, in the "Unsubscribed" tab, so they are never emailed again | Kept; cleared if they register again (fresh consent) |
| Contact messages | Up to 3 years | Nightly clean-up |
| Web host logs | The host's own period | Not in the Sheet |
| Requests to see, correct or delete data | Answer within 30 days (law: up to 90) | By hand |

When a student joins a later course, re-registering (or updating the date in their row) restarts the 5 years. The periods are set at the top of `Code.gs` (`KEEP`).

## Limits to know

| | Limit (free) | What it means here |
|---|---|---|
| Brevo emails | 300 a day | 9 emails per student (welcome + 8) → about 30 new students a day |
| Brevo automations | 2,000 contacts in total through automations | After about 2,000 students, the paid **Standard** plan is needed to keep the 8-day sequence running |
| Brevo | 1 user; Brevo logo in emails; basic statistics | Fine to start |
| Google Sheet | 10 million cells | Hundreds of thousands of students |
| Apps Script | 20,000 outside calls a day; 100 email recipients a day | Only the contact-form notifications use email here |

Sources: Brevo free-plan limits (help.brevo.com, article 208580669); Brevo data storage (help.brevo.com, article 360001005510); Google Apps Script quotas (developers.google.com/apps-script/guides/services/quotas). Checked 7 October 2026.
