import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

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

        // Fetch vehicle data for description
        const { data: evaluation } = await supabase
            .from("evaluations")
            .select("vehicle_data")
            .eq("id", vehicle_id)
            .single();

        const vehicleTitle = evaluation
            ? `Avaliação ${evaluation.vehicle_data.marca} ${evaluation.vehicle_data.modelo}`
            : "Avaliação AutoValorAI";

        const preference = new Preference(client);

        const amount = 9.90;

        console.log("Debug: Creating preference for user:", user.id);
        console.log("Debug: User metadata:", JSON.stringify(user.user_metadata));
        console.log("Debug: Vehicle ID:", vehicle_id);
        console.log("Debug: Access Token exists:", !!process.env.MERCADO_PAGO_ACCESS_TOKEN);
        console.log("Debug: PROJECT_URL:", process.env.PROJECT_URL);

        const cpf = user.user_metadata.cpf ? user.user_metadata.cpf.replace(/\D/g, "") : undefined;

        const preferenceData = {
            body: {
                items: [
                    {
                        id: vehicle_id,
                        title: vehicleTitle,
                        quantity: 1,
                        unit_price: amount,
                        currency_id: "BRL",
                    },
                ],
                payer: {
                    email: user.email!,
                    name: user.user_metadata.name?.split(" ")[0] || "Cliente",
                    surname: user.user_metadata.name?.split(" ").slice(1).join(" ") || "AutoValor",
                    identification: cpf ? {
                        type: "CPF",
                        number: cpf
                    } : undefined
                },
                back_urls: {
                    success: `${process.env.PROJECT_URL}/dashboard/results/${vehicle_id}?status=approved`,
                    failure: `${process.env.PROJECT_URL}/dashboard/evaluate?status=failure`,
                    pending: `${process.env.PROJECT_URL}/dashboard/results/${vehicle_id}?status=pending`,
                },
                auto_return: "approved",
                notification_url: `${process.env.PROJECT_URL}/api/payments/webhook`,
                external_reference: vehicle_id, // Important: We use this to link payment to evaluation
                metadata: {
                    vehicle_id: vehicle_id.toString().slice(0, 5),
                    user_id: user.id
                },
                payment_methods: {
                    excluded_payment_types: [],
                    installments: 1
                }
            },
        };

        console.log("Debug: Preference Payload:", JSON.stringify(preferenceData, null, 2));

        const result = await preference.create(preferenceData);

        // Save initial payment record (optional, but good for tracking attempts)
        // We can use the preference ID or just wait for the webhook.
        // Let's create a pending record so the user sees it in history immediately.
        await supabase.from("payments").insert({
            user_id: user.id,
            vehicle_id: vehicle_id,
            amount: amount,
            status: "pending",
            mercado_pago_id: result.id, // Storing Preference ID temporarily or just for ref
            payment_method: "checkout_pro"
        });

        return NextResponse.json({ url: result.init_point });

    } catch (error: any) {
        console.error("Checkout Error:", error);
        return NextResponse.json({
            error: "Erro ao criar preferência de pagamento",
            details: error.message || String(error),
            cause: error.cause
        }, { status: 500 });
    }
}
