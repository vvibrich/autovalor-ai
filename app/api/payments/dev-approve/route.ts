import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
    if (process.env.NODE_ENV !== "development") {
        return NextResponse.json({ error: "Not allowed in production" }, { status: 403 });
    }

    try {
        const { payment_id } = await request.json();
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 1. Update Payment Status
        const { data: payment, error: paymentError } = await supabase
            .from("payments")
            .update({ status: "approved" })
            .eq("id", payment_id)
            .eq("user_id", user.id) // Ensure user owns the payment
            .select()
            .single();

        if (paymentError || !payment) {
            console.error("Payment update error:", paymentError);
            throw new Error("Payment not found or update failed");
        }

        // 2. Update Evaluation Status
        const { error: evalError } = await supabase
            .from("evaluations")
            .update({ payment_status: "approved" })
            .eq("id", payment.vehicle_id);

        if (evalError) {
            console.error("Evaluation update error:", evalError);
            throw new Error("Failed to update evaluation status");
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Dev approve error:", error);
        return NextResponse.json({ error: "Failed to approve" }, { status: 500 });
    }
}
