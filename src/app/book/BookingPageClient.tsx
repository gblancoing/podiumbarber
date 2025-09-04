'use client';

import { Suspense } from 'react';
import { BookingClient } from './BookingClient';
import { Skeleton } from '@/components/ui/skeleton';

function BookingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-1/2 mx-auto" />
      <Skeleton className="h-4 w-1/3 mx-auto" />
      <div className="p-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="mt-4 h-64 w-full" />
        <Skeleton className="mt-4 h-10 w-full" />
      </div>
    </div>
  );
}

export function BookingPageClient() {
  return (
    <Suspense fallback={<BookingSkeleton />}>
      <BookingClient />
    </Suspense>
  );
}
