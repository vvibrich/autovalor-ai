import { signup } from '../actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import Link from 'next/link'

export default function SignupPage({ searchParams }: { searchParams: { error: string } }) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/50">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Criar Conta</CardTitle>
                    <CardDescription className="text-center">
                        Preencha os dados abaixo para começar
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome Completo</Label>
                            <Input id="name" name="name" type="text" placeholder="Seu nome" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        {searchParams?.error && (
                            <p className="text-sm text-destructive text-center">{searchParams.error}</p>
                        )}
                        <Button formAction={signup} className="w-full">
                            Cadastrar
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <div className="text-sm text-center text-muted-foreground">
                        Já tem uma conta?{" "}
                        <Link href="/auth/login" className="text-primary hover:underline">
                            Entrar
                        </Link>
                    </div>
                    <div className="text-sm text-center text-muted-foreground">
                        <Link href="/" className="hover:underline">
                            Voltar para Home
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
