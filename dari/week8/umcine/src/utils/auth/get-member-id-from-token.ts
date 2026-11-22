interface AccessTokenPayload {
  sub?: string | number;
}

export function getMemberIdFromToken(
  accessToken: string | null,
): number | null {
  if (!accessToken) {
    return null;
  }

  try {
    const payloadPart = accessToken.split(".")[1];

    if (!payloadPart) {
      return null;
    }

    const normalized = payloadPart
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const padded = normalized.padEnd(
      Math.ceil(normalized.length / 4) * 4,
      "=",
    );

    const payload = JSON.parse(
      atob(padded),
    ) as AccessTokenPayload;

    const memberId = Number(payload.sub);

    if (
      !Number.isInteger(memberId) ||
      memberId <= 0
    ) {
      return null;
    }

    return memberId;
  } catch {
    return null;
  }
}