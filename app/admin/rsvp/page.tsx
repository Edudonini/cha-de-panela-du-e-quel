"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

type Rsvp = {
  id: string;
  guest_name: string;
  attending: boolean;
  companions_count: number;
  created_at: string;
};

export default function AdminRsvpPage() {
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRsvps();
  }, []);

  const fetchRsvps = async () => {
    try {
      const response = await fetch("/api/admin/rsvp");
      if (!response.ok) throw new Error("Erro ao buscar RSVP");
      const data = await response.json();
      setRsvps(data);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível carregar os RSVPs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const attendingCount = rsvps.filter((r) => r.attending).length;
  const notAttendingCount = rsvps.filter((r) => !r.attending).length;
  const totalCompanions = rsvps
    .filter((r) => r.attending)
    .reduce((sum, r) => sum + r.companions_count, 0);
  const totalGuests = attendingCount + totalCompanions;

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
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/admin" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-8">Lista de RSVP</h1>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{attendingCount}</div>
              <p className="text-xs text-muted-foreground">
                {totalGuests} pessoas no total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Não vão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{notAttendingCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rsvps.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {rsvps.map((rsvp) => (
            <Card key={rsvp.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {rsvp.guest_name}
                    {rsvp.attending ? (
                      <Badge variant="default" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Vai
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <XCircle className="h-3 w-3" />
                        Não vai
                      </Badge>
                    )}
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {new Date(rsvp.created_at).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </CardHeader>
              {rsvp.attending && rsvp.companions_count > 0 && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {rsvp.companions_count} acompanhante{rsvp.companions_count > 1 ? "s" : ""}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {rsvps.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum RSVP registrado ainda.</p>
          </div>
        )}
      </main>
    </div>
  );
}
