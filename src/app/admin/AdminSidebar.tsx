'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutDashboard, List, Scissors } from "lucide-react";

const navLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/appointments", label: "Citas", icon: List },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card border-r flex flex-col p-4">
      <Link href="/" className="flex items-center gap-2 font-bold text-lg font-headline mb-8">
        <Scissors className="h-6 w-6 text-primary" />
        BooksyStyle
      </Link>
      <nav className="flex flex-col gap-2">
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
    </aside>
  );
}
