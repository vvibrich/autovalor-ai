import { EvaluationResponse } from "@/lib/validators";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, XCircle, AlertTriangle, TrendingUp, TrendingDown, DollarSign, Info } from "lucide-react";

interface ResultCardProps {
    result: EvaluationResponse;
}

export function ResultCard({ result }: ResultCardProps) {
    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-primary/20 shadow-lg md:col-span-2">
                    <CardHeader className="text-center pb-2">
                        <CardDescription>Preço Sugerido de Venda</CardDescription>
                        <CardTitle className="text-5xl font-bold text-primary">
                            {formatCurrency(result.valor_sugerido)}
                        </CardTitle>
                        <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground mt-2">
                            <span>Mín: {formatCurrency(result.faixa_preco.min)}</span>
                            <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                            <span>Máx: {formatCurrency(result.faixa_preco.max)}</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-w-md mx-auto">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Confiança da IA</span>
                                <span>{result.confianca}%</span>
                            </div>
                            <Progress value={result.confianca} className="h-2" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <DollarSign className="h-5 w-5 text-blue-500" />
                            Estimativa FIPE
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold mb-2">
                            {formatCurrency(result.fipe_estimado)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {result.explicacao_fipe}
                        </p>
                    </CardContent>
                </Card>

                {result.riscos_identificados.length > 0 && (
                    <Card className="border-destructive/20 bg-destructive/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-lg text-destructive">
                                <AlertTriangle className="h-5 w-5" />
                                Riscos Identificados
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {result.riscos_identificados.map((item, i) => (
                                    <li key={i} className="text-sm flex items-start gap-2">
                                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-destructive shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <TrendingUp className="h-5 w-5 text-green-500" />
                            Fatores de Valorização
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {result.motivos_valorizacao.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <TrendingDown className="h-5 w-5 text-red-500" />
                            Fatores de Desvalorização
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {result.motivos_desvalorizacao.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                    <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="ajustes">
                    <AccordionTrigger>
                        <div className="flex items-center gap-2">
                            <Info className="h-4 w-4 text-blue-500" />
                            Ajustes de Preço Recomendados
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <ul className="space-y-2 pl-4">
                            {result.ajustes_preco_recomendados.map((item, i) => (
                                <li key={i} className="text-sm list-disc">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="fotos">
                    <AccordionTrigger>
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            Análise Visual das Fotos
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <ul className="space-y-2 pl-4">
                            {result.analise_fotos.map((item, i) => (
                                <li key={i} className="text-sm list-disc">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
