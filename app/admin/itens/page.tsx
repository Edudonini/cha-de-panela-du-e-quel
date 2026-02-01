"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Loader2, Upload, Link as LinkIcon, X, ChevronDown, ChevronUp, Ban } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type GiftItemWithDetails = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  store_url: string | null;
  category: string | null;
  price_suggested_cents: number;
  is_group_gift: boolean;
  goal_cents: number | null;
  status: "active" | "delivered" | "archived";
  created_at: string;
  updated_at: string;
  reservations: Array<{
    id: string;
    guest_name: string;
    is_anonymous: boolean;
    status: string;
    created_at: string;
  }>;
  contributions: Array<{
    id: string;
    guest_name: string;
    is_anonymous: boolean;
    amount_cents: number;
    created_at: string;
  }>;
};

export default function AdminItensPage() {
  const [items, setItems] = useState<GiftItemWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GiftItemWithDetails | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageMode, setImageMode] = useState<"upload" | "url">("upload");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [cancellingReservation, setCancellingReservation] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const toggleItemExpanded = (itemId: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const handleCancelReservation = async (reservationId: string) => {
    if (!confirm("Tem certeza que deseja cancelar esta reserva?")) return;

    setCancellingReservation(reservationId);
    try {
      const response = await fetch("/api/admin/moderation/cancel-reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservation_id: reservationId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao cancelar reserva");
      }

      toast({
        title: "Reserva cancelada",
        description: "A reserva foi cancelada com sucesso",
      });

      fetchItems();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível cancelar a reserva",
        variant: "destructive",
      });
    } finally {
      setCancellingReservation(null);
    }
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    store_url: "",
    category: "",
    price_suggested_cents: "",
    is_group_gift: false,
    goal_cents: "",
    status: "active" as "active" | "delivered" | "archived",
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/admin/items");
      if (!response.ok) throw new Error("Erro ao buscar itens");
      const data = await response.json();
      setItems(data);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível carregar os itens",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      description: "",
      image_url: "",
      store_url: "",
      category: "",
      price_suggested_cents: "",
      is_group_gift: false,
      goal_cents: "",
      status: "active",
    });
    setPreviewUrl(null);
    setImageMode("upload");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsDialogOpen(true);
  };

  const handleEdit = (item: GiftItemWithDetails) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      image_url: item.image_url || "",
      store_url: item.store_url || "",
      category: item.category || "",
      price_suggested_cents: (item.price_suggested_cents / 100).toString(),
      is_group_gift: item.is_group_gift,
      goal_cents: item.goal_cents ? (item.goal_cents / 100).toString() : "",
      status: item.status,
    });
    setPreviewUrl(item.image_url || null);
    setImageMode(item.image_url ? "url" : "upload");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);

    try {
      // Preview local imediato
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);

      // Upload para o servidor
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await fetch("/api/admin/items/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao fazer upload");
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, image_url: data.url }));
      setPreviewUrl(data.url);

      // Limpar preview local
      URL.revokeObjectURL(localPreview);

      toast({
        title: "Upload concluído",
        description: "Imagem enviada com sucesso!",
      });
    } catch (error: any) {
      toast({
        title: "Erro no upload",
        description: error.message || "Não foi possível enviar a imagem",
        variant: "destructive",
      });
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image_url: "" }));
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este item?")) return;

    try {
      const response = await fetch(`/api/admin/items/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao deletar item");

      toast({
        title: "Item deletado",
        description: "O item foi removido com sucesso",
      });

      fetchItems();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível deletar o item",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description || null,
        image_url: formData.image_url || null,
        store_url: formData.store_url || null,
        category: formData.category || null,
        price_suggested_cents: Math.round(parseFloat(formData.price_suggested_cents.replace(",", ".")) * 100),
        is_group_gift: formData.is_group_gift,
        goal_cents: formData.is_group_gift && formData.goal_cents
          ? Math.round(parseFloat(formData.goal_cents.replace(",", ".")) * 100)
          : null,
        status: formData.status,
      };

      const url = editingItem
        ? `/api/admin/items/${editingItem.id}`
        : "/api/admin/items";
      const method = editingItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao salvar item");
      }

      toast({
        title: "Sucesso",
        description: editingItem ? "Item atualizado!" : "Item criado!",
      });

      setIsDialogOpen(false);
      fetchItems();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível salvar o item",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/admin" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Item
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-8">Gerenciar Itens</h1>

        <div className="grid gap-4">
          {items.map((item) => {
            const activeReservations = item.reservations.filter(r => r.status === "reserved");
            const hasActiveReservations = activeReservations.length > 0;
            const isExpanded = expandedItems.has(item.id);

            return (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {item.title}
                        <Badge variant={item.status === "active" ? "default" : "secondary"}>
                          {item.status}
                        </Badge>
                        {item.is_group_gift && (
                          <Badge variant="outline">Vaquinha</Badge>
                        )}
                      </CardTitle>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Valor sugerido: </span>
                      <span className="font-medium">
                        R$ {(item.price_suggested_cents / 100).toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                    {item.is_group_gift && item.goal_cents && (
                      <div>
                        <span className="text-muted-foreground">Meta: </span>
                        <span className="font-medium">
                          R$ {(item.goal_cents / 100).toFixed(2).replace(".", ",")}
                        </span>
                      </div>
                    )}
                    {item.contributions.length > 0 && (
                      <div>
                        <span className="text-muted-foreground">Contribuições: </span>
                        <span className="font-medium">{item.contributions.length}</span>
                      </div>
                    )}

                    {/* Seção de Reservas Expandível */}
                    {item.reservations.length > 0 && (
                      <Collapsible open={isExpanded} onOpenChange={() => toggleItemExpanded(item.id)}>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="w-full justify-between mt-2 h-auto py-2">
                            <span className="flex items-center gap-2">
                              <span className="text-muted-foreground">Reservas:</span>
                              <Badge variant={hasActiveReservations ? "default" : "secondary"}>
                                {activeReservations.length} ativa{activeReservations.length !== 1 ? "s" : ""}
                              </Badge>
                              {item.reservations.length > activeReservations.length && (
                                <Badge variant="outline">
                                  {item.reservations.length - activeReservations.length} cancelada{item.reservations.length - activeReservations.length !== 1 ? "s" : ""}
                                </Badge>
                              )}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2">
                          <div className="border rounded-md divide-y">
                            {item.reservations.map((reservation) => (
                              <div
                                key={reservation.id}
                                className={`p-3 flex items-center justify-between ${
                                  reservation.status === "cancelled" ? "bg-muted/50" : ""
                                }`}
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">
                                      {reservation.is_anonymous ? "Anônimo" : reservation.guest_name}
                                    </span>
                                    <Badge
                                      variant={reservation.status === "reserved" ? "default" : "secondary"}
                                      className="text-xs"
                                    >
                                      {reservation.status === "reserved" ? "Ativa" : "Cancelada"}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(reservation.created_at).toLocaleDateString("pt-BR", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                </div>
                                {reservation.status === "reserved" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCancelReservation(reservation.id)}
                                    disabled={cancellingReservation === reservation.id}
                                    className="gap-1 text-destructive hover:text-destructive"
                                  >
                                    {cancellingReservation === reservation.id ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      <Ban className="h-3 w-3" />
                                    )}
                                    Cancelar
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Editar Item" : "Novo Item"}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do item de presente
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              {/* Seção de Imagem */}
              <div className="space-y-3">
                <Label>Imagem do Produto</Label>

                {/* Toggle Upload/URL */}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={imageMode === "upload" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setImageMode("upload")}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload
                  </Button>
                  <Button
                    type="button"
                    variant={imageMode === "url" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setImageMode("url")}
                    className="gap-2"
                  >
                    <LinkIcon className="h-4 w-4" />
                    URL Externa
                  </Button>
                </div>

                {/* Upload Mode */}
                {imageMode === "upload" && (
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                      disabled={isUploading}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="w-full justify-start gap-2"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          Selecionar imagem do computador
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Formatos: JPG, PNG, WebP, GIF. Máximo 5MB.
                    </p>
                  </div>
                )}

                {/* URL Mode */}
                {imageMode === "url" && (
                  <Input
                    id="image_url"
                    placeholder="https://exemplo.com/imagem.jpg"
                    value={formData.image_url}
                    onChange={(e) => {
                      setFormData({ ...formData, image_url: e.target.value });
                      setPreviewUrl(e.target.value || null);
                    }}
                  />
                )}

                {/* Preview */}
                {previewUrl && (
                  <div className="relative inline-block">
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.nextElementSibling?.classList.remove("hidden");
                        }}
                        onLoad={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "block";
                          target.nextElementSibling?.classList.add("hidden");
                        }}
                      />
                      <div className="hidden absolute inset-0 flex items-center justify-center text-xs text-muted-foreground text-center p-2">
                        Imagem não carregou (servidor externo pode estar bloqueando)
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>

              {/* URL da Loja */}
              <div className="space-y-2">
                <Label htmlFor="store_url">URL da Loja</Label>
                <Input
                  id="store_url"
                  value={formData.store_url}
                  onChange={(e) =>
                    setFormData({ ...formData, store_url: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_suggested_cents">Valor Sugerido (R$) *</Label>
                <Input
                  id="price_suggested_cents"
                  type="text"
                  placeholder="0,00"
                  value={formData.price_suggested_cents}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d,]/g, "");
                    setFormData({ ...formData, price_suggested_cents: value });
                  }}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_group_gift"
                  checked={formData.is_group_gift}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_group_gift: checked === true })
                  }
                />
                <Label htmlFor="is_group_gift" className="cursor-pointer">
                  É uma vaquinha (item em grupo)
                </Label>
              </div>
              {formData.is_group_gift && (
                <div className="space-y-2">
                  <Label htmlFor="goal_cents">Meta da Vaquinha (R$) *</Label>
                  <Input
                    id="goal_cents"
                    type="text"
                    placeholder="0,00"
                    value={formData.goal_cents}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d,]/g, "");
                      setFormData({ ...formData, goal_cents: value });
                    }}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as "active" | "delivered" | "archived",
                    })
                  }
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                >
                  <option value="active">Ativo</option>
                  <option value="delivered">Entregue</option>
                  <option value="archived">Arquivado</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  editingItem ? "Atualizar" : "Criar"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
