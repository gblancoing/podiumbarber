'use client';

import { Button } from '@/components/ui/button';
import { logout } from '@/app/login/actions';

export function AdminHeader() {
  return (
    <div className="text-center mb-12">
      <div className="flex justify-between items-center">
        <div></div>
        <div>
          <h1 className="text-4xl font-headline font-bold">Panel de Administración</h1>
          <p className="mt-2 text-lg text-muted-foreground">Gestión de Citas</p>
        </div>
        <form action={logout}>
          <Button type="submit" variant="outline">
            Cerrar Sesión
          </Button>
        </form>
      </div>
    </div>
  );
}
