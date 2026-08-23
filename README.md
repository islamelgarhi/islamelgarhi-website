# islamelgarhi.com

Personal site for Islam Elgarhi. Currently a single-page verdict funnel for the book
**Beyond Reasonable Doubt: The Case for Islam** (`/` and `/verdict` render the same page).

Rebuilt 2026-08-21 from the retired Lovable app (`elgarhi-systems.lovable.app`),
pixel-and-word faithful to the original.

## Stack
- Vite + React 18 + TypeScript + Tailwind
- Supabase (`verdicts` table, insert-only from the anon key)
- Deployed on Vercel (project `islamelgarhi-website`, team islam's projects),
  auto-deploys on push to `main` at github.com/islamelgarhi/islamelgarhi-website

## Dev
```bash
npm install
npm run dev   # port 4590
```
`.env` (gitignored) needs `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
(same values live in Vercel project env vars, Production and Preview, marked Sensitive).

## Content rules
- The three verdict options must match the printed ballot in the book WORD FOR WORD.
- No em dashes anywhere in public copy (Islam's standing rule).
- The printed book's QR code resolves to https://islamelgarhi.com/verdict, so that path
  must keep working forever.
- `AMAZON_URL` in `src/App.tsx` is `#` until the book is live on Amazon; swap it at launch.

## DNS / cutover status (2026-08-21)
- Domain registered at IONOS, nameservers ui-dns.*.
- Cutover plan: point A record @ -> 76.76.21.21, CNAME www -> cname.vercel-dns.com,
  after adding islamelgarhi.com + www to the Vercel project's Domains tab.
- Until cutover, production domain still serves the old Lovable app (edge IP 185.158.133.1).
- islamelgarhi.com is DNS-blocked on Islam's home WiFi (Fortinet); test via
  `curl --resolve` / puppeteer host-resolver-rules or cellular.
- 2026-08-21 RESOLVED: `ucwlyqygrvmxxwzkjkbb` was Lovable-managed (Islam's account has no
  access). The `verdicts` table now lives in Islam's OWN Supabase project
  `tzygarqlmdprnokvflyz` (personal-vault, org /MIS) with the same schema and an
  insert-only anon RLS policy. Site env vars (local + Vercel) point there.
  The old Lovable-side table could not be read (insert-only RLS); it almost certainly held
  only Claude's 2 test rows (book unpublished, betas silent), but if any real verdicts were
  submitted pre-2026-08-21 they remain only in the Lovable project. Check inside Lovable's
  data view before deleting. Lovable project deletion = Islam's manual step (permanent).
