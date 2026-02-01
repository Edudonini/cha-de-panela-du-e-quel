import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Users, CheckCircle2, Wallet } from "lucide-react";

export default async function AdminDashboard() {
  try {
    await requireAdmin();
  } catch {
    redirect("/admin/login");
  }

  // Buscar estatisticas
  const [rsvpData, itemsData, reservationsData, contributionsData, generalContributionsData] = await Promise.all([
    supabaseAdmin().from("guests_rsvp").select("id, attending"),
    supabaseAdmin().from("gift_items").select("id, status"),
    supabaseAdmin().from("gift_reservations").select("id, status").eq("status", "reserved"),
    supabaseAdmin().from("gift_contributions").select("id, amount_cents").not("item_id", "is", null),
    supabaseAdmin().from("gift_contributions").select("id, guest_name, is_anonymous, amount_cents, created_at").is("item_id", null).order("created_at", { ascending: false }),
  ]);

  const totalRsvp = rsvpData.data?.length || 0;
  const attending = rsvpData.data?.filter((r) => r.attending).length || 0;
  const notAttending = rsvpData.data?.filter((r) => !r.attending).length || 0;
  const totalItems = itemsData.data?.length || 0;
  const activeItems = itemsData.data?.filter((i) => i.status === "active").length || 0;
  const totalReservations = reservationsData.data?.length || 0;
  const totalContributions = contributionsData.data?.length || 0;
  const generalContributions = generalContributionsData.data || [];
  const totalGeneralContributionsCents = generalContributions.reduce((sum, c) => sum + c.amount_cents, 0);
  const formatCurrency = (cents: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard Administrativo</h1>
          <p className="text-muted-foreground">
            Visão geral do evento e gerenciamento
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total RSVP</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRsvp}</div>
              <p className="text-xs text-muted-foreground">
                {attending} confirmados, {notAttending} não vão
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Itens</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
              <p className="text-xs text-muted-foreground">
                {activeItems} ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reservas</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReservations}</div>
              <p className="text-xs text-muted-foreground">
                Itens reservados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contribuicoes PIX</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{generalContributions.length}</div>
              <p className="text-xs text-muted-foreground">
                Total: {formatCurrency(totalGeneralContributionsCents)}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento</CardTitle>
              <CardDescription>
                Acoes rapidas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full justify-start">
                <Link href="/admin/itens">
                  <Gift className="mr-2 h-4 w-4" />
                  Gerenciar Itens
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/admin/rsvp">
                  <Users className="mr-2 h-4 w-4" />
                  Ver RSVP
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Contribuicoes PIX Gerais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Contribuicoes PIX Gerais
              </CardTitle>
              <CardDescription>
                Contribuicoes recebidas via PIX
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generalContributions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhuma contribuicao registrada ainda.
                </p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {generalContributions.map((contribution) => (
                    <div
                      key={contribution.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {contribution.is_anonymous ? "Anonimo" : contribution.guest_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(contribution.created_at).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-sm font-medium">
                        {formatCurrency(contribution.amount_cents)}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
