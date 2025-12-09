import { NextResponse } from "next/server";
import { groq } from "@/lib/groq";
import { vehicleFormSchema, evaluationResponseSchema } from "@/lib/validators";
import { generateEvaluationPrompt } from "@/lib/aiPrompt";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        // We expect 'evaluation_id' to be passed now, instead of just raw form data
        // Or we can support both for backward compatibility, but strictly we need evaluation_id to verify payment
        const { evaluation_id } = body;

        if (!evaluation_id) {
            return NextResponse.json({ error: "Evaluation ID is required" }, { status: 400 });
        }

        // Fetch evaluation from DB to get vehicle data and check payment
        const { data: evaluation, error: dbError } = await supabase
            .from("evaluations")
            .select("*")
            .eq("id", evaluation_id)
            .single();

        if (dbError || !evaluation) {
            return NextResponse.json({ error: "Evaluation not found" }, { status: 404 });
        }

        // Check Payment Status
        if (evaluation.payment_status !== "approved") {
            return NextResponse.json({
                error: "Payment required",
                details: "Você precisa realizar o pagamento para ver a avaliação."
            }, { status: 402 }); // 402 Payment Required
        }

        const data = evaluation.vehicle_data;
        const prompt = generateEvaluationPrompt(data);

        // Call Groq API
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.2,
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0]?.message?.content;

        if (!content) {
            throw new Error("Falha ao obter resposta da IA");
        }

        let parsedContent;
        try {
            parsedContent = JSON.parse(content);
        } catch (e) {
            console.error("Erro ao fazer parse do JSON da IA:", content);
            return NextResponse.json(
                { error: "Resposta da IA inválida" },
                { status: 500 }
            );
        }

        // Save AI response to DB
        const { error: updateError } = await supabase
            .from("evaluations")
            .update({ ai_response: parsedContent })
            .eq("id", evaluation_id);

        if (updateError) {
            console.error("Failed to save AI response:", updateError);
        }

        return NextResponse.json(parsedContent);

    } catch (error) {
        console.error("Erro na avaliação:", error);
        return NextResponse.json(
            { error: "Erro interno no servidor", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
