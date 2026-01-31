import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/auth";

export async function GET() {
  try {
    await requireAdmin();

    const { data, error } = await supabaseAdmin()
      .from("guests_rsvp")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error("Erro ao buscar RSVP:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao buscar RSVP" },
      { status: error.message === "Não autorizado" ? 401 : 500 }
    );
  }
}
