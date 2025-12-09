import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, Car, Calendar, DollarSign } from "lucide-react";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: evaluations } = await supabase
        .from("evaluations")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <Link href="/dashboard/evaluate">
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Nova Avaliação
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Avaliações</CardTitle>
                        <Car className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{evaluations?.length || 0}</div>
                    </CardContent>
                </Card>
                {/* Add more stats cards if needed */}
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-bold">Histórico de Avaliações</h3>
                {evaluations && evaluations.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {evaluations.map((evaluation) => {
                            const vehicle = evaluation.vehicle_data;
                            const result = evaluation.ai_response;
                            return (
                                <Link key={evaluation.id} href={`/dashboard/results/${evaluation.id}`}>
                                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                                        <CardHeader>
                                            <CardTitle>{vehicle.marca} {vehicle.modelo}</CardTitle>
                                            <CardDescription>{vehicle.versao} • {vehicle.ano_modelo}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center gap-2 text-lg font-bold text-primary">
                                                <DollarSign className="h-5 w-5" />
                                                {result ? formatCurrency(result.valor_sugerido) : "Pendente"}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(evaluation.created_at).toLocaleDateString()}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/20 text-center">
                        <Car className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">Nenhuma avaliação encontrada</h3>
                        <p className="text-muted-foreground mb-4">Comece avaliando seu primeiro veículo.</p>
                        <Link href="/dashboard/evaluate">
                            <Button variant="outline">Criar Avaliação</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
