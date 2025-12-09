import fetch from "node-fetch";

// Usage: npx tsx scripts/simulate_webhook.ts <PAYMENT_ID> <STATUS>
// Example: npx tsx scripts/simulate_webhook.ts 123456789 approved

const paymentId = process.argv[2];
const status = process.argv[3] || "approved";

if (!paymentId) {
    console.error("Please provide a Mercado Pago Payment ID.");
    console.log("Usage: npx tsx scripts/simulate_webhook.ts <PAYMENT_ID> [approved|cancelled]");
    process.exit(1);
}

async function run() {
    console.log(`Simulating webhook for Payment ID: ${paymentId} with status: ${status}`);

    // Note: This script assumes your dev server is running on localhost:3000
    // It bypasses the signature check if your webhook logic allows it (or you might need to adjust the webhook to be lenient in dev)
    // Actually, our webhook implementation fetches the payment status from MP using the ID.
    // So for this to work, the payment ID must be REAL (exist in MP Sandbox).

    // IF you want to force an update in Supabase WITHOUT checking MP (mocking completely),
    // you would need a different endpoint or a dev-only flag in the webhook.

    // HOWEVER, if you just want to trigger the webhook logic:
    try {
        const res = await fetch("http://localhost:3000/api/payments/webhook?type=payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "payment.created",
                api_version: "v1",
                data: { id: paymentId },
                date_created: new Date().toISOString(),
                id: 123456,
                live_mode: false,
                type: "payment",
                user_id: "123456"
            }),
        });

        const data = await res.json();
        console.log("Webhook Response:", data);
    } catch (error) {
        console.error("Error calling webhook:", error);
    }
}

run();
