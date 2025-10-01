import crypto from "crypto";

export function generateVerificationToken() {
  const rawToken = `${crypto.randomUUID()}${crypto.randomBytes(24).toString("hex")}`;
  const hash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

  return {
    token: rawToken,
    hashedToken: hash,
    expiresAt,
  };
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function generatePasswordResetToken() {
  const rawToken = `${crypto.randomUUID()}${crypto.randomBytes(24).toString("hex")}`;
  const hash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  return {
    token: rawToken,
    hashedToken: hash,
    expiresAt,
  };
}
