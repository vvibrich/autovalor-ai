import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Car, CheckCircle2, BarChart3, ShieldCheck } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Navbar */}
            <header className="px-4 lg:px-6 h-14 flex items-center border-b">
                <Link className="flex items-center justify-center" href="#">
                    <Car className="h-6 w-6 text-primary" />
                    <span className="ml-2 text-lg font-bold">AutoValorAI</span>
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
                        Vantagens
                    </Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="#how-it-works">
                        Como Funciona
                    </Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/auth/login">
                        Entrar
                    </Link>
                    <Link href="/auth/signup">
                        <Button size="sm">Criar Conta</Button>
                    </Link>
                </nav>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted/20">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                                    Avaliação inteligente de veículos usando IA
                                </h1>
                                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                                    Descubra o valor real do seu carro com precisão profissional. Analisamos dados de mercado e fotos para uma avaliação completa.
                                </p>
                            </div>
                            <div className="space-x-4">
                                <Link href="/auth/signup">
                                    <Button size="lg" className="h-12 px-8">
                                        Começar Avaliação Grátis
                                    </Button>
                                </Link>
                                <Link href="#how-it-works">
                                    <Button variant="outline" size="lg" className="h-12 px-8">
                                        Saiba Mais
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Vantagens</div>
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Por que usar o AutoValorAI?</h2>
                                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                                    Nossa tecnologia combina dados de mercado com visão computacional para entregar a avaliação mais precisa.
                                </p>
                            </div>
                        </div>
                        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
                            <div className="flex flex-col items-center space-y-4 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                    <BarChart3 className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold">Análise de Mercado</h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Comparamos seu veículo com milhares de anúncios reais e tabela FIPE.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-4 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                    <CheckCircle2 className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold">Visão Computacional</h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Nossa IA analisa as fotos para identificar estado de conservação e avarias.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-4 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                    <ShieldCheck className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold">Relatório Detalhado</h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Receba um laudo completo com sugestão de preço e dicas de valorização.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How it Works Section */}
                <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-muted/20">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Como Funciona</h2>
                                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                                    Avalie seu carro em 3 passos simples.
                                </p>
                            </div>
                        </div>
                        <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 lg:grid-cols-3">
                            <div className="grid gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">1</span>
                                    <h3 className="text-xl font-bold">Preencha os Dados</h3>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Informe marca, modelo, ano e detalhes sobre a mecânica e estado do veículo.
                                </p>
                            </div>
                            <div className="grid gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">2</span>
                                    <h3 className="text-xl font-bold">Envie Fotos</h3>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Faça upload de até 15 fotos para nossa IA analisar a condição visual.
                                </p>
                            </div>
                            <div className="grid gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">3</span>
                                    <h3 className="text-xl font-bold">Receba a Avaliação</h3>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Em segundos, receba um relatório completo com o valor de mercado.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Perguntas Frequentes</h2>
                        </div>
                        <div className="mx-auto max-w-3xl space-y-4 py-12">
                            <div className="grid gap-2">
                                <h3 className="text-lg font-bold">A avaliação é gratuita?</h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Sim, você pode criar uma conta e fazer sua primeira avaliação gratuitamente.
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <h3 className="text-lg font-bold">Como a IA sabe o preço?</h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Nossa IA foi treinada com milhões de dados do mercado automotivo e utiliza modelos avançados (LLaMA 3) para correlacionar características e preços.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 AutoValorAI. Todos os direitos reservados.</p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-xs hover:underline underline-offset-4" href="#">
                        Termos de Serviço
                    </Link>
                    <Link className="text-xs hover:underline underline-offset-4" href="#">
                        Privacidade
                    </Link>
                </nav>
            </footer>
        </div>
    );
}
