'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    const envUsername = process.env.ADMIN_USERNAME;
    const envPassword = process.env.ADMIN_PASSWORD;

    if (username === envUsername && password === envPassword) {
        // Set HTTP-only cookie
        const cookieStore = await cookies();
        cookieStore.set('admin_session', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/',
        });

        // Redirect to dashboard
    } else {
        return { error: 'Invalid username or password' };
    }

    redirect('/admin/add-activity');
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    redirect('/admin/login');
}
