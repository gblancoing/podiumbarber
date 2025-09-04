'use client';

import { Button } from '@/components/ui/button';
import { logout } from '@/app/login/actions';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-end gap-4 border-b bg-background px-4 md:px-6">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <AdminSidebar />
          </SheetContent>
        </Sheet>
      </div>
      <form action={logout}>
        <Button type="submit" variant="outline">
          Cerrar Sesión
        </Button>
      </form>
    </header>
  );
}
