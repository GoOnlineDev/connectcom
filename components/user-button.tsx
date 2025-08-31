"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser, useClerk } from '@clerk/nextjs';
import { useCurrentUser, useWishlistCount } from '@/hooks/useData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Settings,
  LogOut,
  Store,
  Home,
  MessageSquare,
  Users,
  ShoppingBag,
  BarChart3,
  Shield,
  ChevronDown,
  Bell,
  HelpCircle,
  Heart
} from 'lucide-react';

interface UserButtonProps {
  className?: string;
}

interface QuickLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export default function CustomUserButton({ className }: UserButtonProps) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  const { data: wishlistCount, isLoading: wishlistLoading } = useWishlistCount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user || userLoading || !currentUser) {
    return (
      <div className="w-8 h-8 bg-burgundy-200 rounded-full animate-pulse"></div>
    );
  }

  const isAdmin = currentUser.role === 'admin';
  const isVendor = currentUser.role === 'vendor';
  const isCustomer = currentUser.role === 'customer';

  // Get user initials for avatar
  const getInitials = () => {
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || user.emailAddresses[0]?.emailAddress.charAt(0).toUpperCase() || 'U';
  };

  // Role-based quick links - minimal and focused
  const getQuickLinks = (): QuickLink[] => {
    if (isAdmin) {
      return [
        {
          label: 'Admin Dashboard',
          href: '/admin',
          icon: Home,
        },
        {
          label: 'Manage Shops',
          href: '/admin/shops',
          icon: Store,
        },
      ];
    }

    if (isVendor) {
      return [
        {
          label: 'Vendor Dashboard',
          href: '/vendor',
          icon: Home,
        },
        {
          label: 'My Shops',
          href: '/vendor/shops',
          icon: Store,
        },
        {
          label: 'Messages',
          href: '/vendor/messages',
          icon: MessageSquare,
          badge: 3, // This could be dynamic from your message system
        },
      ];
    }

    if (isCustomer) {
      return [
        {
          label: 'Dashboard',
          href: '/dashboard',
          icon: Home,
        },
        {
          label: 'Browse Shops',
          href: '/shops',
          icon: Store,
        },
        {
          label: 'Wishlist',
          href: '/wishlist',
          icon: Heart,
          badge: wishlistCount || 0,
        },
      ];
    }

    return [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: Home,
      },
      {
        label: 'Wishlist',
        href: '/wishlist',
        icon: Heart,
        badge: wishlistCount || 0,
      },
    ];
  };

  const quickLinks: QuickLink[] = getQuickLinks();

  const handleSignOut = () => {
    signOut({ redirectUrl: '/' });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`h-10 px-3 rounded-full hover:bg-burgundy-50 transition-colors ${className}`}
        >
          <div className="flex items-center space-x-2">
            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full bg-burgundy-600 text-white flex items-center justify-center text-sm font-medium">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                getInitials()
              )}
            </div>
            
            {/* User Info - Hidden on mobile */}
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-burgundy-900 leading-tight">
                {user.firstName} {user.lastName}
              </p>
              <div className="flex items-center space-x-1">
                <p className="text-xs text-burgundy-700 capitalize">
                  {currentUser.role}
                </p>
                {isAdmin && (
                  <Shield className="w-3 h-3 text-burgundy-700" />
                )}
              </div>
            </div>
            
            <ChevronDown className="w-4 h-4 text-burgundy-700" />
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 shadow-lg border border-burgundy-200">
        {/* User Info Header */}
        <DropdownMenuLabel className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-burgundy-600 text-white flex items-center justify-center font-medium">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                getInitials()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-burgundy-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-burgundy-700 truncate">
                {user.emailAddresses[0]?.emailAddress}
              </p>
              <div className="flex items-center mt-1">
                <Badge variant="outline" className="text-xs border-burgundy-300 text-burgundy-700 bg-burgundy-50">
                  {currentUser.role}
                </Badge>
                {isAdmin && (
                  <Shield className="w-3 h-3 text-burgundy-700 ml-1" />
                )}
              </div>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-burgundy-200" />

        {/* Quick Links Section */}
        <div className="p-2">
          <p className="text-xs font-semibold text-burgundy-600 uppercase tracking-wider px-2 mb-2">
            Quick Access
          </p>
          {quickLinks.map((link) => (
            <DropdownMenuItem key={link.href} asChild className="cursor-pointer">
              <Link href={link.href} className="flex items-center px-2 py-2 rounded-md hover:bg-burgundy-50">
                <link.icon className="w-4 h-4 mr-3 text-burgundy-700" />
                <span className="flex-1 text-sm text-burgundy-900">{link.label}</span>
                {link.badge && typeof link.badge === 'number' && link.badge > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 text-xs bg-burgundy-600 text-white">
                    {link.badge}
                  </Badge>
                )}
              </Link>
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator className="bg-burgundy-200" />

        {/* Profile */}
        <div className="p-2">
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/settings/profile" className="flex items-center px-2 py-2 rounded-md hover:bg-burgundy-50">
              <User className="w-4 h-4 mr-3 text-burgundy-700" />
              <span className="text-sm text-burgundy-900">Profile</span>
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-burgundy-200" />

        {/* Sign Out */}
        <div className="p-2">
          <DropdownMenuItem 
            onClick={handleSignOut}
            className="cursor-pointer flex items-center px-2 py-2 rounded-md hover:bg-red-50 text-red-600 hover:text-red-700"
          >
            <LogOut className="w-4 h-4 mr-3" />
            <span className="text-sm font-medium">Sign Out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 