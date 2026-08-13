import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl py-20 text-center">
      <h1 className="text-4xl font-bold text-emerald-800">Bammbo Rafting</h1>
      <p className="mt-4 text-lg text-neutral-600">
        Booking online bamboo rafting, river tubing &amp; penginapan di Loksado.
      </p>
      <Link
        href="/katalog"
        className="mt-8 inline-block rounded bg-emerald-700 px-6 py-3 text-white hover:bg-emerald-800"
      >
        Lihat Katalog
      </Link>
    </div>
  );
}
