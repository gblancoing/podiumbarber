'use client';

import type { Booking, Service } from '../../../lib/types';
import { BarChart, Users, Calendar, Scissors, DollarSign } from 'lucide-react';

interface DashboardStatsProps {
  bookings: Booking[];
  services: Service[];
}

export function DashboardStats({ bookings, services }: DashboardStatsProps) {
  const totalRevenue = bookings.reduce((acc, booking) => {
    const service = services.find(s => s.id === booking.serviceId);
    return acc + (service?.price || 0);
  }, 0);

  const totalBookings = bookings.length;

  const serviceCounts = bookings.reduce((acc, booking) => {
    const service = services.find(s => s.id === booking.serviceId);
    if (service) {
      acc[service.name] = (acc[service.name] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const mostPopularService = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  const formattedRevenue = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(totalRevenue);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard 
        title="Ingresos Totales" 
        value={formattedRevenue} 
        icon={<DollarSign className="text-green-400" />} 
        description="Ingresos generados por todas las reservas"
      />
      <StatCard 
        title="Total de Reservas" 
        value={totalBookings.toString()} 
        icon={<Calendar className="text-blue-400" />} 
        description="Número total de citas registradas"
      />
      <StatCard 
        title="Servicio Más Popular" 
        value={mostPopularService} 
        icon={<Scissors className="text-yellow-400" />} 
        description="El servicio más solicitado por los clientes"
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <div className="bg-gray-800/50 p-6 rounded-lg flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between">
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <div className="bg-gray-900 p-2 rounded-full">
            {icon}
          </div>
        </div>
        <p className="text-3xl font-bold text-white mt-2">{value}</p>
      </div>
      <p className="text-xs text-gray-500 mt-4">{description}</p>
    </div>
  );
}
