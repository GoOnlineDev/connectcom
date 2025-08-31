"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Home,
  Store,
  Users,
  ShoppingBag,
  BarChart3,
  Settings,
  Bell,
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
  Eye,
  Edit,
  Trash2,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: NavItem[];
}

export default function DashboardSidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const currentUser = useQuery(api.users.getCurrentUser);
  const [expandedSections, setExpandedSections] = useState<string[]>(['main']);

  const isAdmin = currentUser?.role === 'admin';
  const isVendor = currentUser?.role === 'vendor';
  const isCustomer = currentUser?.role === 'customer';

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

    return (
      <div key={item.href}>
        <div className={cn("flex items-center", level > 0 && "ml-4")}>
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection(item.href)}
              className={cn(
                "w-full justify-start text-left h-9 px-3",
                isActive 
                  ? "bg-burgundy/10 text-burgundy border-r-2 border-burgundy" 
                  : "text-burgundy/70 hover:text-burgundy hover:bg-burgundy/5"
              )}
            >
              <item.icon className="w-4 h-4 mr-3" />
              <span className="flex-1">{item.title}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-2 h-5 text-xs bg-burgundy text-white">
                  {item.badge}
                </Badge>
              )}
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 ml-2" />
              ) : (
                <ChevronRight className="w-4 h-4 ml-2" />
              )}
            </Button>
          ) : (
            <Link href={item.href} className="w-full">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start text-left h-9 px-3",
                  isActive 
                    ? "bg-burgundy/10 text-burgundy border-r-2 border-burgundy" 
                    : "text-burgundy/70 hover:text-burgundy hover:bg-burgundy/5"
                )}
              >
                <item.icon className="w-4 h-4 mr-3" />
                <span className="flex-1">{item.title}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-2 h-5 text-xs bg-burgundy text-white">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            </Link>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderSection = (title: string, items: NavItem[]) => (
    <div className="space-y-1">
      <h3 className="px-3 text-xs font-semibold text-burgundy/60 uppercase tracking-wider">
        {title}
      </h3>
      {items.map(item => renderNavItem(item))}
    </div>
  );

  return (
    <div className={cn("flex flex-col h-full bg-white border-r border-burgundy/20", className)}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-burgundy/20">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-burgundy rounded-lg flex items-center justify-center">
            <Store className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-burgundy">Dashboard</h2>
            <p className="text-xs text-burgundy/60 capitalize">
              {currentUser?.role || 'Loading...'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 space-y-6">
        {/* Main Navigation */}
        {renderSection("Main", mainNavItems)}

        <Separator className="mx-3 bg-burgundy/20" />

        {/* Role-specific Navigation */}
        {isAdmin && renderSection("Administration", adminNavItems)}
        {isVendor && renderSection("Vendor Tools", vendorNavItems)}
        {isCustomer && renderSection("My Account", customerNavItems)}

        <Separator className="mx-3 bg-burgundy/20" />

        {/* Settings & Support */}
        {renderSection("Settings", settingsNavItems)}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-burgundy/20">
        <div className="text-xs text-burgundy/60 text-center">
          <p>ConnectCom Dashboard</p>
          <p className="mt-1">v1.0.0</p>
        </div>
      </div>
    </div>
  );
}
