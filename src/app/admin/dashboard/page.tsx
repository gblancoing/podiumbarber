import { getBookings, services, stylists } from "@/lib/data";
import AdminLayout from "../AdminLayout";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
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
    
    // Pasamos los datos procesados al componente cliente
    return (
        <AdminLayout>
            <DashboardClient 
                totalRevenue={totalRevenue}
                totalBookings={totalBookings}
                activeStylists={stylists.length}
                bookingsByStylist={bookingsByStylist}
                upcomingBookings={upcomingBookings}
            />
        </AdminLayout>
    );
}
