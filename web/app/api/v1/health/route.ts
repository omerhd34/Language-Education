import { handleRouteError, jsonSuccess } from "@/lib/server/apiResponse";
import { getPrisma, withPrisma } from "@/lib/server/prisma";

export async function GET() {
  try {
    const db = await withPrisma(async () => {
      const rows = await getPrisma().$queryRaw<Array<{ ok: number | bigint }>>`
        SELECT 1 AS ok
      `;
      return Number(rows[0]?.ok) === 1;
    });

    return jsonSuccess({ status: "ok", db });
  } catch (error) {
    return handleRouteError(error);
  }
}
