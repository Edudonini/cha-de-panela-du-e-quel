import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/auth";
import { z } from "zod";

const deleteContributionSchema = z.object({
  contribution_id: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { contribution_id } = deleteContributionSchema.parse(body);

    const { error } = await supabaseAdmin()
      .from("gift_contributions")
      .delete()
      .eq("id", contribution_id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao deletar contribuição:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Erro ao deletar contribuição" },
      { status: error.message === "Não autorizado" ? 401 : 500 }
    );
  }
}
