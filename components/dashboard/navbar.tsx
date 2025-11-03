"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CustomUserButton from '../user-button';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Bell,
  Home,
  Settings,
  Menu,
  X,
  Store,
  Users,
  ShoppingBag,
  BarChart3,
  CheckCircle,
  Clock,
  Plus,
  FileText,
  MessageSquare,
  TrendingUp,
  Package,
  UserCheck,
  ChevronDown,
  ChevronRight,
  Building2,
  Calendar,
  CreditCard,
  HelpCircle,
  Shield,
  Activity,
  Trash2,
  Heart,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: NavItem[];
}

export default function DashboardNavbar() {
  const currentUser = useQuery(api.users.getCurrentUser);
  const unreadNotifications = useQuery(api.notifications.getUnreadCount);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['main']);

  const isAdmin = currentUser?.role === 'admin';
  const isVendor = currentUser?.role === 'vendor';
  const isCustomer = currentUser?.role === 'customer';

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  // Main navigation items for all users
  const mainNavItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: isAdmin ? '/admin' : isVendor ? '/vendor' : '/dashboard',
      icon: Home,
    },
    {
      title: 'Browse Shops',
      href: '/shops',
      icon: ShoppingBag,
    },
  ];

  // Admin navigation items
  const adminNavItems: NavItem[] = [
    {
      title: 'User Management',
      href: '/admin/users',
      icon: Users,
      children: [
        { title: 'All Users', href: '/admin/users', icon: Users },
        { title: 'Admin Users', href: '/admin/users?role=admin', icon: Shield },
        { title: 'Vendors', href: '/admin/users?role=vendor', icon: Building2 },
        { title: 'Customers', href: '/admin/users?role=customer', icon: UserCheck },
      ]
    },
    {
      title: 'Shop Management',
      href: '/admin/shops',
      icon: Store,
      children: [
        { title: 'All Shops', href: '/admin/shops', icon: Store },
        { title: 'Pending Approval', href: '/admin/shops/approve', icon: Clock, badge: 'New' },
        { title: 'Active Shops', href: '/admin/shops?status=active', icon: CheckCircle },
        { title: 'Rejected Shops', href: '/admin/shops?status=rejected', icon: Trash2 },
      ]
    },
    {
      title: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      children: [
        { title: 'Overview', href: '/admin/analytics', icon: TrendingUp },
        { title: 'Shop Performance', href: '/admin/analytics/shops', icon: Activity },
        { title: 'User Activity', href: '/admin/analytics/users', icon: Users },
        { title: 'Revenue', href: '/admin/analytics/revenue', icon: CreditCard },
      ]
    },
    {
      title: 'Subscriptions',
      href: '/admin/subscriptions',
      icon: CreditCard,
      children: [
        { title: 'Manage Packages', href: '/admin/subscriptions', icon: Package },
        { title: 'User Subscriptions', href: '/admin/subscriptions/users', icon: Users },
        { title: 'Revenue Analytics', href: '/admin/subscriptions/analytics', icon: TrendingUp },
      ]
    },
    {
      title: 'Content Management',
      href: '/admin/content',
      icon: FileText,
      children: [
        { title: 'Featured Shops', href: '/admin/content/featured', icon: TrendingUp },
        { title: 'Categories', href: '/admin/content/categories', icon: Package },
        { title: 'Announcements', href: '/admin/content/announcements', icon: Bell },
      ]
    },
    {
      title: 'Messages',
      href: '/admin/messages',
      icon: MessageSquare,
    },
  ];

  // Vendor navigation items
  const vendorNavItems: NavItem[] = [
    {
      title: 'My Shops',
      href: '/vendor/shops',
      icon: Store,
      children: [
        { title: 'All My Shops', href: '/vendor/shops', icon: Store },
        { title: 'Create New Shop', href: '/vendor/shops/create', icon: Plus },
        { title: 'Shop Analytics', href: '/vendor/analytics', icon: BarChart3 },
      ]
    },
    {
      title: 'Products & Services',
      href: '/vendor/inventory',
      icon: Package,
      children: [
        { title: 'Manage Inventory', href: '/vendor/inventory', icon: Package },
        { title: 'Add Products', href: '/vendor/inventory/products/new', icon: Plus },
        { title: 'Add Services', href: '/vendor/inventory/services/new', icon: Plus },
      ]
    },
    {
      title: 'Orders & Bookings',
      href: '/vendor/orders',
      icon: Calendar,
      badge: 5,
    },
    {
      title: 'Messages',
      href: '/vendor/messages',
      icon: MessageSquare,
      badge: 3,
    },
  ];

  // Customer navigation items
  const customerNavItems: NavItem[] = [
    {
      title: 'My Orders',
      href: '/customer/orders',
      icon: ShoppingBag,
    },
    {
      title: 'Favorites',
      href: '/customer/favorites',
      icon: Heart,
    },
    {
      title: 'Messages',
      href: '/customer/messages',
      icon: MessageSquare,
    },
  ];

  // Settings and support items for all users
  const settingsNavItems: NavItem[] = [
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
      children: [
        { title: 'Profile', href: '/settings/profile', icon: Users },
        { title: 'Notifications', href: '/settings/notifications', icon: Bell },
        { title: 'Privacy', href: '/settings/privacy', icon: Shield },
      ]
    },
    {
      title: 'Help & Support',
      href: '/support',
      icon: HelpCircle,
      children: [
        { title: 'Help Center', href: '/support/help', icon: HelpCircle },
        { title: 'Contact Support', href: '/support/contact', icon: MessageSquare },
        { title: 'Report Issue', href: '/support/report', icon: FileText },
      ]
    },
  ];

  const isActiveLink = (href: string) => {
    if (href === '/admin' || href === '/vendor' || href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const renderNavItem = (item: NavItem, level: number = 0) => {
    const isActive = isActiveLink(item.href);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedSections.includes(item.href);
    const Icon = item.icon;

    return (
      <div key={item.href}>
        {hasChildren ? (
          <button
            onClick={() => toggleSection(item.href)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 text-left hover:bg-burgundy-50 transition-colors rounded-lg",
              isActive && "bg-burgundy-50 text-burgundy-700"
            )}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5 text-burgundy-700" />
              <span className={cn("font-medium", isActive ? "text-burgundy-700" : "text-burgundy-900")}>
                {item.title}
              </span>
              {item.badge && (
                <Badge variant="secondary" className="h-5 text-xs bg-burgundy-600 text-white">
                  {item.badge}
                </Badge>
              )}
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-burgundy-700" />
            ) : (
              <ChevronRight className="w-4 h-4 text-burgundy-700" />
            )}
          </button>
        ) : (
          <Link
            href={item.href}
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 hover:bg-burgundy-50 transition-colors rounded-lg",
              isActive && "bg-burgundy-50 text-burgundy-700"
            )}
          >
            <Icon className="w-5 h-5 text-burgundy-700" />
            <span className={cn("font-medium flex-1", isActive ? "text-burgundy-700" : "text-burgundy-900")}>
              {item.title}
            </span>
            {item.badge && (
              <Badge variant="secondary" className="h-5 text-xs bg-burgundy-600 text-white">
                {item.badge}
              </Badge>
            )}
          </Link>
        )}
        {hasChildren && isExpanded && (
          <div className="mt-1 ml-4 space-y-1 border-l-2 border-burgundy-200 pl-4">
            {item.children!.map(child => {
              const ChildIcon = child.icon;
              const childIsActive = isActiveLink(child.href);
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 hover:bg-burgundy-50 transition-colors rounded-lg",
                    childIsActive && "bg-burgundy-50 text-burgundy-700"
                  )}
                >
                  <ChildIcon className="w-4 h-4 text-burgundy-600" />
                  <span className={cn("text-sm flex-1", childIsActive ? "text-burgundy-700 font-medium" : "text-burgundy-800")}>
                    {child.title}
                  </span>
                  {child.badge && (
                    <Badge variant="secondary" className="h-4 text-xs bg-burgundy-600 text-white">
                      {child.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderSection = (title: string, items: NavItem[]) => (
    <div className="space-y-1">
      <h3 className="px-4 text-xs font-semibold text-burgundy-600 uppercase tracking-wider mb-2">
        {title}
      </h3>
      {items.map(item => renderNavItem(item))}
    </div>
  );

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
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setMobileMenuOpen(true)}
              className="text-burgundy-700 hover:text-burgundy-900 hover:bg-burgundy-50"
            >
              <Menu className="w-4 h-4" />
            </Button>

            {mounted ? (
              <CustomUserButton />
            ) : (
              <div className="w-8 h-8 bg-burgundy-200 rounded-full animate-pulse"></div>
            )}
          </div>

          {/* Mobile Menu Dialog */}
          <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <DialogContent className="fixed left-0 top-0 h-screen w-[85vw] max-w-sm translate-x-0 translate-y-0 rounded-none rounded-r-xl border-r border-burgundy-200 p-0 flex flex-col data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left [&>button:last-child]:hidden">
              <DialogHeader className="border-b border-burgundy-200 px-6 py-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-lg font-bold text-burgundy-900 flex items-center gap-2">
                    <Image
                      src="/logo.png"
                      alt="ConnectCom Logo"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                    <span>Menu</span>
                  </DialogTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-burgundy-700 hover:text-burgundy-900 hover:bg-burgundy-50"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </DialogHeader>
              
              <div className="flex-1 overflow-y-auto py-4 space-y-6 min-h-0">
                {/* Main Navigation */}
                {renderSection("Main", mainNavItems)}

                <Separator className="mx-4 bg-burgundy-200" />

                {/* Role-specific Navigation */}
                {isAdmin && renderSection("Administration", adminNavItems)}
                {isVendor && renderSection("Vendor Tools", vendorNavItems)}
                {isCustomer && renderSection("My Account", customerNavItems)}

                <Separator className="mx-4 bg-burgundy-200" />

                {/* Settings & Support */}
                {renderSection("Settings", settingsNavItems)}

                {/* Back to Home */}
                <div className="px-4 pt-4 border-t border-burgundy-200">
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-burgundy-50 transition-colors rounded-lg text-burgundy-900"
                  >
                    <Home className="w-5 h-5 text-burgundy-700" />
                    <span className="font-medium">Back to Home</span>
                  </Link>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </nav>
  );
}
