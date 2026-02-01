import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/auth";
import { z } from "zod";

// Helper para aceitar URL válida, string vazia ou null
const optionalUrl = z.preprocess(
  (val) => (val === "" ? null : val),
  z.string().url().nullable().optional()
);

const createItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  image_url: optionalUrl,
  store_url: optionalUrl,
  category: z.string().nullable().optional(),
  price_suggested_cents: z.number().int().min(0),
  is_group_gift: z.boolean(),
  goal_cents: z.number().int().positive().nullable().optional(),
  status: z.enum(["active", "delivered", "archived"]).default("active"),
});

export async function GET() {
  try {
    await requireAdmin();

    const { data: items, error } = await supabaseAdmin()
      .from("gift_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Buscar reservas e contribuições para cada item
    const itemsWithDetails = await Promise.all(
      (items || []).map(async (item) => {
        const [reservations, contributions] = await Promise.all([
          supabaseAdmin()
            .from("gift_reservations")
            .select("id, guest_name, is_anonymous, status, created_at")
            .eq("item_id", item.id),
          supabaseAdmin()
            .from("gift_contributions")
            .select("id, guest_name, is_anonymous, amount_cents, created_at")
            .eq("item_id", item.id),
        ]);

        return {
          ...item,
          reservations: reservations.data || [],
          contributions: contributions.data || [],
        };
      })
    );

    return NextResponse.json(itemsWithDetails);
  } catch (error: any) {
    console.error("Erro ao buscar itens:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao buscar itens" },
      { status: error.message === "Não autorizado" ? 401 : 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const validated = createItemSchema.parse(body);

    // Validação: goal_cents obrigatório se is_group_gift
    if (validated.is_group_gift && !validated.goal_cents) {
      return NextResponse.json(
        { error: "goal_cents é obrigatório para itens vaquinha" },
        { status: 400 }
      );
    }

    if (!validated.is_group_gift && validated.goal_cents) {
      return NextResponse.json(
        { error: "goal_cents não deve ser definido para itens normais" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin()
      .from("gift_items")
      .insert({
        ...validated,
        goal_cents: validated.is_group_gift ? validated.goal_cents : null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Erro ao criar item:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Erro ao criar item" },
      { status: error.message === "Não autorizado" ? 401 : 500 }
    );
  }
}
