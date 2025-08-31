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

export default function AdminDashboardPage() {
  // Get users data
  const users = useQuery(api.admin.getUsers, {}) || [];
  
  // Get shops data with their status counts
  const shops = useQuery(api.admin.getShops, {}) || [];
  
  // Get products data
  const products = useQuery(api.admin.getProducts, {}) || [];
  
  // Get services data
  const services = useQuery(api.admin.getServices, {}) || [];
  
  // Mock data for recent activity
  const recentActivity = [
    {
      id: 1,
      type: "shop_created",
      user: "Jane Cooper",
      details: "Created new shop: 'Jane's Boutique'",
      time: "10 minutes ago"
    },
    {
      id: 2,
      type: "shop_approval",
      user: "System",
      details: "Shop 'Tech Haven' is pending approval",
      time: "30 minutes ago"
    },
    {
      id: 3,
      type: "product_added",
      user: "Alex Morgan",
      details: "Added 5 new products to 'Sports World'",
      time: "2 hours ago"
    },
    {
      id: 4,
      type: "user_registered",
      user: "Robert Johnson",
      details: "New user registered",
      time: "5 hours ago"
    }
  ];
  
  // Show loading state while data is being fetched
  if (users.length === 0 && shops.length === 0 && products.length === 0 && services.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-blue-600 mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }
  
  // Extract counts and data
  const userCount = users.length;
  const shopCount = shops.length;
  const pendingShopCount = shops.filter((shop: Shop) => shop.status === "pending_approval").length;
  const productCount = products.length;
  const serviceCount = services.length;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Admin Dashboard</h1>
        <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100 hover:text-blue-600">
          Admin Mode
        </Badge>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold text-gray-800">{userCount}</p>
                <p className="text-xs text-gray-500">Registered users</p>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Shops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold text-gray-800">{shopCount}</p>
                <p className="text-xs text-gray-500">
                  {pendingShopCount > 0 ? 
                    <span className="text-amber-600">{pendingShopCount} pending approval</span> : 
                    "All approved"}
                </p>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Store className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold text-gray-800">{productCount}</p>
                <p className="text-xs text-gray-500">Listed products</p>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold text-gray-800">{serviceCount}</p>
                <p className="text-xs text-gray-500">Available services</p>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shops pending approval */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-blue-600">Pending Approvals</CardTitle>
            <CardDescription>Shops waiting for admin approval</CardDescription>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto">
            {pendingShopCount > 0 ? (
              <div className="space-y-4">
                {shops
                  .filter((shop: Shop) => shop.status === "pending_approval")
                  .map((shop: Shop) => (
                    <div key={shop._id} className="flex items-center p-3 border rounded-lg hover:bg-blue-50 transition-colors">
                      <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                        <Clock className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{shop.shopName}</p>
                        <p className="text-xs text-gray-500">
                          Submitted {new Date(shop.createdAt).toLocaleDateString()} • {shop.shopType === "product_shop" ? "Products" : "Services"}
                        </p>
                      </div>
                      <Link href={`/admin/shops/${shop._id}`}>
                        <Button variant="outline" size="sm">
                          Review
                        </Button>
                      </Link>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-6">
                <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
                <p className="text-gray-600">No shops are currently pending approval.</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Link href="/admin/shops?status=pending" className="text-blue-600 text-sm flex items-center hover:underline">
              View all pending shops <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardFooter>
        </Card>
        
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-blue-600">Recent Activity</CardTitle>
            <CardDescription>Latest actions and events</CardDescription>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto">
            <div className="space-y-4">
              {recentActivity.map(activity => (
                <div key={activity.id} className="flex items-start p-3 border rounded-lg hover:bg-blue-50 transition-colors">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    {activity.type === "shop_created" && (
                      <Store className="h-4 w-4 text-blue-600" />
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
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{activity.user}</p>
                    <p className="text-sm text-gray-600">{activity.details}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Link href="/admin/activity" className="text-blue-600 text-sm flex items-center hover:underline">
              View all activity <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardFooter>
        </Card>
        
        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg text-blue-600">Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/admin/users/new">
                <div className="p-4 border rounded-lg hover:bg-blue-50 transition-colors h-full flex flex-col">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-800 mb-2">Add New User</h3>
                  <p className="text-sm text-gray-600 flex-1">Create a new user account with specified permissions</p>
                  <div className="flex items-center mt-3 text-blue-600 text-sm">
                    <span>Add user</span>
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </div>
                </div>
              </Link>
              
              <Link href="/admin/shops/approve">
                <div className="p-4 border rounded-lg hover:bg-blue-50 transition-colors h-full flex flex-col">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-800 mb-2">Approve Shops</h3>
                  <p className="text-sm text-gray-600 flex-1">Review and approve pending shop submissions</p>
                  <div className="flex items-center mt-3 text-blue-600 text-sm">
                    <span>Review shops</span>
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </div>
                </div>
              </Link>
              
              <Link href="/admin/categories/manage">
                <div className="p-4 border rounded-lg hover:bg-blue-50 transition-colors h-full flex flex-col">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <Store className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-800 mb-2">Manage Categories</h3>
                  <p className="text-sm text-gray-600 flex-1">Update product and service categories</p>
                  <div className="flex items-center mt-3 text-blue-600 text-sm">
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