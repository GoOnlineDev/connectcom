import React from 'react';
import DashboardNavbar from '@/components/dashboard/navbar';
import DashboardSidebar from '@/components/dashboard/sidebar';
import DashboardFooter from '@/components/dashboard/footer';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-beige flex flex-col">
      {/* Top Navigation */}
      <DashboardNavbar />
      
      {/* Main Layout with Sidebar */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 hidden lg:block">
          <DashboardSidebar className="h-full" />
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
      
      {/* Footer */}
      <DashboardFooter />
    </div>
  );
}
