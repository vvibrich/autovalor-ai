"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

interface AIAutoTriggerProps {
    evaluationId: string;
    paymentStatus: string;
}

export function AIAutoTrigger({ evaluationId, paymentStatus }: AIAutoTriggerProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [message, setMessage] = useState("Verificando pagamento...");

    useEffect(() => {
        const checkAndTrigger = async () => {
            const urlStatus = searchParams.get("collection_status");
            const isApproved = paymentStatus === "approved" || urlStatus === "approved";

            if (isApproved && !isAnalyzing) {
                setIsAnalyzing(true);
                setMessage("Pagamento confirmado! Iniciando análise da IA...");

                try {
                    const res = await fetch("/api/evaluate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ evaluation_id: evaluationId }),
                    });

                    if (res.ok) {
                        setMessage("Análise concluída! Atualizando...");
                        router.refresh();
                    } else {
                        console.error("AI Trigger Failed");
                        setMessage("Erro na análise. Tente recarregar.");
                        setIsAnalyzing(false);
                    }
                } catch (error) {
                    console.error("AI Trigger Error:", error);
                    setMessage("Erro de conexão. Tente recarregar.");
                    setIsAnalyzing(false);
                }
            }
        };

        checkAndTrigger();
    }, [evaluationId, paymentStatus, searchParams, isAnalyzing, router]);

    if (!isAnalyzing && paymentStatus !== "approved" && searchParams.get("collection_status") !== "approved") {
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">{message}</p>
        </div>
    );
}
