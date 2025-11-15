"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';
import DashboardNavbar from '@/components/dashboard/navbar';
import DashboardSidebar from '@/components/dashboard/sidebar';
import DashboardFooter from '@/components/dashboard/footer';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.replace('/');
      return;
    }

    setIsChecking(false);
  }, [isLoaded, isSignedIn, router]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-beige flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-burgundy animate-spin" />
        <p className="mt-4 text-burgundy/80">Preparing your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige flex flex-col">
      {/* Top Navigation */}
      <DashboardNavbar />
      
      {/* Main Layout with Sidebar */}
      <div className="flex flex-1 relative">
        {/* Sidebar - Fixed Position */}
        <aside className="w-64 hidden lg:block flex-shrink-0 fixed left-0 top-16 bottom-0 overflow-y-auto border-r border-burgundy/20 bg-white z-10">
          <DashboardSidebar className="h-full sticky top-0" />
        </aside>
        
        {/* Main Content - With Sidebar Offset */}
        <main className="flex-1 overflow-auto min-w-0 lg:ml-64 w-full lg:w-[calc(100%-16rem)]">
          <div className="max-w-full px-4 sm:px-6 lg:px-8 py-4 md:py-8">
            {children}
          </div>
        </main>
      </div>
      
      {/* Footer */}
      <DashboardFooter />
    </div>
  );
}
