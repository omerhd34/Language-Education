import {
  handleRouteError,
  jsonSuccess,
} from "@/lib/server/apiResponse";
import { registerUser } from "@/lib/server/auth/service";
import { registerSchema } from "@/validators/auth.schema";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const input = registerSchema.parse(body);
    const result = await registerUser(input);

    return jsonSuccess(result, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
