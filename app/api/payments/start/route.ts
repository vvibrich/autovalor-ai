import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export const runtime = "nodejs";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { vehicle_id } = await request.json();

        if (!vehicle_id) {
            return NextResponse.json({ error: "Vehicle ID is required" }, { status: 400 });
        }

        // Create Payment in Mercado Pago
        const payment = new Payment(client);

        // Fixed amount for now, could be dynamic
        const amount = 9.90;

        const paymentData = await payment.create({
            body: {
                transaction_amount: amount,
                description: "Avaliação AutoValorAI",
                payment_method_id: "pix",
                payer: {
                    email: user.email!,
                    first_name: user.user_metadata.name?.split(" ")[0] || "Usuário",
                },
                notification_url: `${process.env.PROJECT_URL}/api/payments/webhook`,
            },
        });

        const { id: mp_id, point_of_interaction } = paymentData;
        const qr_code = point_of_interaction?.transaction_data?.qr_code;
        const qr_code_base64 = point_of_interaction?.transaction_data?.qr_code_base64;

        // Save to Supabase
        const { data: localPayment, error } = await supabase
            .from("payments")
            .insert({
                user_id: user.id,
                vehicle_id,
                amount,
                mercado_pago_id: mp_id!.toString(),
                qr_code,
                qr_code_base64,
                status: "pending",
            })
            .select()
            .single();

        if (error) {
            console.error("Supabase error:", error);
            return NextResponse.json({ error: "Failed to save payment" }, { status: 500 });
        }

        return NextResponse.json({
            payment_id: localPayment.id,
            qr_code,
            qr_code_base64,
            mp_id,
        });

    } catch (error) {
        console.error("Payment Start Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
