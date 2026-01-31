import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/auth";
import { z } from "zod";

const updateItemSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  store_url: z.string().url().nullable().optional(),
  category: z.string().nullable().optional(),
  price_suggested_cents: z.number().int().min(0).optional(),
  is_group_gift: z.boolean().optional(),
  goal_cents: z.number().int().positive().nullable().optional(),
  status: z.enum(["active", "delivered", "archived"]).optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const body = await request.json();
    const validated = updateItemSchema.parse(body);

    // Buscar item atual para validação
    const { data: currentItem } = await supabaseAdmin()
      .from("gift_items")
      .select("*")
      .eq("id", id)
      .single();

    if (!currentItem) {
      return NextResponse.json({ error: "Item não encontrado" }, { status: 404 });
    }

    const isGroupGift = validated.is_group_gift ?? currentItem.is_group_gift;

    // Validação: goal_cents obrigatório se is_group_gift
    if (isGroupGift) {
      const goalCents = validated.goal_cents ?? currentItem.goal_cents;
      if (!goalCents) {
        return NextResponse.json(
          { error: "goal_cents é obrigatório para itens vaquinha" },
          { status: 400 }
        );
      }
    }

    if (!isGroupGift && validated.goal_cents !== undefined) {
      return NextResponse.json(
        { error: "goal_cents não deve ser definido para itens normais" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin()
      .from("gift_items")
      .update({
        ...validated,
        goal_cents: isGroupGift ? (validated.goal_cents ?? currentItem.goal_cents) : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Erro ao atualizar item:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Erro ao atualizar item" },
      { status: error.message === "Não autorizado" ? 401 : 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const { error } = await supabaseAdmin()
      .from("gift_items")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao deletar item:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao deletar item" },
      { status: error.message === "Não autorizado" ? 401 : 500 }
    );
  }
}
