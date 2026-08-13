import Link from "next/link";

const FEATURES = [
  {
    icon: "🚣",
    title: "Rafting & River Tubing",
    desc: "Susuri arus sungai Loksado dengan rakit bambu tradisional atau ban tubing bersama pemandu lokal berpengalaman.",
  },
  {
    icon: "🏡",
    title: "Penginapan Nyaman",
    desc: "Pilih homestay & penginapan terbaik di sekitar Loksado, dipesan langsung dari mitra terverifikasi.",
  },
  {
    icon: "⚡",
    title: "Booking Instan",
    desc: "Pesan, bayar online via Midtrans, dan dapatkan konfirmasi otomatis dalam hitungan detik.",
  },
];

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-32 -right-10 h-96 w-96 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-24 text-center sm:px-6 sm:py-32">
          <span className="inline-block rounded-full bg-white/15 px-4 py-1 text-sm font-medium text-white backdrop-blur">
            Loksado, Hulu Sungai Selatan
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Petualangan Sungai Bambu,
            <br className="hidden sm:block" /> Dipesan Sekali Klik
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-teal-50">
            Booking online bamboo rafting, river tubing &amp; penginapan terbaik di Loksado —
            aman, cepat, dan mendukung langsung ekonomi mitra lokal.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/katalog"
              className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-teal-700 shadow-lg shadow-teal-900/20 transition hover:bg-teal-50"
            >
              Lihat Katalog
            </Link>
            <Link
              href="/daftar-mitra"
              className="rounded-full border border-white/40 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Daftar Sebagai Mitra
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-2xl">
                {f.icon}
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
