# 25 — Release Checklist

Diturunkan dari `docs/22_CHANGE_POLICY.md`. Langkah berurutan.

| # | Langkah | Kriteria Lulus |
|---|---|---|
| 1 | Jalankan test | `npm run test` dan `npm run test:e2e` exit 0, tanpa test di-skip |
| 2 | Validasi migrasi | `npx prisma migrate deploy --dry-run` (atau jalankan di staging) tanpa error; skema staging cocok `docs/07_DATA_MODEL.md` |
| 3 | Backup database | Snapshot/backup PostgreSQL production terbaru berhasil dibuat sebelum deploy |
| 4 | Deploy | Build production (`npm run build`) sukses, deploy ke Vercel production sukses |
| 5 | Smoke test | Alur booking + bayar (sandbox/limited) end-to-end berhasil di production; panel admin & mitra bisa diakses |
| 6 | Siap rollback | Rencana revert deploy + restore backup dikonfirmasi tersedia sebelum lanjut ke lalu lintas penuh |

**Rollback:** revert ke deploy sebelumnya via Vercel + restore backup database bila migrasi bermasalah. Rincian gerbang manusia untuk operasi irreversibel: `docs/22_CHANGE_POLICY.md`.
