# Blissynest — Setup & Deployment Guide

Everything you need to run this locally, wire up the third-party services it
depends on, and eventually put it on Hostinger. Written to be read top to
bottom once, then used as a reference.

---

## 1. Tech stack, in one paragraph

Next.js 16 (App Router) + TypeScript + Tailwind v4, backed by MySQL via
Prisma 7 (using the MariaDB driver adapter, not the default Postgres one —
see the note in `prisma/schema.prisma`). Auth is NextAuth v5 (email/password
+ Google OAuth). Payments are Razorpay, images are Cloudflare R2, shipping
labels are Shiprocket. It runs as **one persistent Node.js process** (`npm
run start`), not on serverless functions — that's a deliberate choice
documented in `src/lib/db.ts`, and it's why Hostinger (not Vercel) is the
target host.

---

## 2. Prerequisites

- **Node.js 20 or newer** (this repo was built against Node 24; anything
  20+ LTS should work fine — Next.js 16 requires it).
- **npm** (comes with Node).
- **A MySQL database** — locally this can be Docker, a local MySQL install,
  or a free-tier hosted MySQL; in production it's a Hostinger MySQL
  database (see §6).
- **Git**.

---

## 3. Third-party services — what you need, where to get it

The project is designed to run with **all of these unset** — nothing
crashes. Each integration checks whether its keys are present and either
degrades gracefully (shows a clear "not configured" message) or disables
the feature. This means you can get the site running today and add real
keys one at a time as accounts get set up. `.env.example` at the repo root
has the same information inline — treat that file as the source of truth if
this doc and the code ever disagree.

Copy `.env.example` to `.env` and fill in values as you get them:

```bash
cp .env.example .env
```

### Required to run at all

| Variable | What it's for | Where to get it |
|---|---|---|
| `DATABASE_URL` | MySQL connection string | Locally: your own MySQL instance (§4). Production: Hostinger hPanel → **Databases** → your MySQL database → connection details. |
| `AUTH_SECRET` | Signs NextAuth session tokens | Run `npx auth secret` — it writes a value straight into your `.env`. |

Without these two, the app won't start / auth won't work at all. Everything
below is optional for local development and can be added later.

### Payments — Razorpay

| Variable | Where to get it |
|---|---|
| `RAZORPAY_KEY_ID` | Razorpay Dashboard → **Settings → API Keys**. Test-mode keys are available immediately after signup — no business verification needed to start testing. |
| `RAZORPAY_KEY_SECRET` | Same screen. |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay Dashboard → **Settings → Webhooks** → the secret you set when adding the webhook. |

**Webhook URL to register in Razorpay:** `https://<your-domain>/api/webhooks/razorpay`
(on `localhost` you won't be able to receive real webhooks unless you tunnel
with something like ngrok — not needed for normal local dev).

**Without these set:** card/UPI/net-banking checkout shows an inline error
telling the customer to use Cash on Delivery instead. COD checkout works
regardless. See `src/lib/razorpay.ts`.

### Images — Cloudflare R2

| Variable | Where to get it |
|---|---|
| `R2_ACCOUNT_ID` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` / `R2_BUCKET_NAME` | Cloudflare dashboard → R2 → your bucket → **Manage API Tokens**. |
| `R2_PUBLIC_URL` | A custom domain on your Cloudflare zone pointed at the bucket (R2 → bucket → Settings → Custom Domains), e.g. `https://images.yourdomain.com`. The `r2.dev` URL works for quick testing but is rate-limited. |
| `CLOUDFLARE_IMAGE_TRANSFORMS` | Set to `"true"` only once the site's domain is proxied through Cloudflare with Image Transformations enabled for that zone. Leave empty locally/on Hostinger directly — resizing falls back to this app's own `/api/image-proxy`. |

This is the active image backend — see `src/app/api/admin/upload-image-r2/route.ts`.
**Without these set:** the admin image-upload button returns a clear
"Image upload isn't configured yet" error instead of crashing; admins can
still paste an image URL directly as a fallback.

Cloudinary (`CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` /
`CLOUDINARY_API_SECRET`) is kept wired up as a working fallback path (see
`src/app/api/admin/upload-image/route.ts`) but isn't the active one unless
you deliberately point the `ImageUploader` components back at it — you
don't need to set these unless you're reverting to it.

### Shipping — Shiprocket

| Variable | Where to get it |
|---|---|
| `SHIPROCKET_EMAIL` / `SHIPROCKET_PASSWORD` | Your actual Shiprocket account login — **not** a separate API key. Shiprocket's API trades these for a short-lived bearer token internally. |
| `SHIPROCKET_PICKUP_LOCATION` | Shiprocket Dashboard → **Settings → Pickup Addresses** — use the pickup location's name exactly as it appears there. Defaults to `"Primary"` if left unset. |

