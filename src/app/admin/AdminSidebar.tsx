'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutDashboard, List, Scissors, Bell, ChevronLeft, ChevronRight, CheckCircle, Trash2 } from "lucide-react";
import { logout } from "../login/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useState } from "react";
import { useSidebar } from "./SidebarContext";

const navLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Reservas Recientes", icon: List },
  { href: "/admin/completed", label: "Reservas Completadas", icon: CheckCircle },
  { href: "/admin/deleted", label: "Reservas Eliminadas", icon: Trash2 },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { isCollapsed, setIsCollapsed } = useSidebar();

  return (
    <div className={cn(
      "flex h-full max-h-screen flex-col gap-2 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-16 items-center border-b px-4 lg:h-[60px] lg:px-6 justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold font-headline">
          <Image src="/img/logo.png" alt="PodiumBarber Logo" width={32} height={32} />
          {!isCollapsed && <span>PodiumBarber</span>}
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 h-8 w-8"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-2">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              asChild
              variant={pathname === link.href ? "secondary" : "ghost"}
              className={cn(
                "justify-start",
                isCollapsed ? "justify-center px-2" : "justify-start"
              )}
            >
              <Link href={link.href} className="flex items-center gap-3">
                <link.icon className="h-4 w-4" />
                {!isCollapsed && link.label}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4 md:hidden">
        <form action={logout}>
          <Button type="submit" variant="outline" className="w-full">
            {isCollapsed ? "Cerrar" : "Cerrar Sesión"}
          </Button>
        </form>
      </div>
    </div>
  );
}
