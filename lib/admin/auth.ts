import { cookies } from "next/headers";
import { verifySession } from "@/lib/admin/session";

export async function requireAdmin() {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("admin_session");
  
  if (!adminCookie?.value) {
    throw new Error("Não autorizado");
  }

  const session = verifySession(adminCookie.value);

  if (!session) {
    throw new Error("Não autorizado");
  }

  return session;
}
