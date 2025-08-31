"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
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
  Store,
  Settings,
  Users,
  BarChart3,
  Menu,
  ShoppingBag
} from 'lucide-react';

export default function DashboardNavbar() {
  const { user } = useUser();
  const currentUser = useQuery(api.users.getCurrentUser);
  const [mounted, setMounted] = useState(false);

  const isAdmin = currentUser?.role === 'admin';
  const isVendor = currentUser?.role === 'vendor';

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="bg-white border-b border-burgundy-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="ConnectCom Logo"
                width={40}
                height={40}
                className="mr-2 animate-scale"
              />
              </div>
              <span className="text-xl font-bold text-burgundy-900">ConnectCom</span>
            </Link>
            
            {/* Dashboard Label */}
            <div className="ml-6 pl-6 border-l border-burgundy-200">
              <Badge variant="outline" className="border-burgundy-300 text-burgundy-700 bg-burgundy-50">
                {isAdmin ? 'Admin Dashboard' : isVendor ? 'Vendor Dashboard' : 'Dashboard'}
              </Badge>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Main Navigation Links */}
            <div className="flex items-center space-x-1">
              <Link href="/">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-burgundy-700 hover:text-burgundy-900 hover:bg-burgundy-50"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              
              <Link href="/shops">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-burgundy-700 hover:text-burgundy-900 hover:bg-burgundy-50"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Shops
                </Button>
              </Link>

              {/* Admin Navigation */}
              {isAdmin && (
                <>
                  <Link href="/admin/users">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-burgundy-700 hover:text-burgundy-900 hover:bg-burgundy-50"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Users
                    </Button>
                  </Link>
                  
                  <Link href="/admin/shops/approve">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-burgundy-700 hover:text-burgundy-900 hover:bg-burgundy-50"
                    >
                      <Store className="w-4 h-4 mr-2" />
                      Shop Approvals
                    </Button>
                  </Link>
                </>
              )}

              {/* Vendor Navigation */}
              {isVendor && (
                <Link href="/vendor/shops">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-burgundy-700 hover:text-burgundy-900 hover:bg-burgundy-50"
                  >
                    <Store className="w-4 h-4 mr-2" />
                    My Shops
                  </Button>
                </Link>
              )}
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-burgundy-200">
              {/* Notifications */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-burgundy-700 hover:text-burgundy-900 hover:bg-burgundy-50 relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              {/* User Profile */}
              <div className="flex items-center">
                {mounted ? (
                  <CustomUserButton />
                ) : (
                  <div className="w-8 h-8 bg-burgundy-200 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-burgundy-700 hover:text-burgundy-900 hover:bg-burgundy-50"
            >
              <Bell className="w-4 h-4" />
            </Button>
            
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
                <DropdownMenuLabel className="text-burgundy-900">Navigation</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/" className="flex items-center">
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/shops" className="flex items-center">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Shops
                  </Link>
                </DropdownMenuItem>

                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-burgundy-900">Admin</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/users" className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        Users
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/vendor/shops" className="flex items-center">
                        <Store className="w-4 h-4 mr-2" />
                        Shop Approvals
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                {isVendor && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-burgundy-900">Vendor</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href="/vendor/shops" className="flex items-center">
                        <Store className="w-4 h-4 mr-2" />
                        My Shops
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
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
