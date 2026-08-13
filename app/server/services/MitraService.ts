import bcrypt from "bcryptjs";
import { MitraRepository } from "@/app/server/repositories/MitraRepository";
import { UserRepository } from "@/app/server/repositories/UserRepository";
import { encryptSensitive } from "@/app/lib/crypto";
import { registrasiMitraSchema, type RegistrasiMitraInput } from "@/app/server/validators/mitra";
import { logger } from "@/app/lib/logger";

export class DuplicateEmailError extends Error {
  constructor() {
    super("Email sudah terdaftar");
  }
}

export const MitraService = {
  async register(input: RegistrasiMitraInput) {
    const data = registrasiMitraSchema.parse(input);

    const existing = await UserRepository.findByEmail(data.email);
    if (existing) throw new DuplicateEmailError();

    const passwordHash = await bcrypt.hash(data.password, 12);
    const noRekeningEnc = encryptSensitive(data.noRekening);

    if (data.jenis === "jasa") {
      const user = await MitraRepository.createMitraJasaUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        passwordHash,
        namaUsaha: data.namaUsaha,
        noKtpNib: data.noKtpNib,
        noRekeningEnc,
      });
      return { id: user.id, email: user.email };
    }

    const user = await MitraRepository.createMitraPenginapanUser({
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordHash,
      namaUsaha: data.namaUsaha,
      noKtpNib: data.noKtpNib,
      noRekeningEnc,
    });
    return { id: user.id, email: user.email };
  },

  listPending() {
    return Promise.all([MitraRepository.listPendingJasa(), MitraRepository.listPendingPenginapan()]).then(
      ([jasa, penginapan]) => ({ jasa, penginapan })
    );
  },

  async verifikasi(jenis: "jasa" | "penginapan", mitraId: string, keputusan: "AKTIF" | "REJECTED") {
    const result =
      jenis === "jasa"
        ? await MitraRepository.setStatusJasa(mitraId, keputusan)
        : await MitraRepository.setStatusPenginapan(mitraId, keputusan);
    logger.info("mitra_verifikasi", { jenis, mitraId, keputusan });
    return result;
  },

  getOwnMitraJasa(userId: string) {
    return MitraRepository.getMitraJasaByUserId(userId);
  },
  getOwnMitraPenginapan(userId: string) {
    return MitraRepository.getMitraPenginapanByUserId(userId);
  },
};