**Without these set:** order placement silently skips shipment creation —
orders still go through, they just don't get a Shiprocket shipment
automatically. See `src/lib/shiprocket.ts`.

### Login — Google OAuth

| Variable | Where to get it |
|---|---|
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google Cloud Console → **APIs & Services → Credentials** → Create Credentials → OAuth client ID → Application type: **Web application**. |

**Authorized redirect URI to add in Google Cloud Console:**
`https://<your-domain>/api/auth/callback/google` (and
`http://localhost:3000/api/auth/callback/google` for local dev — you can
register both on the same OAuth client).

**Without these set:** the "Continue with Google" button just won't work;
email/password signup and login are unaffected.

### Email — ZeptoMail (or Resend)

| Variable | Notes |
|---|---|
| `ZEPTOMAIL_TOKEN`, `ZEPTOMAIL_REGION` | Recommended path. The "Send Mail Token" from your ZeptoMail agent, plus the region your account is in (`in`/`com`/`eu`/`com.au`/`jp`/`ca`/`sa` — defaults to `in`). |
| `RESEND_API_KEY` | Alternative path — only used when `ZEPTOMAIL_TOKEN` is empty. |
| `EMAIL_FROM` | Required either way. Must be an address on a domain you've verified with whichever provider you're using, e.g. `Blissynest <orders@blissynest.com>`. |
| `TEAM_NOTIFY_EMAIL` | Optional. Where internal notifications (new order, contact message, corporate lead) go; defaults to the support email in Admin → Site Content → Legal & Business. |

Order confirmations, shipping/delivery updates, and password-reset links
all go through whichever of these is configured. **If neither provider is
set, nothing is sent** — messages are printed to the server console
instead, which is handy locally. See `src/lib/email.ts`.

### Public address & search engines

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | The live site's origin, e.g. `https://blissynest.com` (no trailing slash). Used for canonical links, the sitemap, share cards and links inside emails. |
| `ALLOW_SEARCH_INDEXING` | Set to `true` **only on the live production site**. Unset (the default) makes the site tell Google not to index it, so UAT/preview copies stay hidden. Forgetting to set it on the live site means Google will not list you. |

---

## 4. Running it locally

### 4.1 Get a MySQL database running

Easiest path is Docker — one throwaway container, no local MySQL install:

```bash
docker run -d --name blissynest-mysql \
  -e MYSQL_ROOT_PASSWORD=root_dev_pw \
  -e MYSQL_DATABASE=blissynest \
  -e MYSQL_USER=blissynest \
  -e MYSQL_PASSWORD=blissynest_dev_pw \
  -p 3306:3306 \
  mysql:8
```

Then in `.env`:

```
DATABASE_URL="mysql://blissynest:blissynest_dev_pw@localhost:3306/blissynest"
```

(If you'd rather install MySQL directly instead of Docker, that's fine too
— just point `DATABASE_URL` at it the same way.)

### 4.2 Install, migrate, seed

```bash
npm install
npx prisma generate
npx prisma migrate deploy    # applies all committed migrations
npx prisma db seed           # optional — loads the mock catalogue into real rows
```

`npx prisma generate` regenerates the Prisma Client into `src/generated/` —
re-run it any time `prisma/schema.prisma` changes.

### 4.3 Run the dev server

```bash
npm run dev
```

Open `http://localhost:3000`.

### 4.4 Create your first admin account

There's no self-serve way to become an admin — signup always creates a
`CUSTOMER` (deliberately, see `src/app/api/auth/signup/route.ts`). To
promote yourself:

1. Sign up normally on the site.
2. Run `npx prisma studio` (opens a DB browser at `http://localhost:5555`).
3. Open the `User` table, find your row, change `role` from `CUSTOMER` to
   `ADMIN`, save.

---

## 5. Command reference

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Run the production build (needs `npm run build` first) |
| `npm run lint` | ESLint over the whole project |
| `npx tsc --noEmit` | Type-check without emitting files |
| `npx prisma studio` | Visual DB browser/editor at `localhost:5555` |
| `npx prisma migrate dev --name <description>` | Create + apply a new migration (local dev) |
| `npx prisma migrate deploy` | Apply committed migrations (production-safe, no schema drift prompts) |
| `npx prisma generate` | Regenerate the Prisma Client after a schema change |
| `npx prisma db seed` | Re-run the seed script |
| `npx auth secret` | Generate a value for `AUTH_SECRET` |

---

## 6. Deploying to Hostinger

Hostinger's plans differ in what they can run. This app needs a plan with
**Node.js application hosting** (a persistent process, not just static/PHP
hosting) — Hostinger's Business/Cloud shared plans and any VPS plan support
this via hPanel's Node.js app manager. If you're not sure what your plan
includes, check hPanel's sidebar for a **Node.js** or **Website → Advanced
→ Node.js** section; if it's not there, the plan needs upgrading first.
Menu names shift between Hostinger UI versions, so treat the steps below as
the shape of the process rather than exact clicks.

