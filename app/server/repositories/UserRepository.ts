import { prisma } from "@/app/lib/prisma";
import type { Role } from "@prisma/client";

export const UserRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },
  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },
  create(data: { name: string; email: string; phone?: string; passwordHash: string; role?: Role }) {
    return prisma.user.create({ data });
  },
};
