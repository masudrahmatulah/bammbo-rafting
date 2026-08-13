#!/usr/bin/env bash
# validate.sh — Gerbang konsistensi VCBD (Hukum 2 & 4 diuji, bukan diharapkan).
# Jalankan dari ROOT proyek (tempat CLAUDE.md, INDEX.md, dan docs/ berada).
# Dipanggil di akhir Fase 3 dan setiap Mode Pembaruan.
#
# Memeriksa:
#   1. _MANIFEST.json ada & JSON valid
#   2. Setiap rujukan docs/NN_NAME.md resolve (tak ada dangling reference)
#   3. Tak ada blok skema (| Kolom | Tipe |) di luar 07  -> deteksi salin-fakta (Hukum 2)
#   4. Setiap pemilik di canonical_owners punya file dokumen yang hadir
#   5. CLAUDE.md tidak membengkak (Hukum 3)
#   6. Dokumen pendek harus terdaftar di "collapsed" (stub disengaja, bukan lupa diisi)
#   7. Ke-26 dokumen bernomor 00..25 hadir
#   8. Tak ada sisa penanda "Status: KERANGKA" (kerangka scaffold.py yang belum diisi)
#
# Exit: 1 bila ada [FAIL]; 0 bila hanya [WARN]/[PASS]. WARN = perlu pertimbangan manusia.

set -u
DOCS_DIR="docs"
MANIFEST="${DOCS_DIR}/_MANIFEST.json"
CLAUDE_MAX_LINES=50
SHORT_DOC_LINES=8

fail=0; warn=0; pass=0
FAIL(){ echo "[FAIL] $*"; fail=$((fail+1)); }
WARN(){ echo "[WARN] $*"; warn=$((warn+1)); }
PASS(){ echo "[PASS] $*"; pass=$((pass+1)); }

PY=""; command -v python3 >/dev/null 2>&1 && PY="python3"

# Pra-syarat lokasi
[ -f "CLAUDE.md" ] || FAIL "CLAUDE.md tidak ditemukan — jalankan skrip dari root proyek."
[ -f "INDEX.md" ]  || FAIL "INDEX.md tidak ditemukan — jalankan skrip dari root proyek."
[ -d "$DOCS_DIR" ] || { FAIL "folder docs/ tidak ada."; echo; echo "Ringkas: FAIL=$fail WARN=$warn PASS=$pass"; exit 1; }

# 1. Manifest ada & JSON valid
if [ -f "$MANIFEST" ]; then
  if [ -n "$PY" ]; then
    if $PY -c "import json,sys; json.load(open('$MANIFEST'))" 2>/dev/null; then
      PASS "1. _MANIFEST.json valid (JSON OK)."
    else
      FAIL "1. _MANIFEST.json bukan JSON valid."
    fi
  else
    WARN "1. python3 tak tersedia — lewati validasi JSON manifest."
  fi
else
  FAIL "1. ${MANIFEST} tidak ditemukan (state bersama wajib)."
fi

# 2. Dangling reference: setiap docs/NN_NAME.md yang dirujuk harus ada
missing=""
refs=$(grep -rhoE 'docs/[0-9]{2}_[A-Z0-9_]+\.md' . --include='*.md' 2>/dev/null | sort -u)
for r in $refs; do
  [ -f "$r" ] || missing="${missing} ${r}"
done
if [ -n "${missing// }" ]; then
  FAIL "2. Rujukan dangling (file tak ada):${missing}"
else
  PASS "2. Semua rujukan docs/NN_NAME.md resolve."
fi

# 3. Skema di luar 07 (Hukum 2) — header tabel khas skema
dup=$(grep -rliE '\|[[:space:]]*Kolom[[:space:]]*\|[[:space:]]*Tipe[[:space:]]*\||\|[[:space:]]*Column[[:space:]]*\|[[:space:]]*Type[[:space:]]*\|' "$DOCS_DIR" --include='*.md' 2>/dev/null | grep -vE "/07_" || true)
if [ -n "$dup" ]; then
  WARN "3. Tabel berbentuk-skema terdeteksi di luar 07 (kemungkinan salin-fakta):"
  echo "$dup" | sed 's/^/        /'
  echo "       -> ganti dengan rujukan 'lihat docs/07_DATA_MODEL.md' atau pindahkan ke 07."
