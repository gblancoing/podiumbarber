import { getBookings, services, stylists } from "@/lib/data";
import { DashboardClient } from "./DashboardClient";
import { getSession } from "@/app/login/actions";
import { redirect } from "next/navigation";
import { AdminSidebar } from "../AdminSidebar";
import { AdminHeader } from "../AdminHeader";

export default async function DashboardPage() {
    const session = await getSession();
    if (!session?.loggedIn) {
      redirect('/login');
    }

    const bookings = await getBookings();
    
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, booking) => {
        const service = services.find(s => s.id === booking.serviceId);
        return sum + (service?.price || 0);
    }, 0);

    const bookingsByStylist = stylists.map(stylist => ({
        name: stylist.name.split(' ')[0],
        citas: bookings.filter(b => b.stylistId === stylist.id).length
    }));

    const upcomingBookings = bookings
        .filter(b => new Date(b.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);
    
    return (
        <div className="flex min-h-screen">
            <AdminSidebar />
            <main className="flex-1 p-8 bg-muted/40">
                <AdminHeader />
                <DashboardClient 
                    totalRevenue={totalRevenue}
                    totalBookings={totalBookings}
                    activeStylists={stylists.length}
                    bookingsByStylist={bookingsByStylist}
                    upcomingBookings={upcomingBookings}
                />
            </main>
        </div>
    );
}
