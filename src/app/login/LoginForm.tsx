'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { login } from './actions';

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const result = await login(formData);

    if (result.success) {
      toast({
        title: "¡Éxito!",
        description: "Has iniciado sesión correctamente.",
      });
      router.push('/admin/appointments');
    } else {
      setError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error de Autenticación</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="tu@ejemplo.com" required defaultValue="admin@example.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" name="password" type="password" required defaultValue="password" />
      </div>
      <Button type="submit" className="w-full">
        Iniciar Sesión
      </Button>
      <div className="mt-4 text-center text-sm">
        ¿No tienes una cuenta?{" "}
        <Link href="/signup" className="underline">
          Regístrate
        </Link>
      </div>
    </form>
  );
}
