"use client";

import { useEffect, useState } from "react";
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
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
  const { toast } = useToast();

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
    setIsDialogOpen(true);
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
          {items.map((item) => (
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
                  {item.reservations.length > 0 && (
                    <div>
                      <span className="text-muted-foreground">Reservas: </span>
                      <span className="font-medium">{item.reservations.length}</span>
                    </div>
                  )}
                  {item.contributions.length > 0 && (
                    <div>
                      <span className="text-muted-foreground">Contribuições: </span>
                      <span className="font-medium">{item.contributions.length}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image_url">URL da Imagem</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, image_url: e.target.value })
                    }
                  />
                </div>
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
