import { NextRequest, NextResponse } from "next/server";
import { signSession } from "@/lib/admin/session";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { passcode } = body;

    const expectedPasscode = process.env.ADMIN_PASSCODE;

    if (!expectedPasscode) {
      return NextResponse.json(
        { error: "Configuração de admin não encontrada" },
        { status: 500 }
      );
    }

    if (passcode !== expectedPasscode) {
      return NextResponse.json(
        { error: "Passcode incorreto" },
        { status: 401 }
      );
    }

    const token = signSession();
    const cookieStore = await cookies();

    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro no login admin:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
