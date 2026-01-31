import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/auth";
import { z } from "zod";

const cancelReservationSchema = z.object({
  reservation_id: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { reservation_id } = cancelReservationSchema.parse(body);

    const { data, error } = await supabaseAdmin()
      .from("gift_reservations")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", reservation_id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Erro ao cancelar reserva:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Erro ao cancelar reserva" },
      { status: error.message === "Não autorizado" ? 401 : 500 }
    );
  }
}
