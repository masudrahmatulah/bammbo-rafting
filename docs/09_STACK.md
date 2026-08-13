# 09 — Stack

Pemilik daftar teknologi & versi.

| Lapisan | Teknologi | Versi |
|---|---|---|
| Runtime | Node.js | 20 LTS |
| Framework fullstack | Next.js (App Router) | 15 |
| Bahasa | TypeScript | 5 |
| UI | React | 19 |
| Styling | Tailwind CSS | 3 |
| ORM | Prisma | 5 |
| Database | PostgreSQL | 16 |
| Auth | NextAuth.js | 5 (beta/Auth.js) |
| Payment gateway | Midtrans (Snap API) | v2 |
| Email transaksional | Resend | terbaru stabil |
| Object storage | S3-compatible (mis. Cloudflare R2/Supabase Storage) | — |
| Validasi | Zod | 3 |
| Unit test | Vitest | terbaru stabil |
| E2E test | Playwright | terbaru stabil |
| Hosting app | Vercel | — |
| Hosting DB | Supabase / Neon (managed PostgreSQL) | — |

## Teknologi Terlarang
- **jQuery** — tidak dibutuhkan di atas React; menambah bundle size tanpa manfaat.
- **React class component** — proyek konsisten pakai function component + hooks.
- **Raw SQL string di luar migrasi terkontrol** — semua query lewat Prisma untuk mencegah SQL injection & menjaga tipe konsisten dengan `docs/07_DATA_MODEL.md`.
