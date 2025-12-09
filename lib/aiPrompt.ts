import { VehicleFormData } from "./validators";

export function generateEvaluationPrompt(data: VehicleFormData) {
    const imagesSection = data.imageUrls?.length
        ? `Fotos:\n${data.imageUrls.join("\n")}`
        : "Fotos: Nenhuma foto fornecida.";

    return `
Você é um avaliador profissional de veículos com mais de 20 anos de experiência no mercado automotivo brasileiro.

Analise TODOS os dados abaixo e gere:
- Preço sugerido de venda
- Faixa de preço (mín – máx)
- Estimativa do valor FIPE com raciocínio (não tem acesso à FIPE real)
- Explicação de como chegou na estimativa da FIPE
- Fatores de valorização
- Fatores de desvalorização
- Análise das fotos
- Riscos ou problemas detectados
- Recomendações que alteram o preço
- Confiança final da avaliação (%)

Dados do veículo:
Marca: ${data.marca}
Modelo: ${data.modelo}
Versão: ${data.versao}
Ano fabricação: ${data.ano_fabricacao}
Ano modelo: ${data.ano_modelo}
Categoria: ${data.categoria}
Motor: ${data.motor}
Potência: ${data.cv || "N/A"} cv
Combustível: ${data.combustivel}
Câmbio: ${data.cambio}
Tração: ${data.tracao}
Quilometragem: ${data.km} km
Número de donos: ${data.donos}
Possui sinistro: ${data.sinistro ? "Sim" : "Não"}
Revisões em dia: ${data.revisoes ? "Sim" : "Não"}
Manual + chave reserva: ${data.manual_chave ? "Sim" : "Não"}
Estado dos pneus: ${data.pneus}
Pintura original: ${data.pintura ? "Sim" : "Não"}
Interior conservado: ${data.interior ? "Sim" : "Não"}
Histórico de manutenção: ${data.historico || "Nenhum informado"}
Modificações: ${data.modificacoes || "Nenhuma informada"}
Observações adicionais: ${data.obs || "Nenhuma"}

${imagesSection}

Responda SOMENTE este JSON:
{
  "valor_sugerido": number,
  "faixa_preco": { "min": number, "max": number },
  "fipe_estimado": number,
  "explicacao_fipe": string,
  "motivos_valorizacao": string[],
  "motivos_desvalorizacao": string[],
  "analise_fotos": string[],
  "riscos_identificados": string[],
  "ajustes_preco_recomendados": string[],
  "confianca": number
}
`;
}
