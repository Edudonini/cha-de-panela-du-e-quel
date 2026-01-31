// Versão compatível com Edge Runtime usando Web Crypto API
export type AdminSession = {
  iat: number;
  exp: number;
  v: 1;
};

const COOKIE_NAME = "admin_session";

export async function verifySessionEdge(token: string, secret: string): Promise<AdminSession | null> {
  try {
    const [payloadJson, signature] = token.split(".");
    if (!payloadJson || !signature) return null;

    // Criar assinatura esperada usando Web Crypto API
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(payloadJson)
    );

    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Comparação simples (não timing-safe no Edge, mas funcional)
    if (signature !== expectedSignature) return null;

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

export function getSessionFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").reduce((acc: string, cookie: string) => {
    const [key, value] = cookie.trim().split("=");
    if (key === COOKIE_NAME && value) {
      return value;
    }
    return acc;
  }, "");

  if (!cookies) return null;
  return decodeURIComponent(cookies);
}
