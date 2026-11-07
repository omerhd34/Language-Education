import { NextResponse } from "next/server";
import { handleRouteError, jsonSuccess } from "@/lib/server/apiResponse";
import {
  deleteUserAvatar,
  getUserAvatarBinary,
  updateUserAvatar,
} from "@/lib/server/auth/avatar";
import { getAccessTokenPayload } from "@/lib/server/auth/request";
import { updateAvatarSchema } from "@/validators/auth.schema";

export async function GET(request: Request) {
  try {
    const payload = getAccessTokenPayload(request);
    const avatar = await getUserAvatarBinary(payload.sub);

    return new NextResponse(new Uint8Array(avatar.data), {
      status: 200,
      headers: {
        "Content-Type": avatar.mimeType,
        "Cache-Control": "private, max-age=3600",
        "Last-Modified": avatar.updatedAt.toUTCString(),
      },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const payload = getAccessTokenPayload(request);
    const body: unknown = await request.json();
    const input = updateAvatarSchema.parse(body);
    const user = await updateUserAvatar(payload.sub, input.dataUrl);
    return jsonSuccess({ user });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const payload = getAccessTokenPayload(request);
    const user = await deleteUserAvatar(payload.sub);
    return jsonSuccess({ user });
  } catch (error) {
    return handleRouteError(error);
  }
}
