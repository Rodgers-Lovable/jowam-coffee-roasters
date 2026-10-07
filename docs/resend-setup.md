# Resend setup

The order form and both enquiry forms (wholesale, experiences) send email through [Resend](https://resend.com). Each submission produces two emails:

- a notification to the shop inbox (sales@ for orders and wholesale, hello@ for experiences), with reply-to set to the customer
- a confirmation to the customer, with reply-to set to the shop inbox

Everything goes out from `noreply@jowamroasters.com`. The code lives in `src/lib/email.server.ts` (API client), `src/lib/email-templates.ts` (content) and `src/data/enquiry-forms.ts` (which inbox each form goes to).

## 1. Account

1. Sign up at resend.com with a shared business address rather than a personal one.
2. Turn on two-factor authentication under Settings before you do anything else.
3. Only invite people who actually need access. Anyone on the team can create keys.

## 2. Verify the domain

1. Go to Domains, choose Add domain, enter `jowamroasters.com` and pick the region `eu-west-1` (Ireland), the closest to Nairobi.
2. Resend shows a set of DNS records. Add each one at your DNS host exactly as shown:
   - a TXT record at `resend._domainkey` (DKIM, which signs every email)
   - an MX and a TXT record on the `send` subdomain (SPF and bounce handling). They sit on a subdomain, so they don't touch the root domain's existing mail setup.
3. Click Verify. DNS can take anywhere from a few minutes to a few hours. Emails fail with a 403 "domain is not verified" until the status says Verified.

## 3. Add DMARC

DMARC tells inboxes what to do with mail that claims to be from your domain but fails DKIM and SPF. Without it, anyone can spoof `@jowamroasters.com`.

Add this TXT record if you don't already have one:

| Name | Value |
| --- | --- |
| `_dmarc` | `v=DMARC1; p=none; rua=mailto:hello@jowamroasters.com` |

Start with `p=none` so nothing gets blocked while you check the reports. After two clean weeks, change it to `p=quarantine`.

## 4. Turn off tracking

Under the domain's settings, switch off open tracking and click tracking. These emails don't need it, tracking pixels can hurt deliverability, and click tracking rewrites links through Resend's servers.

## 5. Create API keys

Create one key per environment, each with the smallest permission that works:

| Key name | Permission | Domain | Used by |
| --- | --- | --- | --- |
| `jowam-prod` | Sending access | `jowamroasters.com` | the live site |
| `jowam-dev` | Sending access | `jowamroasters.com` | local development |

Never pick Full access. A sending-only key can't read your email logs, change domains or create more keys.

Each key is shown only once. Copy it straight into the place it's stored (next step). Don't paste it into chat, a ticket, the Lovable editor or any file that gets committed, and never give it a `VITE_` prefix, since that would ship it to every visitor's browser.

## 6. Store the keys

Production (Cloudflare Workers) keeps the key as an encrypted secret that only the Worker can read:

```bash
npx wrangler secret put RESEND_API_KEY
```

Paste the `jowam-prod` key when prompted.

For local development, put the `jowam-dev` key in `.env`:

```
RESEND_API_KEY=re_...
```

`.env` is git-ignored. Run `git status` to check it never shows up as a file to commit.

## 7. Abuse protection

The forms already have:

- a hidden honeypot field that bots fill in and people don't
- a per-IP rate limit of 3 submissions a minute (`ORDER_RATE_LIMITER`, `ENQUIRY_RATE_LIMITER` in `wrangler.jsonc`)
- recipients fixed on the server, so nobody can use the forms to email arbitrary addresses
- length limits on every field, with all values HTML-escaped in the emails

Someone could still put a stranger's address in a form to send them a confirmation. The rate limit keeps that small. Check the Resend dashboard now and then for unusual volume, and if it becomes a problem, add Cloudflare Turnstile to the forms.

## 8. If a key leaks

1. Revoke it in Resend under API Keys.
2. Create a replacement with the same settings.
3. Run `npx wrangler secret put RESEND_API_KEY` again (or update `.env` for the dev key).

Nothing in the code changes.

## 9. Test it

1. With the dev key in `.env`, run `npm run dev`, then place an order and send each enquiry form using `delivered@resend.dev` as the customer email. That address accepts mail without delivering it anywhere.
2. Check Emails in the Resend dashboard. You should see two sends per submission.
3. Repeat with your own inbox. Open the message, view the original/headers, and check that DKIM, SPF and DMARC all show `pass`.
4. Send a test to sales@ and hello@ to confirm both inboxes receive mail, since all shop notifications land there.

If the shop email fails, the site doesn't lose the submission. Orders still save to the Sheet and show the customer a message link to send instead. Enquiries show a link that opens the email app with everything filled in.
