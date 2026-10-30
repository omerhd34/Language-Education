/**
 * Optional helper to seed CEFR levels (A1–C2).
 * Run after migrate: npx tsx prisma/seed-levels.ts
 */
import "dotenv/config";
import { getPrisma } from "../lib/server/prisma";

const levels = [
  { code: "A1", name: "Beginner", sortOrder: 1 },
  { code: "A2", name: "Elementary", sortOrder: 2 },
  { code: "B1", name: "Intermediate", sortOrder: 3 },
  { code: "B2", name: "Upper Intermediate", sortOrder: 4 },
  { code: "C1", name: "Advanced", sortOrder: 5 },
  { code: "C2", name: "Proficiency", sortOrder: 6 },
];

async function main() {
  const prisma = getPrisma();

  for (const level of levels) {
    await prisma.level.upsert({
      where: { code: level.code },
      update: {
        name: level.name,
        sortOrder: level.sortOrder,
      },
      create: level,
    });
  }

  console.log("Seeded CEFR levels A1–C2");
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await getPrisma().$disconnect();
  });
