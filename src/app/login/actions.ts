'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = 'password';

export async function login(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const sessionData = { user: 'admin', loggedIn: true };
    // En una app real, usarías una solución de sesión segura, no un simple string.
    cookies().set('session', JSON.stringify(sessionData), { httpOnly: true, maxAge: 60 * 60 * 24 });
    return { success: true };
  }

  return { success: false, error: 'Credenciales inválidas.' };
}

export async function getSession() {
  const sessionCookie = cookies().get('session');
  if (sessionCookie) {
    try {
      return JSON.parse(sessionCookie.value);
    } catch {
      return null;
    }
  }
  return null;
}

export async function logout() {
  cookies().delete('session');
  redirect('/login');
}
