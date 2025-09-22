import { getSession } from "@/app/login/actions";
import { redirect } from "next/navigation";
import { AdminLayout as AdminLayoutComponent } from "./AdminLayout";
import { Toaster } from "sonner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Admin - PodiumBarber',
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session?.loggedIn) {
    redirect('/login');
  }

  return (
    <>
      <AdminLayoutComponent>{children}</AdminLayoutComponent>
      <Toaster />
    </>
  );
}
