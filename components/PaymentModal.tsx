"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Copy, CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    paymentId: string;
    qrCode: string;
    qrCodeBase64: string;
    onSuccess: () => void;
}

export function PaymentModal({ isOpen, onClose, paymentId, qrCode, qrCodeBase64, onSuccess }: PaymentModalProps) {
    const [status, setStatus] = useState("pending");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!isOpen || !paymentId) return;

        const checkStatus = async () => {
            try {
                const res = await fetch(`/api/payments/${paymentId}/status`);
                const data = await res.json();

                if (data.status === "approved") {
                    setStatus("approved");
                    setTimeout(() => {
                        onSuccess();
                    }, 1500); // Wait a bit to show success message
                }
            } catch (error) {
                console.error("Error checking status:", error);
            }
        };

        const interval = setInterval(checkStatus, 3000); // Poll every 3s
        return () => clearInterval(interval);
    }, [isOpen, paymentId, onSuccess]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(qrCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Pagamento via PIX</DialogTitle>
                    <DialogDescription>
                        Escaneie o QR Code ou copie o código para pagar e liberar sua avaliação.
                    </DialogDescription>
                </DialogHeader>

                {status === "approved" ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                        <h3 className="text-xl font-bold text-green-600">Pagamento Aprovado!</h3>
                        <p className="text-center text-muted-foreground">Gerando sua avaliação...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center space-y-6 py-4">
                        <div className="relative w-48 h-48">
                            {qrCodeBase64 ? (
                                <Image
                                    src={`data:image/png;base64,${qrCodeBase64}`}
                                    alt="QR Code PIX"
                                    fill
                                    className="object-contain"
                                />
                            ) : (
                                <div className="w-full h-full bg-muted animate-pulse rounded-md" />
                            )}
                        </div>

                        <div className="w-full space-y-2">
                            <p className="text-sm font-medium text-center">Código PIX Copia e Cola</p>
                            <div className="flex items-center space-x-2">
                                <div className="grid flex-1 gap-2">
                                    <Button variant="outline" className="justify-start text-muted-foreground truncate" onClick={copyToClipboard}>
                                        {qrCode.substring(0, 25)}...
                                    </Button>
                                </div>
                                <Button type="submit" size="sm" className="px-3" onClick={copyToClipboard}>
                                    <span className="sr-only">Copiar</span>
                                    {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center text-sm text-muted-foreground">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Aguardando pagamento...
                        </div>

                        {process.env.NODE_ENV === "development" && (
                            <Button
                                variant="destructive"
                                size="sm"
                                className="w-full mt-4"
                                onClick={async () => {
                                    try {
                                        const res = await fetch("/api/payments/dev-approve", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ payment_id: paymentId }),
                                        });
                                        if (res.ok) {
                                            console.log("Dev payment approved");
                                        } else {
                                            console.error("Dev payment failed");
                                        }
                                    } catch (e) {
                                        console.error(e);
                                    }
                                }}
                            >
                                Simular Pagamento (Dev Mode)
                            </Button>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
