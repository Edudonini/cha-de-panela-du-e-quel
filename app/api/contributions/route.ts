import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { guest_name, is_anonymous, amount_cents } = body;

    if (!guest_name || typeof guest_name !== "string" || !guest_name.trim()) {
      return NextResponse.json(
        { error: "Nome do convidado é obrigatório" },
        { status: 400 }
      );
    }

    if (!amount_cents || typeof amount_cents !== "number" || amount_cents <= 0) {
      return NextResponse.json(
        { error: "Valor da contribuição inválido" },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from("gift_contributions")
      .insert({
        item_id: null,
        guest_name: guest_name.trim(),
        is_anonymous: is_anonymous === true,
        amount_cents: amount_cents,
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao inserir contribuição:", error);
      return NextResponse.json(
        { error: "Erro ao registrar contribuição" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, contribution: data });
  } catch (error) {
    console.error("Erro na API de contribuição:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
