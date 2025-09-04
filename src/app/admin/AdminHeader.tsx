'use client';

import { Button } from '@/components/ui/button';
import { logout } from '@/app/login/actions';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';

export function AdminHeader() {
  return (
    <header className="flex justify-end items-center mb-8">
       {/* Mobile Menu */}
       <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                   <AdminSidebar />
                </SheetContent>
            </Sheet>
       </div>
       <div className="hidden md:block">
            <form action={logout}>
                <Button type="submit" variant="outline">
                    Cerrar Sesión
                </Button>
            </form>
       </div>
    </header>
  );
}
