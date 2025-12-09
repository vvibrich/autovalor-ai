import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, CreditCard } from "lucide-react";

export default async function PaymentsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: payments } = await supabase
        .from("payments")
        .select("*, evaluations(vehicle_data)")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "approved":
                return <Badge className="bg-green-500">Aprovado</Badge>;
            case "pending":
                return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pendente</Badge>;
            case "cancelled":
                return <Badge variant="destructive">Cancelado</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Histórico de Pagamentos</h2>

            <div className="grid gap-4">
                {payments && payments.length > 0 ? (
                    payments.map((payment) => (
                        <Card key={payment.id}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="space-y-1">
                                    <CardTitle className="text-base font-medium">
                                        {payment.evaluations?.vehicle_data?.marca} {payment.evaluations?.vehicle_data?.modelo}
                                    </CardTitle>
                                    <CardDescription>
                                        {new Date(payment.created_at).toLocaleDateString()} às {new Date(payment.created_at).toLocaleTimeString()}
                                    </CardDescription>
                                </div>
                                {getStatusBadge(payment.status)}
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-bold">{formatCurrency(payment.amount)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                                        <span className="capitalize">{payment.payment_method}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="text-muted-foreground">Nenhum pagamento encontrado.</p>
                )}
            </div>
        </div>
    );
}
