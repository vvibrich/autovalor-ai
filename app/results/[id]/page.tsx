"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { EvaluationResponse } from "@/lib/validators";
import { ResultCard } from "@/components/ResultCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function ResultPage() {
    const params = useParams();
    const router = useRouter();
    const [result, setResult] = useState<EvaluationResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const id = params.id as string;
        if (!id) return;

        const savedEvaluations = JSON.parse(localStorage.getItem("evaluations") || "{}");
        const evaluation = savedEvaluations[id];

        if (evaluation) {
            setResult(evaluation);
        } else {
            // Handle not found
            console.error("Evaluation not found");
        }
        setLoading(false);
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!result) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Avaliação não encontrada</h1>
                <Button onClick={() => router.push("/")}>Voltar ao Início</Button>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => router.push("/")}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Nova Avaliação
                    </Button>
                </div>

                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Resultado da Avaliação</h1>
                    <p className="text-muted-foreground">
                        Análise completa realizada pela IA
                    </p>
                </div>

                <ResultCard result={result} />
            </div>
        </main>
    );
}
