import bcrypt from "bcryptjs";
import { UserRepository } from "@/app/server/repositories/UserRepository";
import { registerSchema, type RegisterInput } from "@/app/server/validators/auth";

export class DuplicateEmailError extends Error {
  constructor() {
    super("Email sudah terdaftar");
  }
}

export const AuthService = {
  async register(input: RegisterInput) {
    const data = registerSchema.parse(input);

    const existing = await UserRepository.findByEmail(data.email);
    if (existing) throw new DuplicateEmailError();

    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await UserRepository.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordHash,
      role: "wisatawan",
    });

    return { id: user.id, name: user.name, email: user.email, role: user.role };
  },

  async verifyCredentials(email: string, password: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return null;
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  },
};
