"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CustomUserButton from '../user-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Bell,
  Home,
  Settings,
  Menu
} from 'lucide-react';

export default function DashboardNavbar() {
  const currentUser = useQuery(api.users.getCurrentUser);
  const unreadNotifications = useQuery(api.notifications.getUnreadCount);
  const [mounted, setMounted] = useState(false);

  const isAdmin = currentUser?.role === 'admin';
  const isVendor = currentUser?.role === 'vendor';

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="bg-white border-b border-burgundy-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 gap-2">
              {/* Logo and Brand */}
              <div className="flex items-center gap-2 min-w-0">
                <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                  <Image
                    src="/logo.png"
                    alt="ConnectCom Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                  <span className="text-lg md:text-xl font-bold text-burgundy-900 hidden sm:block">ConnectCom</span>
                </Link>
                
                {/* Dashboard Label - Hidden on very small screens */}
                <div className="hidden md:flex items-center ml-2 pl-2 md:ml-4 md:pl-4 border-l border-burgundy-200">
                  <Badge variant="outline" className="border-burgundy-300 text-burgundy-700 bg-burgundy-50 text-xs whitespace-nowrap">
                    {isAdmin ? 'Admin' : isVendor ? 'Vendor' : 'Customer'}
                  </Badge>
                </div>
              </div>

              {/* Desktop Navigation - User Actions Only */}
              <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {/* Notifications */}
            <Link href="/notifications">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-burgundy-700 hover:text-burgundy-900 hover:bg-burgundy-50 relative"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifications !== undefined && unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-semibold rounded-full">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Profile */}
            <div className="flex items-center">
              {mounted ? (
                <CustomUserButton />
              ) : (
                <div className="w-8 h-8 bg-burgundy-200 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>

              {/* Mobile Menu */}
              <div className="md:hidden flex items-center gap-2 flex-shrink-0">
            <Link href="/notifications">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-burgundy-700 hover:text-burgundy-900 hover:bg-burgundy-50 relative"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifications !== undefined && unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-semibold rounded-full">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </Button>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-burgundy-700 hover:text-burgundy-900 hover:bg-burgundy-50"
                >
                  <Menu className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-burgundy-900">Quick Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/" className="flex items-center">
                    <Home className="w-4 h-4 mr-2" />
                    Back to Home
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {mounted ? (
              <CustomUserButton />
            ) : (
              <div className="w-8 h-8 bg-burgundy-200 rounded-full animate-pulse"></div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
