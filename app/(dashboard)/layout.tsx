import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Car, LogOut, PlusCircle, LayoutDashboard } from "lucide-react";
import { logout } from "@/app/auth/actions";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    // Fetch user details from public.users table if needed, or just use auth metadata
    const userName = user.user_metadata.name || user.email?.split("@")[0] || "Usuário";

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center">
                    <div className="mr-4 hidden md:flex">
                        <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
                            <Car className="h-6 w-6" />
                            <span className="hidden font-bold sm:inline-block">
                                AutoValorAI
                            </span>
                        </Link>
                        <nav className="flex items-center space-x-6 text-sm font-medium">
                            <Link
                                href="/dashboard"
                                className="transition-colors hover:text-foreground/80 text-foreground"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/dashboard/evaluate"
                                className="transition-colors hover:text-foreground/80 text-foreground/60"
                            >
                                Nova Avaliação
                            </Link>
                        </nav>
                    </div>
                    <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                        <div className="w-full flex-1 md:w-auto md:flex-none">
                            {/* Add search if needed */}
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground hidden sm:inline-block">
                                Olá, {userName}
                            </span>
                            <form action={logout}>
                                <Button variant="ghost" size="icon" title="Sair">
                                    <LogOut className="h-5 w-5" />
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </header>
            <main className="flex-1 container py-6">
                {children}
            </main>
        </div>
    );
}
