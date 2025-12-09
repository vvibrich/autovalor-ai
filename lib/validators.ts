import { z } from "zod";

export const vehicleFormSchema = z.object({
    // Identificação
    marca: z.string().min(2, "Marca é obrigatória"),
    modelo: z.string().min(2, "Modelo é obrigatório"),
    versao: z.string().min(1, "Versão é obrigatória"),
    ano_fabricacao: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
    ano_modelo: z.coerce.number().min(1900).max(new Date().getFullYear() + 2),
    categoria: z.string().min(1, "Categoria é obrigatória"),

    // Mecânica
    motor: z.string().min(1, "Motor é obrigatório"),
    cv: z.coerce.number().optional(),
    combustivel: z.string().min(1, "Combustível é obrigatório"),
    cambio: z.string().min(1, "Câmbio é obrigatório"),
    tracao: z.string().min(1, "Tração é obrigatória"),

    // Estado Geral
    km: z.coerce.number().min(0, "Quilometragem inválida"),
    donos: z.coerce.number().min(1, "Número de donos inválido"),
    sinistro: z.boolean().default(false),
    revisoes: z.boolean().default(false),
    manual_chave: z.boolean().default(false),
    pneus: z.string().min(1, "Estado dos pneus é obrigatório"),
    pintura: z.boolean().default(true), // Pintura original? Sim/Não
    interior: z.boolean().default(true), // Interior conservado? Sim/Não

    // Detalhes
    historico: z.string().optional(),
    modificacoes: z.string().optional(),
    obs: z.string().optional(),

    // Fotos
    imageUrls: z.array(z.string()).max(15, "Máximo de 15 fotos").optional(),
});

export type VehicleFormData = z.infer<typeof vehicleFormSchema>;

export const evaluationResponseSchema = z.object({
    valor_sugerido: z.number(),
    faixa_preco: z.object({
        min: z.number(),
        max: z.number(),
    }),
    fipe_estimado: z.number(),
    explicacao_fipe: z.string(),
    motivos_valorizacao: z.array(z.string()),
    motivos_desvalorizacao: z.array(z.string()),
    analise_fotos: z.array(z.string()),
    riscos_identificados: z.array(z.string()),
    ajustes_preco_recomendados: z.array(z.string()),
    confianca: z.number(),
});

export type EvaluationResponse = z.infer<typeof evaluationResponseSchema>;
