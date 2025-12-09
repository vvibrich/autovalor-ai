"use client";

import { VehicleForm } from "@/components/VehicleForm";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { VehicleFormData } from "@/lib/validators";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function EvaluatePage() {
    const router = useRouter();
    const supabase = createClient();

    const [isProcessing, setIsProcessing] = useState(false);

    const handleFormSubmit = async (data: VehicleFormData) => {
        setIsProcessing(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                console.error("User not authenticated");
                return;
            }

            // 1. Save to Supabase (Pending)
            const { data: evaluation, error } = await supabase
                .from("evaluations")
                .insert({
                    user_id: user.id,
                    vehicle_data: data,
                    payment_status: "pending",
                })
                .select()
                .single();

            if (error || !evaluation) {
                console.error("Error saving evaluation:", error);
                alert("Erro ao salvar dados. Tente novamente.");
                setIsProcessing(false);
                return;
            }

            // 2. Create Checkout Preference & Redirect
            const res = await fetch("/api/payments/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ vehicle_id: evaluation.id }),
            });

            const checkoutData = await res.json();

            if (!res.ok) {
                console.error("Checkout error:", checkoutData);
                alert("Erro ao iniciar pagamento. Tente novamente.");
                setIsProcessing(false);
                return;
            }

            if (checkoutData.url) {
                // Redirect to Mercado Pago
                window.location.href = checkoutData.url;
            } else {
                alert("Erro: URL de pagamento não gerada.");
                setIsProcessing(false);
            }

        } catch (error) {
            console.error("Flow error:", error);
            setIsProcessing(false);
            alert("Ocorreu um erro inesperado.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto relative">
            <h1 className="text-3xl font-bold mb-6">Nova Avaliação</h1>

            {isProcessing && (
                <div className="absolute inset-0 z-50 bg-background/80 flex flex-col items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <p className="text-lg font-medium">Preparando pagamento...</p>
                    <p className="text-sm text-muted-foreground">Você será redirecionado para o Mercado Pago.</p>
                </div>
            )}

            <VehicleForm
                customSubmit={handleFormSubmit}
                isExternalLoading={isProcessing}
            />
        </div>
    );
}