else
  PASS "3. Tak ada blok skema di luar 07."
fi

# 4. canonical_owners hadir
if [ -f "$MANIFEST" ] && [ -n "$PY" ]; then
  owners=$($PY - "$MANIFEST" <<'EOF' 2>/dev/null
import json,sys
m=json.load(open(sys.argv[1]))
co=m.get("canonical_owners",{})
out=set()
for v in co.values():
    for part in str(v).replace("/"," ").split():
        if part.isdigit(): out.add(part.zfill(2))
print(" ".join(sorted(out)))
EOF
)
  miss_owner=""
  for n in $owners; do
    if ! ls "${DOCS_DIR}/${n}_"*.md >/dev/null 2>&1; then miss_owner="${miss_owner} ${n}"; fi
  done
  if [ -n "${miss_owner// }" ]; then
    FAIL "4. Dokumen pemilik (canonical_owners) tak hadir:${miss_owner}"
  else
    PASS "4. Semua pemilik canonical_owners hadir."
  fi
else
  WARN "4. Lewati cek canonical_owners (manifest/python3 tak tersedia)."
fi

# 5. CLAUDE.md ramping
cl=$(wc -l < CLAUDE.md 2>/dev/null | tr -d ' ')
if [ -n "$cl" ] && [ "$cl" -gt "$CLAUDE_MAX_LINES" ]; then
  WARN "5. CLAUDE.md = ${cl} baris (> ${CLAUDE_MAX_LINES}). Hukum 3: pangkas ke inti + pointer."
else
  PASS "5. CLAUDE.md ramping (${cl:-?} baris)."
fi

# 6. Dokumen pendek harus terdaftar di collapsed
collapsed=""
if [ -f "$MANIFEST" ] && [ -n "$PY" ]; then
  collapsed=$($PY - "$MANIFEST" <<'EOF' 2>/dev/null
import json,sys
m=json.load(open(sys.argv[1]))
print(" ".join(str(x).zfill(2) for x in m.get("collapsed",[])))
EOF
)
fi
short_unmarked=""
for f in "${DOCS_DIR}"/[0-9][0-9]_*.md; do
  [ -f "$f" ] || continue
  n=$(basename "$f" | cut -c1-2)
  lines=$(wc -l < "$f" | tr -d ' ')
  if [ "$lines" -lt "$SHORT_DOC_LINES" ]; then
    case " $collapsed " in *" $n "*) : ;; *) short_unmarked="${short_unmarked} ${n}(${lines}b)";; esac
  fi
done
if [ -n "${short_unmarked// }" ]; then
  WARN "6. Dokumen pendek TAK terdaftar di collapsed (lupa diisi atau daftarkan):${short_unmarked}"
else
  PASS "6. Semua dokumen pendek terdaftar di collapsed (atau tak ada)."
fi

# 7. Ke-26 dokumen bernomor 00..25 hadir
miss_num=""
for i in $(seq -w 0 25); do
  if ! ls "${DOCS_DIR}/${i}_"*.md >/dev/null 2>&1; then miss_num="${miss_num} ${i}"; fi
done
if [ -n "${miss_num// }" ]; then
  FAIL "7. Dokumen bernomor hilang:${miss_num}"
else
  PASS "7. Ke-26 dokumen 00..25 hadir."
fi

# 8. Sisa penanda kerangka scaffold.py (dokumen belum diisi penyusun)
left=$(grep -rl "Status: KERANGKA" "$DOCS_DIR" CLAUDE.md --include='*.md' 2>/dev/null || true)
if [ -n "$left" ]; then
  FAIL "8. Dokumen masih KERANGKA (belum diisi; hapus penanda setelah mengisi):"
  echo "$left" | sed 's/^/        /'
else
  PASS "8. Tak ada sisa penanda kerangka."
fi

echo
echo "Ringkas: FAIL=${fail}  WARN=${warn}  PASS=${pass}"
[ "$fail" -gt 0 ] && { echo "Status: GAGAL — bereskan [FAIL] sebelum serah terima."; exit 1; }
[ "$warn" -gt 0 ] && { echo "Status: LULUS DENGAN CATATAN — tinjau [WARN]."; exit 0; }
echo "Status: LULUS BERSIH."
exit 0
