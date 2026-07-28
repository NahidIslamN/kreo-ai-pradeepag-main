type JwtPayload = {
  exp?: number;
  [key: string]: unknown;
};

function decodeBase64(base64Value: string): string | null {
  try {
    if (typeof atob === "function") {
      return atob(base64Value);
    }

    if (typeof Buffer !== "undefined") {
      return Buffer.from(base64Value, "base64").toString("utf-8");
    }

    return null;
  } catch {
    return null;
  }
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  if (!token || token.split(".").length < 2) {
    return null;
  }

  const payloadPart = token.split(".")[1];
  const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const decoded = decodeBase64(padded);

  if (!decoded) {
    return null;
  }

  try {
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

export function getTokenExpiryMs(token: string): number | null {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") {
    return null;
  }

  return payload.exp * 1000;
}
