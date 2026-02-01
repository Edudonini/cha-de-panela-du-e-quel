import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/auth";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      );
    }

    // Validar tipo
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de arquivo não permitido. Use JPG, PNG, WebP ou GIF." },
        { status: 400 }
      );
    }

    // Validar tamanho
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Arquivo muito grande. Máximo 5MB." },
        { status: 400 }
      );
    }

    // Gerar nome único para o arquivo
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = `items/${fileName}`;

    // Converter File para ArrayBuffer e depois para Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload para Supabase Storage
    const { data, error } = await supabaseAdmin()
      .storage
      .from("gift-images")
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: "31536000", // 1 ano
        upsert: false,
      });

    if (error) {
      console.error("Erro no upload:", error);
      return NextResponse.json(
        { error: "Erro ao fazer upload da imagem" },
        { status: 500 }
      );
    }

    // Obter URL pública
    const { data: publicUrlData } = supabaseAdmin()
      .storage
      .from("gift-images")
      .getPublicUrl(filePath);

    return NextResponse.json({
      url: publicUrlData.publicUrl,
      path: filePath,
    });
  } catch (error: any) {
    console.error("Erro no upload:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao fazer upload" },
      { status: error.message === "Não autorizado" ? 401 : 500 }
    );
  }
}
