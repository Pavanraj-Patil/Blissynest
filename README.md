# Blissynest

A boutique online gifting store — Next.js 16 (App Router) + TypeScript +
Tailwind v4, backed by MySQL via Prisma 7. Auth is NextAuth v5, payments are
Razorpay, images are Cloudflare R2, shipping labels are Shiprocket.

See [SETUP_AND_DEPLOYMENT.md](./SETUP_AND_DEPLOYMENT.md) for everything
needed to run this locally, wire up the third-party services, and deploy it.

```bash
npm install
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
