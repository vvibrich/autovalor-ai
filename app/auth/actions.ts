import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return redirect('/auth/login?error=Could not authenticate user')
    }

    return redirect('/dashboard')
}

export async function signup(formData: FormData) {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string

    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name: name,
            },
            emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/callback`,
        },
    })

    if (error) {
        return redirect('/auth/signup?error=Could not create user')
    }

    return redirect('/auth/login?message=Check email to continue sign in process')
}

export async function logout() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    return redirect('/auth/login')
}
