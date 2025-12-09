"use client";

import { VehicleForm } from "@/components/VehicleForm";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { EvaluationResponse } from "@/lib/validators";

export default function EvaluatePage() {
    const router = useRouter();
    const supabase = createClient();

    const handleSuccess = async (data: EvaluationResponse, vehicleData: any) => {
        // Save to Supabase
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { data: evaluation, error } = await supabase
                .from("evaluations")
                .insert({
                    user_id: user.id,
                    vehicle_data: vehicleData,
                    ai_response: data,
                    payment_status: "pending", // Default
                })
                .select()
                .single();

            if (error) {
                console.error("Error saving evaluation:", error);
                // Handle error (maybe show toast)
            } else if (evaluation) {
                router.push(`/dashboard/results/${evaluation.id}`);
            }
        } else {
            // Fallback for unauthenticated (shouldn't happen in protected route)
            console.error("User not authenticated");
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Nova Avaliação</h1>
            <VehicleForm onSuccess={handleSuccess} />
        </div>
    );
}
