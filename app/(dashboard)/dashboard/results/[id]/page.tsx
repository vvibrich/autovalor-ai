import { createClient } from "@/lib/supabase/server";
import { ResultCard } from "@/components/ResultCard";
import { Button } from "@/components/ui/button";
import { PayButton } from "@/components/PayButton";
import { AIAutoTrigger } from "@/components/AIAutoTrigger";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        console.log("ResultPage: No user found, redirecting");
        redirect("/auth/login");
    }

    console.log("ResultPage: Fetching evaluation", id, "for user", user.id);

    const { data: evaluation, error } = await supabase
        .from("evaluations")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("ResultPage: Supabase error details:", JSON.stringify(error, null, 2));
    }

    if (!evaluation) {
        console.log("ResultPage: Evaluation not found (null data)");
    } else {
        console.log("ResultPage: Evaluation found", evaluation.id);
    }

    if (error || !evaluation) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <h1 className="text-2xl font-bold">Avaliação não encontrada</h1>
                <p className="text-muted-foreground">Não foi possível carregar os dados desta avaliação.</p>
                <Link href="/dashboard">
                    <Button variant="outline">Voltar ao Dashboard</Button>
                </Link>
            </div>
        );
    }

    // Check if user owns the evaluation
    if (evaluation.user_id !== user.id) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <h1 className="text-2xl font-bold">Acesso Negado</h1>
                <p className="text-muted-foreground">Você não tem permissão para ver esta avaliação.</p>
                <Link href="/dashboard">
                    <Button variant="outline">Voltar ao Dashboard</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Resultado da Avaliação</h1>
                    <p className="text-muted-foreground">
                        {evaluation.vehicle_data.marca} {evaluation.vehicle_data.modelo} - {evaluation.vehicle_data.versao}
                    </p>
                </div>
            </div>

            {evaluation.ai_response ? (
                <ResultCard result={evaluation.ai_response} />
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4 border rounded-lg p-8 bg-muted/20">
                    <h2 className="text-xl font-bold">Avaliação em Processamento</h2>
                    <p className="text-muted-foreground text-center max-w-md">
                        {evaluation.payment_status === 'approved'
                            ? "Seu pagamento foi confirmado! A inteligência artificial está analisando seu veículo. Por favor, aguarde alguns instantes e recarregue a página."
                            : "Aguardando confirmação de pagamento para iniciar a análise."}
                    </p>
                    {evaluation.payment_status === 'approved' && (
                        <AIAutoTrigger evaluationId={evaluation.id} paymentStatus={evaluation.payment_status} />
                    )}
                    {evaluation.payment_status !== 'approved' && (
                        <PayButton evaluationId={evaluation.id} />
                    )}
                </div>
            )}
        </div>
    );
}