### 6.1 Create the MySQL database

hPanel → **Databases → MySQL Databases** → create a new database + user.
Note the host, port (usually `3306`), database name, username, and
password it gives you — that's your production `DATABASE_URL`:

```
DATABASE_URL="mysql://<user>:<password>@<host>:3306/<dbname>"
```

### 6.2 Get the code onto the server

Two common paths:

- **Git-based deploy**, if your plan supports it (hPanel → your website →
  **Git**) — point it at your GitHub repo and branch, Hostinger pulls it.
- **Manual upload** — `git push` to GitHub as usual, then either `git pull`
  over SSH on the server, or zip the repo (excluding `node_modules` and
  `.next`) and upload via File Manager / SFTP, then unzip.

Either way, `.env` is **not** something you commit or upload — you'll set
the actual values as environment variables in hPanel's Node.js app config
(next step), which is the more secure place for secrets on a shared host.

### 6.3 Set up the Node.js application in hPanel

In hPanel's Node.js section:

1. Create a new Node.js app, pointing it at the folder you deployed to.
2. Set the **Node.js version** to 20 or newer.
3. Set the **application startup file** — for Next.js this is typically
   handled by setting the **run command** to `npm run start` (after a build
   step; see below) rather than pointing at a single JS entry file. If
   Hostinger's UI insists on a specific entry file, check their current
   Node.js hosting docs for the Next.js-specific pattern, since this varies
   by panel version.
4. Add every environment variable from your `.env` (§3) in hPanel's
   **environment variables** UI for this app — `DATABASE_URL`,
   `AUTH_SECRET`, and any of the Razorpay/R2/Shiprocket/Google keys
   you're using in production. **Use production values here, not your
   local test keys** — especially Razorpay (switch from test-mode to
   live-mode keys once you're ready to accept real payments). (NextAuth's
   host-trust setting for non-Vercel hosts is already handled in code —
   see `src/auth.config.ts` — so there's no env var needed for that.)

### 6.4 Install, migrate, build

Via the SSH terminal Hostinger gives you for the app (or hPanel's built-in
terminal), from the project folder:

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
```

`prisma migrate deploy` (not `migrate dev`) is the right command here — it
applies committed migrations without asking interactive questions or
touching migration history, which is what you want against a real
database.

### 6.5 Start the app

Through hPanel's Node.js app manager, start (or restart) the app — it
should run `npm run start` (or whatever run command you configured) and
keep the process alive, restarting it if it crashes. Point your domain at
the app if that isn't automatic.

### 6.6 Update the two things that hardcode `localhost`

These were set up for local dev — update them to your real domain once
it's live:

- **Google Cloud Console** → OAuth client → add
  `https://<your-domain>/api/auth/callback/google` as an authorized
  redirect URI (keep the localhost one too if you still develop locally).
- **Razorpay Dashboard → Webhooks** → add
  `https://<your-domain>/api/webhooks/razorpay` as the webhook URL, using
  the same secret you put in `RAZORPAY_WEBHOOK_SECRET`.

### 6.7 Post-deploy checklist

- [ ] Visit the live site, confirm the homepage and a product page load.
- [ ] Sign up a test account, promote it to admin via `prisma studio`
      pointed at the **production** `DATABASE_URL` (or however hPanel lets
      you reach the production DB — some plans expose phpMyAdmin too).
- [ ] Place a test order with Cash on Delivery — this doesn't need any
      payment keys and proves the checkout → order → stock-decrement path
      works end to end.
- [ ] If Razorpay keys are live, place one small real test payment and
      confirm the webhook fires (check the order's status updates).
- [ ] Confirm image upload works from `/admin` if R2 keys are set.
- [ ] Check `npx prisma studio` (or phpMyAdmin) isn't left reachable from
      the public internet — only use it over SSH tunnel or hPanel's own
      access, never expose port 5555 publicly.

---

## 7. If something doesn't start

- **"Cannot find module '.../generated/prisma/client'"** — run
  `npx prisma generate`; it's gitignored and regenerated from the schema,
  so a fresh clone or fresh deploy always needs this once after `npm install`.
- **Prisma can't connect to the database** — double check `DATABASE_URL`
  has the right host/port for *where the app is actually running* (a
  Docker container's `localhost` isn't the same as your machine's
  `localhost` from inside another container, and a local `.env` value
  won't work once deployed — hPanel's env vars need the production DB's
  own host).
- **Node.js version errors on Hostinger** — check the Node version selector
  in the app settings; Next.js 16 needs 20+, and some Hostinger plans still
  default new apps to an older version.
