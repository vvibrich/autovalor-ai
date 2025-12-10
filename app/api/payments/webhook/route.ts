import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { MercadoPagoConfig, Payment, MerchantOrder } from "mercadopago";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});


export const runtime = "nodejs";

export async function POST(request: Request) {
    try {
        const url = new URL(request.url);
        const topic = url.searchParams.get("topic") || url.searchParams.get("type");
        const id = url.searchParams.get("id") || url.searchParams.get("data.id");

        if (!id) {
            return NextResponse.json({ received: true });
        }

        let paymentStatus = "pending";
        let externalReference = null;
        let paymentId = id;

        if (topic === "payment") {
            const payment = new Payment(client);
            const paymentData = await payment.get({ id: id });
            paymentStatus = paymentData.status || "pending";
            externalReference = paymentData.external_reference;
            paymentId = paymentData.id?.toString() || id;
        } else if (topic === "merchant_order") {
            const order = new MerchantOrder(client);
            const orderData = await order.get({ merchantOrderId: id });
            // Merchant order logic is complex, usually we look at payments inside it
            // For simplicity, we might just wait for the 'payment' notification which MP also sends
            // But let's try to get status if possible
            if (orderData.order_status === "paid") {
                paymentStatus = "approved";
            }
            externalReference = orderData.external_reference;
        }

        // Map status
        let localStatus = "pending";
        if (paymentStatus === "approved") localStatus = "approved";
        else if (paymentStatus === "cancelled" || paymentStatus === "rejected") localStatus = "cancelled";

        if (externalReference) {
            // Update by vehicle_id (stored in external_reference)
            // First, update or insert payment record
            // We might have multiple payments for one vehicle if user tries multiple times
            // Let's update the most recent one or insert a new one if needed

            // Actually, simpler: Update evaluations table directly if approved
            if (localStatus === "approved") {
                await supabaseAdmin
                    .from("evaluations")
                    .update({ payment_status: "approved" })
                    .eq("id", externalReference);

                // Also update payments table for history
                // We try to find a pending payment for this vehicle or insert a new one
                const { data: existingPayment } = await supabaseAdmin
                    .from("payments")
                    .select("id")
                    .eq("vehicle_id", externalReference)
                    .eq("status", "pending")
                    .order("created_at", { ascending: false })
                    .limit(1)
                    .single();

                if (existingPayment) {
                    await supabaseAdmin
                        .from("payments")
                        .update({
                            status: "approved",
                            mercado_pago_id: paymentId
                        })
                        .eq("id", existingPayment.id);
                } else {
                    // Insert new record if not found (e.g. direct checkout without previous record)
                    // We need user_id though. Ideally we fetch it from evaluation
                    const { data: evaluation } = await supabaseAdmin
                        .from("evaluations")
                        .select("user_id")
                        .eq("id", externalReference)
                        .single();

                    if (evaluation) {
                        await supabaseAdmin.from("payments").insert({
                            user_id: evaluation.user_id,
                            vehicle_id: externalReference,
                            status: "approved",
                            mercado_pago_id: paymentId,
                            amount: 9.90, // We should get this from MP data ideally
                            payment_method: "checkout_pro"
                        });
                    }
                }
            }
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
