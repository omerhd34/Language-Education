import { jsonSuccess } from "@/lib/server/apiResponse";

export async function GET() {
  return jsonSuccess({ status: "ok" });
}
