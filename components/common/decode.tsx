import { Buffer } from "buffer";

export function encodeId(id: any): string {
  const encodedId = Buffer.from(id).toString("base64");
  return encodedId.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeId(encodedId: string): any {
  try {
    const decodedId = Buffer.from(
      encodedId.replace(/-/g, "+").replace(/_/g, "/"),
      "base64"
    ).toString("utf-8");
    return decodedId;
  } catch (error) {
    console.error("Error decoding ID:", error);
    return null;
  }
}