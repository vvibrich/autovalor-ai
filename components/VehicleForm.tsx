"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UploadCloud, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { vehicleFormSchema, VehicleFormData, EvaluationResponse } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePreview } from "@/components/ImagePreview";
import { cn } from "@/lib/utils";

interface VehicleFormProps {
    onSuccess?: (data: EvaluationResponse, vehicleData: VehicleFormData) => void;
    customSubmit?: (data: VehicleFormData) => Promise<void>;
    isExternalLoading?: boolean;
}

const STEPS = [
    { id: 1, title: "Identificação" },
    { id: 2, title: "Mecânica" },
    { id: 3, title: "Estado Geral" },
    { id: 4, title: "Detalhes & Fotos" },
];

export function VehicleForm({ onSuccess, customSubmit, isExternalLoading }: VehicleFormProps) {
    const [step, setStep] = useState(1);
    const [isUploading, setIsUploading] = useState(false);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [apiError, setApiError] = useState<string | null>(null);

    const form = useForm<VehicleFormData>({
        resolver: zodResolver(vehicleFormSchema) as any,
        defaultValues: {
            marca: "",
            modelo: "",
            versao: "",
            ano_fabricacao: new Date().getFullYear(),
            ano_modelo: new Date().getFullYear(),
            categoria: "",
            motor: "",
            cv: undefined,
            combustivel: "",
            cambio: "",
            tracao: "",
            km: 0,
            donos: 1,
            sinistro: false,
            revisoes: false,
            manual_chave: false,
            pneus: "",
            pintura: true,
            interior: true,
            historico: "",
            modificacoes: "",
            obs: "",
            imageUrls: [],
        },
        mode: "onChange",
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        setIsUploading(true);
        setUploadError(null);
        const files = Array.from(e.target.files);
        const newUrls: string[] = [];

        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) throw new Error("Falha no upload");

                const data = await res.json();
                newUrls.push(data.url);
            }

            const updatedUrls = [...uploadedUrls, ...newUrls];
            setUploadedUrls(updatedUrls);
            form.setValue("imageUrls", updatedUrls);
        } catch (error) {
            console.error(error);
            setUploadError("Erro ao fazer upload das imagens. Tente novamente.");
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = (index: number) => {
        const newUrls = uploadedUrls.filter((_, i) => i !== index);
        setUploadedUrls(newUrls);
        form.setValue("imageUrls", newUrls);
    };

    const onSubmit = async (data: VehicleFormData) => {
        console.log("Form submitted with data:", data);

        if (customSubmit) {
            await customSubmit(data);
        } else {
            console.error("VehicleForm: customSubmit prop is required for this version.");
            setApiError("Erro de configuração: customSubmit não fornecido.");
        }
    };

    const onError = (errors: any) => {
        console.error("Form validation errors:", errors);
    };

    const nextStep = async () => {
        let fieldsToValidate: (keyof VehicleFormData)[] = [];

        if (step === 1) {
            fieldsToValidate = ["marca", "modelo", "versao", "ano_fabricacao", "ano_modelo", "categoria"];
        } else if (step === 2) {
            fieldsToValidate = ["motor", "cv", "combustivel", "cambio", "tracao"];
        } else if (step === 3) {
            fieldsToValidate = ["km", "donos", "pneus"];
        }

        const isValid = await form.trigger(fieldsToValidate);
        if (isValid) {
            setStep((s) => Math.min(s + 1, 4));
        }
    };

    const prevStep = () => setStep((s) => Math.max(s - 1, 1));

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <div className="flex justify-between items-center mb-4">
                    {STEPS.map((s) => (
                        <div key={s.id} className="flex flex-col items-center">
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors",
                                step >= s.id ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-muted"
                            )}>
                                {step > s.id ? <Check className="h-4 w-4" /> : s.id}
                            </div>
                            <span className={cn(
                                "text-xs mt-1 hidden sm:block",
                                step >= s.id ? "text-primary font-medium" : "text-muted-foreground"
                            )}>
                                {s.title}
                            </span>
                        </div>
                    ))}
                </div>
                <CardTitle>{STEPS[step - 1].title}</CardTitle>
                <CardDescription>Passo {step} de 4</CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">

                    {/* STEP 1: Identificação */}
                    {step === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Marca</Label>
                                <Input {...form.register("marca")} placeholder="Ex: Toyota" />
                                {form.formState.errors.marca && <p className="text-sm text-destructive">{form.formState.errors.marca.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Modelo</Label>
                                <Input {...form.register("modelo")} placeholder="Ex: Corolla" />
                                {form.formState.errors.modelo && <p className="text-sm text-destructive">{form.formState.errors.modelo.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Versão</Label>
                                <Input {...form.register("versao")} placeholder="Ex: XEi 2.0" />
                                {form.formState.errors.versao && <p className="text-sm text-destructive">{form.formState.errors.versao.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Categoria</Label>
                                <Select onValueChange={(val) => form.setValue("categoria", val)} defaultValue={form.getValues("categoria")}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Hatch">Hatch</SelectItem>
                                        <SelectItem value="Sedan">Sedan</SelectItem>
                                        <SelectItem value="SUV">SUV</SelectItem>
                                        <SelectItem value="Picape">Picape</SelectItem>
                                        <SelectItem value="Perua">Perua</SelectItem>
                                        <SelectItem value="Coupe">Coupe</SelectItem>
                                        <SelectItem value="Conversivel">Conversível</SelectItem>
                                    </SelectContent>
                                </Select>
                                {form.formState.errors.categoria && <p className="text-sm text-destructive">{form.formState.errors.categoria.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Ano Fabricação</Label>
                                <Input type="number" {...form.register("ano_fabricacao")} />
                                {form.formState.errors.ano_fabricacao && <p className="text-sm text-destructive">{form.formState.errors.ano_fabricacao.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Ano Modelo</Label>
                                <Input type="number" {...form.register("ano_modelo")} />
                                {form.formState.errors.ano_modelo && <p className="text-sm text-destructive">{form.formState.errors.ano_modelo.message}</p>}
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Mecânica */}
                    {step === 2 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Motor</Label>
                                <Input {...form.register("motor")} placeholder="Ex: 2.0 Flex" />
                                {form.formState.errors.motor && <p className="text-sm text-destructive">{form.formState.errors.motor.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Potência (cv) - Opcional</Label>
                                <Input type="number" {...form.register("cv")} placeholder="Ex: 177" />
                            </div>
                            <div className="space-y-2">
                                <Label>Combustível</Label>
                                <Select onValueChange={(val) => form.setValue("combustivel", val)} defaultValue={form.getValues("combustivel")}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Flex">Flex</SelectItem>
                                        <SelectItem value="Gasolina">Gasolina</SelectItem>
                                        <SelectItem value="Etanol">Etanol</SelectItem>
                                        <SelectItem value="Diesel">Diesel</SelectItem>
                                        <SelectItem value="Hibrido">Híbrido</SelectItem>
                                        <SelectItem value="Eletrico">Elétrico</SelectItem>
                                    </SelectContent>
                                </Select>
                                {form.formState.errors.combustivel && <p className="text-sm text-destructive">{form.formState.errors.combustivel.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Câmbio</Label>
                                <Select onValueChange={(val) => form.setValue("cambio", val)} defaultValue={form.getValues("cambio")}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Manual">Manual</SelectItem>
                                        <SelectItem value="Automatico">Automático</SelectItem>
                                        <SelectItem value="CVT">CVT</SelectItem>
                                        <SelectItem value="Automatizado">Automatizado</SelectItem>
                                    </SelectContent>
                                </Select>
                                {form.formState.errors.cambio && <p className="text-sm text-destructive">{form.formState.errors.cambio.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Tração</Label>
                                <Select onValueChange={(val) => form.setValue("tracao", val)} defaultValue={form.getValues("tracao")}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="4x2">4x2 (Dianteira/Traseira)</SelectItem>
                                        <SelectItem value="4x4">4x4 / AWD</SelectItem>
                                    </SelectContent>
                                </Select>
                                {form.formState.errors.tracao && <p className="text-sm text-destructive">{form.formState.errors.tracao.message}</p>}
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Estado Geral */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Quilometragem (km)</Label>
                                    <Input type="number" {...form.register("km")} />
                                    {form.formState.errors.km && <p className="text-sm text-destructive">{form.formState.errors.km.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Número de Donos</Label>
                                    <Input type="number" {...form.register("donos")} />
                                    {form.formState.errors.donos && <p className="text-sm text-destructive">{form.formState.errors.donos.message}</p>}
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Estado dos Pneus</Label>
                                    <Select onValueChange={(val) => form.setValue("pneus", val)} defaultValue={form.getValues("pneus")}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Novos">Novos (Sem uso)</SelectItem>
                                            <SelectItem value="Bons">Bons (Meia vida ou mais)</SelectItem>
                                            <SelectItem value="Regulares">Regulares (Perto do TWI)</SelectItem>
                                            <SelectItem value="Ruins">Ruins (Carecas/Vencidos)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {form.formState.errors.pneus && <p className="text-sm text-destructive">{form.formState.errors.pneus.message}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2 border p-3 rounded-md">
                                    <input type="checkbox" id="sinistro" className="h-4 w-4" {...form.register("sinistro")} />
                                    <Label htmlFor="sinistro">Possui Sinistro/Leilão?</Label>
                                </div>
                                <div className="flex items-center space-x-2 border p-3 rounded-md">
                                    <input type="checkbox" id="revisoes" className="h-4 w-4" {...form.register("revisoes")} />
                                    <Label htmlFor="revisoes">Todas Revisões Feitas?</Label>
                                </div>
                                <div className="flex items-center space-x-2 border p-3 rounded-md">
                                    <input type="checkbox" id="manual_chave" className="h-4 w-4" {...form.register("manual_chave")} />
                                    <Label htmlFor="manual_chave">Manual + Chave Reserva?</Label>
                                </div>
                                <div className="flex items-center space-x-2 border p-3 rounded-md">
                                    <input type="checkbox" id="pintura" className="h-4 w-4" {...form.register("pintura")} />
                                    <Label htmlFor="pintura">Pintura Original?</Label>
                                </div>
                                <div className="flex items-center space-x-2 border p-3 rounded-md">
                                    <input type="checkbox" id="interior" className="h-4 w-4" {...form.register("interior")} />
                                    <Label htmlFor="interior">Interior Conservado?</Label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: Detalhes & Fotos */}
                    {step === 4 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Histórico de Manutenção</Label>
                                <Textarea {...form.register("historico")} placeholder="Ex: Troca de óleo a cada 10k km, correia dentada trocada..." />
                            </div>
                            <div className="space-y-2">
                                <Label>Modificações</Label>
                                <Textarea {...form.register("modificacoes")} placeholder="Ex: Rodas aro 18, Multimídia, Remap..." />
                            </div>
                            <div className="space-y-2">
                                <Label>Observações Adicionais</Label>
                                <Textarea {...form.register("obs")} placeholder="Outros detalhes relevantes..." />
                            </div>

                            <div className="space-y-2">
                                <Label>Fotos do Veículo (Máx 15)</Label>
                                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={handleFileChange}
                                        disabled={isUploading || uploadedUrls.length >= 15}
                                    />
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        {isUploading ? <Loader2 className="h-8 w-8 animate-spin" /> : <UploadCloud className="h-8 w-8" />}
                                        <p className="text-sm font-medium">{isUploading ? "Enviando..." : "Arraste fotos ou clique para selecionar"}</p>
                                        <p className="text-xs">JPG, PNG (Máx 15 fotos)</p>
                                    </div>
                                </div>
                                {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
                                <ImagePreview urls={uploadedUrls} onRemove={removeImage} />
                            </div>
                        </div>
                    )}

                    {apiError && (
                        <Alert variant="destructive">
                            <AlertTitle>Erro</AlertTitle>
                            <AlertDescription>{apiError}</AlertDescription>
                        </Alert>
                    )}

                    <CardFooter className="flex justify-between px-0 pt-4">
                        {step > 1 ? (
                            <Button type="button" variant="outline" onClick={prevStep}>
                                <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
                            </Button>
                        ) : (
                            <div />
                        )}

                        {step < 4 ? (
                            <Button type="button" onClick={nextStep}>
                                Próximo <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={isEvaluating || isUploading || isExternalLoading}>
                                {isEvaluating || isExternalLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Avaliando...
                                    </>
                                ) : (
                                    "Avaliar Preço"
                                )}
                            </Button>
                        )}
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    );
}
