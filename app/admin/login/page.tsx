'use client';

import { Container } from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { login } from '@/app/actions/auth';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Logging in...' : 'Login'}
        </Button>
    );
}

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        const result = await login(formData);
        if (result?.error) {
            setError(result.error);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20">
            <Container className="max-w-md w-full">
                <div className="bg-white p-8 rounded-xl shadow-lg border">
                    <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>

                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form action={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Username</label>
                            <Input
                                name="username"
                                type="text"
                                required
                                placeholder="Enter username"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <Input
                                name="password"
                                type="password"
                                required
                                placeholder="Enter password"
                            />
                        </div>
                        <div className="pt-2">
                            <SubmitButton />
                        </div>
                    </form>
                </div>
            </Container>
        </div>
    );
}
