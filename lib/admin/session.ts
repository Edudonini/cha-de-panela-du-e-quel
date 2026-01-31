import { createHmac, timingSafeEqual } from "crypto";

export type AdminSession = {
  iat: number;
  exp: number;
  v: 1;
};

const COOKIE_NAME = "admin_session";
const COOKIE_SECRET = process.env.ADMIN_COOKIE_SECRET!;
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 dias

if (!COOKIE_SECRET) {
  throw new Error("ADMIN_COOKIE_SECRET não configurado");
}

export function signSession(): string {
  const now = Date.now();
  const payload: AdminSession = {
    iat: now,
    exp: now + SESSION_DURATION,
    v: 1,
  };

  const payloadJson = JSON.stringify(payload);
  const signature = createHmac("sha256", COOKIE_SECRET)
    .update(payloadJson)
    .digest("hex");

  return `${payloadJson}.${signature}`;
}

export function verifySession(token: string): AdminSession | null {
  try {
    const [payloadJson, signature] = token.split(".");
    if (!payloadJson || !signature) return null;

    const expectedSignature = createHmac("sha256", COOKIE_SECRET)
      .update(payloadJson)
      .digest("hex");

    // Timing-safe comparison
    if (signature.length !== expectedSignature.length) return null;

    const signaturesMatch = timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );

    if (!signaturesMatch) return null;

    const payload: AdminSession = JSON.parse(payloadJson);

    // Verificar versão
    if (payload.v !== 1) return null;

    // Verificar expiração
    if (Date.now() > payload.exp) return null;

    return payload;
  } catch {
    return null;
  }
}

export function getSessionFromCookie(cookieHeader: string | null): AdminSession | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").reduce((acc: string, cookie: string) => {
    const [key, value] = cookie.trim().split("=");
    if (key === COOKIE_NAME && value) {
      return value;
    }
    return acc;
  }, "");

  if (!cookies) return null;
  return verifySession(decodeURIComponent(cookies));
}
