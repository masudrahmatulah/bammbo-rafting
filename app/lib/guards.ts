import { auth } from "@/auth";

export async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "admin") throw new Error("Unauthorized");
  return session!;
}

export async function requireMitraJasa() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "mitra_jasa") throw new Error("Unauthorized");
  return session!;
}

export async function requireMitraPenginapan() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "mitra_penginapan") throw new Error("Unauthorized");
  return session!;
}
