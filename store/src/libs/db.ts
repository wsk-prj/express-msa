import { PrismaClient } from "@/generated/prisma";

// Singleton instance - Hot Reload 대비
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined; // var로 선언해야 globalThis에 제대로 붙음
}

export const db =
  global.prisma ??
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = db;
}
