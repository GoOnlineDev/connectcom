'use client';

import { useHomepageStats } from '@/hooks/useData';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomepageStats() {
  const { data: stats, isLoading } = useHomepageStats();

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="text-center">
            <Skeleton className="h-8 w-16 mx-auto mb-2" />
            <Skeleton className="h-4 w-24 mx-auto" />
          </div>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      label: 'Active Shops',
      value: stats.activeShops,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      label: 'Total Products',
      value: stats.totalProducts,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      label: 'Total Services',
      value: stats.totalServices,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      label: 'Happy Users',
      value: stats.totalUsers,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {statItems.map((item, index) => (
        <div 
          key={item.label}
          className="text-center group bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center justify-center mb-2">
            <div className="text-burgundy group-hover:text-burgundy-light transition-colors">
              {item.icon}
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-burgundy-900 mb-1">
            {item.value.toLocaleString()}
          </div>
          <div className="text-sm text-burgundy-700 font-medium">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}

