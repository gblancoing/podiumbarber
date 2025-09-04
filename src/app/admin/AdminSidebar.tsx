'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutDashboard, List, Scissors, Bell } from "lucide-react";
import { logout } from "../login/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const navLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/appointments", label: "Citas", icon: List },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-bold font-headline">
                <Scissors className="h-6 w-6 text-primary" />
                <span>BooksyStyle</span>
            </Link>
        </div>
        <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-2">
                {navLinks.map((link) => (
                <Button
                    key={link.href}
                    asChild
                    variant={pathname === link.href ? "secondary" : "ghost"}
                    className="justify-start"
                >
                    <Link href={link.href} className="flex items-center gap-3">
                    <link.icon className="h-4 w-4" />
                    {link.label}
                    </Link>
                </Button>
                ))}
            </nav>
        </div>
        <div className="mt-auto p-4 md:hidden">
            <form action={logout}>
                <Button type="submit" variant="outline" className="w-full">
                    Cerrar Sesión
                </Button>
            </form>
        </div>
    </div>
  );
}
