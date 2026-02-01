import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { z } from "zod";

const cancelSchema = z.object({
  guest_name: z.string().min(1, "Nome é obrigatório"),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reservation_id } = await params;

    if (!reservation_id || !z.string().uuid().safeParse(reservation_id).success) {
      return NextResponse.json(
        { error: "ID de reserva inválido" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { guest_name } = cancelSchema.parse(body);

    // Buscar a reserva para validar
    const { data: reservation, error: fetchError } = await supabaseAdmin()
      .from("gift_reservations")
      .select("id, guest_name, status")
      .eq("id", reservation_id)
      .single();

    if (fetchError || !reservation) {
      return NextResponse.json(
        { error: "Reserva não encontrada" },
        { status: 404 }
      );
    }

    // Validar se o nome confere (case-insensitive)
    if (reservation.guest_name.toLowerCase().trim() !== guest_name.toLowerCase().trim()) {
      return NextResponse.json(
        { error: "Nome não confere com a reserva" },
        { status: 403 }
      );
    }

    // Verificar se já está cancelada
    if (reservation.status === "cancelled") {
      return NextResponse.json(
        { error: "Esta reserva já foi cancelada" },
        { status: 400 }
      );
    }

    // Cancelar a reserva
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

    return NextResponse.json({ ok: true, reservation: data });
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
      { status: 500 }
    );
  }
}
