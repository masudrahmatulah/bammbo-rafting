# CLAUDE.md

File ini selalu aktif. Untuk hal di luar ini → buka INDEX.md.

## Proyek
Bammbo Rafting — platform booking online bamboo rafting, river tubing & penginapan di Loksado (HSS), dengan bagi hasil ke mitra jasa & penginapan. Detail: docs/00_EXECUTIVE_SUMMARY.md. Scope: docs/02_SCOPE.md.

## Prinsip kerja agen (non-negotiable)
1. Friksi sebanding irreversibilitas.
2. Lapisan deterministik (validasi, constraint, tes) di bawah penalaran.
3. Human-in-the-loop untuk high-stakes (migrasi DB, hapus data, keamanan, rilis).
4. Jangan refactor keputusan yang disengaja diam-diam.
5. Hormati scope (docs/02). Out-of-scope → berhenti & tanya.

## Stack  (sumber: docs/09)
Next.js 15 (App Router) + TypeScript + React 19 + Tailwind, Prisma + PostgreSQL 16, NextAuth, Midtrans (payment). — Terlarang: jQuery, React class component, raw SQL di luar migrasi.

## Struktur & konvensi  (sumber: docs/12)
Logika bisnis di Service layer (`app/server/services`), bukan di Route Handler/Server Action. Akses data lewat Repository/Prisma, tidak langsung di Service. Model PascalCase, kolom DB snake_case.

## Perintah penting  (sumber: docs/11)
`npm run dev` · `npm run test` · `npx prisma migrate dev` ⚠️ · `npx prisma migrate deploy` ⚠️

## Guardrail inti  (penuh: docs/20, 21, 22)
Jangan hard-code rahasia. Jangan nonaktifkan validasi/otorisasi. Jangan ubah persentase bagi hasil mitra berjalan tanpa konfirmasi. Jangan proses webhook Midtrans tanpa verifikasi signature. Jangan hard-delete data bookings/pembayaran/bagi_hasil. Jangan tambah dependency tanpa alasan.

## Alur per-task  (penuh: docs/17, 19)
Baca INDEX.md → muat dokumen relevan → konfirmasi scope → vertical slice → tes (docs/13) → DoD (docs/24).

## Definisi selesai (ringkas; penuh: docs/24)
Kriteria terima terpenuhi + tes hijau + tanpa regresi + sesuai konvensi + tak langgar guardrail.

## Untuk apa pun di luar ini → INDEX.md
