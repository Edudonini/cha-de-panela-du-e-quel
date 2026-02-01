import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/auth";
import { z } from "zod";

const BUCKET_NAME = "gift-images";

// Schema para cada item
const itemSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  store_url: z.string().url().nullable().optional(),
  category: z.string().nullable().optional(),
  price_suggested_cents: z.number().int().min(0),
  is_group_gift: z.boolean(),
  goal_cents: z.number().int().positive().nullable().optional(),
  status: z.enum(["active", "delivered", "archived"]).default("active"),
});

// Schema para o bulk import
const bulkImportSchema = z.object({
  items: z.array(itemSchema).min(1).max(50), // Máximo 50 itens por vez
});

// Função para baixar imagem e fazer upload para Supabase Storage
async function uploadImageToStorage(
  imageUrl: string,
  itemIndex: number
): Promise<string | null> {
  try {
    // Baixar a imagem
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      console.error(`Falha ao baixar imagem ${itemIndex}: ${response.status}`);
      return null;
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const buffer = await response.arrayBuffer();

    // Determinar extensão do arquivo
    let extension = "jpg";
    if (contentType.includes("png")) extension = "png";
    else if (contentType.includes("webp")) extension = "webp";
    else if (contentType.includes("gif")) extension = "gif";

    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const fileName = `item-${timestamp}-${randomId}.${extension}`;

    // Upload para Supabase Storage
    const { data, error } = await supabaseAdmin()
      .storage.from(BUCKET_NAME)
      .upload(fileName, buffer, {
        contentType,
        upsert: false,
      });

    if (error) {
      console.error(`Erro ao fazer upload da imagem ${itemIndex}:`, error);
      return null;
    }

    // Retornar URL pública
    const {
      data: { publicUrl },
    } = supabaseAdmin().storage.from(BUCKET_NAME).getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error(`Erro ao processar imagem ${itemIndex}:`, error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const validated = bulkImportSchema.parse(body);

    const results: {
      success: any[];
      errors: { index: number; title: string; error: string }[];
    } = {
      success: [],
      errors: [],
    };

    // Processar cada item
    for (let i = 0; i < validated.items.length; i++) {
      const item = validated.items[i];

      try {
        // Validação: goal_cents obrigatório se is_group_gift
        if (item.is_group_gift && !item.goal_cents) {
          results.errors.push({
            index: i,
            title: item.title,
            error: "goal_cents é obrigatório para itens vaquinha",
          });
          continue;
        }

        if (!item.is_group_gift && item.goal_cents) {
          results.errors.push({
            index: i,
            title: item.title,
            error: "goal_cents não deve ser definido para itens normais",
          });
          continue;
        }

        // Processar imagem se fornecida
        let finalImageUrl = item.image_url;
        if (item.image_url) {
          const uploadedUrl = await uploadImageToStorage(item.image_url, i);
          if (uploadedUrl) {
            finalImageUrl = uploadedUrl;
          } else {
            // Se falhar o upload, manter a URL original
            console.warn(
              `Mantendo URL original para item ${i}: ${item.title}`
            );
          }
        }

        // Inserir no banco
        const { data, error } = await supabaseAdmin()
          .from("gift_items")
          .insert({
            title: item.title,
            description: item.description || null,
            image_url: finalImageUrl || null,
            store_url: item.store_url || null,
            category: item.category || null,
            price_suggested_cents: item.price_suggested_cents,
            is_group_gift: item.is_group_gift,
            goal_cents: item.is_group_gift ? item.goal_cents : null,
            status: item.status,
          })
          .select()
          .single();

        if (error) {
          results.errors.push({
            index: i,
            title: item.title,
            error: error.message,
          });
        } else {
          results.success.push(data);
        }
      } catch (itemError: any) {
        results.errors.push({
          index: i,
          title: item.title,
          error: itemError.message || "Erro desconhecido",
        });
      }
    }

    return NextResponse.json({
      message: `Importação concluída: ${results.success.length} sucesso, ${results.errors.length} erros`,
      total: validated.items.length,
      successCount: results.success.length,
      errorCount: results.errors.length,
      success: results.success,
      errors: results.errors,
    });
  } catch (error: any) {
    console.error("Erro no bulk import:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Erro ao importar itens" },
      { status: error.message === "Não autorizado" ? 401 : 500 }
    );
  }
}
