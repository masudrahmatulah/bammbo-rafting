# 24 — Definition of Done

Pemilik DoD universal — berlaku semua task.

## Checklist "Selesai"
- [ ] Kriteria terima fitur terkait terpenuhi (lihat `docs/23_ACCEPTANCE_CRITERIA.md`).
- [ ] Semua test hijau (`npm run test` dan, bila relevan, `npm run test:e2e`) — lihat `docs/13_TESTING.md`.
- [ ] Tanpa regresi pada fitur lain yang sudah ada.
- [ ] Sesuai konvensi struktur & penamaan (`docs/12_PROJECT_STRUCTURE.md`).
- [ ] Tidak melanggar guardrail (`docs/20_GUARDRAILS.md`) maupun aturan keamanan (`docs/21_SECURITY_RULES.md`).
- [ ] Tidak ada rahasia hard-code, tidak ada log yang membocorkan data sensitif.
