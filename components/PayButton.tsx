"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface PayButtonProps {
    evaluationId: string;
}

export function PayButton({ evaluationId }: PayButtonProps) {
    const [loading, setLoading] = useState(false);

    const handlePay = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/payments/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ vehicle_id: evaluationId }),
            });

            const data = await res.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                alert("Erro ao gerar link de pagamento.");
                setLoading(false);
            }
        } catch (error) {
            console.error("Payment error:", error);
            alert("Erro ao processar pagamento.");
            setLoading(false);
        }
    };

    return (
        <Button onClick={handlePay} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Ir para Pagamento
        </Button>
    );
}
