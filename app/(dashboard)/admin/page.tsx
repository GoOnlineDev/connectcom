"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Store, 
  ShoppingBag, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  ArrowUpRight,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Doc } from "@/convex/_generated/dataModel";

// Define shop type for TypeScript
type Shop = Doc<"shops">;

// Define activity type
type Activity = {
  id: string;
  type: string;
  entityType: string;
  entityId: string;
  entityName: string;
  userId?: string;
  userName?: string;
  timestamp: number;
  details?: string;
};

export default function AdminDashboardPage() {
  // Get dashboard stats
  const stats = useQuery(api.admin.getDashboardStats, {});
  
  // Get shops data for pending approvals
  const shops = useQuery(api.admin.getShops, {}) || [];
  
  // Get recent activity
  const recentActivity = useQuery(api.admin.getRecentActivity, { limit: 10 }) || [];
  
  // Format time ago helper
  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    const days = Math.floor(hours / 24);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  };
  
  // Show loading state while data is being fetched
  if (stats === undefined || recentActivity === undefined || shops === undefined) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-burgundy mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-white">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-16 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }
  
  // Extract counts from stats
  const userCount = stats?.totalUsers || 0;
  const shopCount = stats?.totalShops || 0;
  const pendingShopCount = stats?.pendingShops || 0;
  const productCount = stats?.totalProducts || 0;
  const serviceCount = stats?.totalServices || 0;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-burgundy">Admin Dashboard</h1>
        <Badge className="bg-burgundy-600 text-white hover:bg-burgundy-700">
          Admin Mode
        </Badge>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white hover:shadow-md transition-shadow border-burgundy/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-burgundy/70">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold text-burgundy">{userCount}</p>
                <p className="text-xs text-burgundy/60">Registered users</p>
              </div>
              <div className="h-10 w-10 bg-burgundy/10 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-burgundy" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white hover:shadow-md transition-shadow border-burgundy/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-burgundy/70">Shops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold text-burgundy">{shopCount}</p>
                <p className="text-xs text-burgundy/60">
                  {pendingShopCount > 0 ? 
                    <span className="text-amber-600">{pendingShopCount} pending approval</span> : 
                    "All approved"}
                </p>
              </div>
              <div className="h-10 w-10 bg-burgundy/10 rounded-full flex items-center justify-center">
                <Store className="h-5 w-5 text-burgundy" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white hover:shadow-md transition-shadow border-burgundy/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-burgundy/70">Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold text-burgundy">{productCount}</p>
                <p className="text-xs text-burgundy/60">Listed products</p>
              </div>
              <div className="h-10 w-10 bg-burgundy/10 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-burgundy" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white hover:shadow-md transition-shadow border-burgundy/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-burgundy/70">Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold text-burgundy">{serviceCount}</p>
                <p className="text-xs text-burgundy/60">Available services</p>
              </div>
              <div className="h-10 w-10 bg-burgundy/10 rounded-full flex items-center justify-center">
                <Calendar className="h-5 w-5 text-burgundy" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Shops pending approval */}
        <Card className="bg-white border-burgundy/10">
          <CardHeader>
            <CardTitle className="text-lg text-burgundy">Pending Approvals</CardTitle>
            <CardDescription className="text-burgundy/70">Shops waiting for admin approval</CardDescription>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto">
            {pendingShopCount > 0 ? (
              <div className="space-y-3 md:space-y-4">
                {shops
                  .filter((shop: Shop) => shop.status === "pending_approval")
                  .sort((a: Shop, b: Shop) => b.createdAt - a.createdAt)
                  .slice(0, 5)
                  .map((shop: Shop) => (
                    <Link key={shop._id} href={`/admin/shops/${shop._id}`}>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center p-3 border border-burgundy/10 rounded-lg hover:bg-burgundy/5 transition-colors gap-3">
                        <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Clock className="h-5 w-5 text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-burgundy truncate">{shop.shopName}</p>
                          <p className="text-xs text-burgundy/60">
                            Submitted {formatTimeAgo(shop.createdAt)} • {shop.shopType === "product_shop" ? "Products" : "Services"}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="border-burgundy text-burgundy hover:bg-burgundy/10 w-full sm:w-auto">
                          Review
                        </Button>
                      </div>
                    </Link>
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-6">
                <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
                <p className="text-burgundy/70">No shops are currently pending approval.</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t border-burgundy/10 pt-4">
            <Link href="/admin/shops?status=pending" className="text-burgundy text-sm flex items-center hover:underline">
              View all pending shops <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardFooter>
        </Card>
        
        {/* Recent Activity */}
        <Card className="bg-white border-burgundy/10">
          <CardHeader>
            <CardTitle className="text-lg text-burgundy">Recent Activity</CardTitle>
            <CardDescription className="text-burgundy/70">Latest actions and events</CardDescription>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto">
            {recentActivity.length > 0 ? (
              <div className="space-y-3 md:space-y-4">
                {recentActivity.map((activity: Activity) => (
                  <div key={activity.id} className="flex items-start p-3 border border-burgundy/10 rounded-lg hover:bg-burgundy/5 transition-colors">
                    <div className="h-8 w-8 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      {activity.type === "shop_created" && (
                        <Store className="h-4 w-4 text-burgundy" />
                      )}
                      {activity.type === "shop_approval" && (
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                      )}
                      {activity.type === "product_added" && (
                        <ShoppingBag className="h-4 w-4 text-green-600" />
                      )}
                      {activity.type === "user_registered" && (
                        <Users className="h-4 w-4 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-burgundy truncate">{activity.userName || "System"}</p>
                      <p className="text-sm text-burgundy/70 truncate">{activity.details || `${activity.type} - ${activity.entityName}`}</p>
                      <p className="text-xs text-burgundy/60 mt-1">{formatTimeAgo(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-6">
                <Clock className="h-12 w-12 text-burgundy/40 mb-3" />
                <p className="text-burgundy/70">No recent activity</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t border-burgundy/10 pt-4">
            <Link href="/admin/activity" className="text-burgundy text-sm flex items-center hover:underline">
              View all activity <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardFooter>
        </Card>
        
        {/* Quick Actions */}
        <Card className="lg:col-span-2 bg-white border-burgundy/10">
          <CardHeader>
            <CardTitle className="text-lg text-burgundy">Quick Actions</CardTitle>
            <CardDescription className="text-burgundy/70">Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Link href="/admin/users/new">
                <div className="p-4 border border-burgundy/10 rounded-lg hover:bg-burgundy/5 transition-colors h-full flex flex-col">
                  <div className="h-10 w-10 bg-burgundy/10 rounded-full flex items-center justify-center mb-3">
                    <Users className="h-5 w-5 text-burgundy" />
                  </div>
                  <h3 className="font-medium text-burgundy mb-2">Add New User</h3>
                  <p className="text-sm text-burgundy/70 flex-1">Create a new user account with specified permissions</p>
                  <div className="flex items-center mt-3 text-burgundy text-sm">
                    <span>Add user</span>
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </div>
                </div>
              </Link>
              
              <Link href="/admin/shops/approve">
                <div className="p-4 border border-burgundy/10 rounded-lg hover:bg-burgundy/5 transition-colors h-full flex flex-col">
                  <div className="h-10 w-10 bg-burgundy/10 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle className="h-5 w-5 text-burgundy" />
                  </div>
                  <h3 className="font-medium text-burgundy mb-2">Approve Shops</h3>
                  <p className="text-sm text-burgundy/70 flex-1">Review and approve pending shop submissions</p>
                  <div className="flex items-center mt-3 text-burgundy text-sm">
                    <span>Review shops</span>
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </div>
                </div>
              </Link>
              
              <Link href="/admin/categories/manage">
                <div className="p-4 border border-burgundy/10 rounded-lg hover:bg-burgundy/5 transition-colors h-full flex flex-col">
                  <div className="h-10 w-10 bg-burgundy/10 rounded-full flex items-center justify-center mb-3">
                    <Store className="h-5 w-5 text-burgundy" />
                  </div>
                  <h3 className="font-medium text-burgundy mb-2">Manage Categories</h3>
                  <p className="text-sm text-burgundy/70 flex-1">Update product and service categories</p>
                  <div className="flex items-center mt-3 text-burgundy text-sm">
                    <span>Edit categories</span>
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 