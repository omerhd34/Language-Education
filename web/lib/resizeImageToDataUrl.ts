const MAX_SIZE_PX = 256;
const JPEG_QUALITY = 0.85;
const MAX_INPUT_BYTES = 8_000_000;

export async function resizeImageFileToDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("INVALID_IMAGE_TYPE");
  }

  if (file.size > MAX_INPUT_BYTES) {
    throw new Error("IMAGE_TOO_LARGE");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(
    1,
    MAX_SIZE_PX / Math.max(bitmap.width, bitmap.height),
  );
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("CANVAS_UNSUPPORTED");
  }

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  if (!dataUrl.startsWith("data:image/jpeg;base64,")) {
    throw new Error("ENCODE_FAILED");
  }

  return dataUrl;
}
