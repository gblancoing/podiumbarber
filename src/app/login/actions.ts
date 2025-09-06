'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Lee las credenciales de las variables de entorno para mayor seguridad
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function login(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  // Comprueba que las variables de entorno estén configuradas en el servidor
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Error: ADMIN_EMAIL o ADMIN_PASSWORD no están configuradas en las variables de entorno.');
    // Mensaje genérico para el usuario para no exponer detalles internos
    return { success: false, error: 'Error de configuración del servidor. Contacte al administrador.' };
  }

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const sessionData = { user: 'admin', loggedIn: true };
    cookies().set('session', JSON.stringify(sessionData), { httpOnly: true, maxAge: 60 * 60 * 24 }); // Sesión de 24 horas
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
