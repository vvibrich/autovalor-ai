import { login, signup } from '../actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import Link from 'next/link'

export default function LoginPage({ searchParams }: { searchParams: { message: string, error: string } }) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/50">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Entrar</CardTitle>
                    <CardDescription className="text-center">
                        Digite seu email e senha para acessar
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Senha</Label>
                            </div>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        {searchParams?.error && (
                            <p className="text-sm text-destructive text-center">{searchParams.error}</p>
                        )}
                        {searchParams?.message && (
                            <p className="text-sm text-green-600 text-center">{searchParams.message}</p>
                        )}
                        <Button formAction={login} className="w-full">
                            Entrar
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <div className="text-sm text-center text-muted-foreground">
                        Não tem uma conta?{" "}
                        <Link href="/auth/signup" className="text-primary hover:underline">
                            Cadastre-se
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
