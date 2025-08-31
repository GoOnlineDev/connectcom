"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Package, Calendar, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function VendorDashboardPage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [clerkId, setClerkId] = useState<string | null>(null);
  
  // Set Clerk ID when user is loaded
  useEffect(() => {
    if (isUserLoaded && user) {
      setClerkId(user.id);
    }
  }, [isUserLoaded, user]);
  
  // Get current user from Convex
  const convexUser = useQuery(api.users.getCurrentUser);
  
  // Get shops owned by the user
  const shops = useQuery(
    api.shops.getShopsByOwner, 
    clerkId ? { ownerId: clerkId } : "skip"
  );
  
  // Get products for the first shop (if any)
  const firstShopId = shops && shops.length > 0 ? shops[0]._id : null;
  const products = useQuery(
    api.products.getProductsByShop,
    firstShopId ? { shopId: firstShopId } : "skip"
  );
  
  // Get services for the first shop (if any)
  const services = useQuery(
    api.services.getServicesByShop,
    firstShopId ? { shopId: firstShopId } : "skip"
  );
  
  // Show loading state while data is being fetched
  if (!convexUser || !shops) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-burgundy mb-6">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }
  
  // Handle case when user has no shops
  if (shops.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-burgundy mb-6">Welcome to Your Vendor Dashboard</h1>
        <Card className="bg-white mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-burgundy">Get Started</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-amber-500 mr-4" />
              <div>
                <p className="text-gray-700">You don't have any shops yet. Create your first shop to start selling.</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/onboarding/shop">
              <Button className="bg-burgundy hover:bg-burgundy-dark text-white">
                Create Shop
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Count of pending shops
  const pendingShops = shops.filter(shop => shop.status === "pending_approval").length;
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-burgundy mb-6">Dashboard Overview</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Shops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold text-gray-800">{shops.length}</p>
                <p className="text-xs text-gray-500">{pendingShops > 0 ? `${pendingShops} pending approval` : 'All approved'}</p>
              </div>
              <Store className="h-8 w-8 text-burgundy opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold text-gray-800">{products?.length || 0}</p>
                <p className="text-xs text-gray-500">Active products</p>
              </div>
              <Package className="h-8 w-8 text-burgundy opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold text-gray-800">{services?.length || 0}</p>
                <p className="text-xs text-gray-500">Active services</p>
              </div>
              <Calendar className="h-8 w-8 text-burgundy opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold text-gray-800">0</p>
                <p className="text-xs text-gray-500">Coming soon</p>
              </div>
              <TrendingUp className="h-8 w-8 text-burgundy opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Shop List and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg text-burgundy">My Shops</CardTitle>
            <CardDescription>Manage your shops and view their status</CardDescription>
          </CardHeader>
          <CardContent className="max-h-64 overflow-y-auto">
            <div className="space-y-4">
              {shops.map(shop => (
                <div key={shop._id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                    {shop.shopLogoUrl ? (
                      <Image 
                        src={shop.shopLogoUrl} 
                        alt={shop.shopName} 
                        width={40} 
                        height={40} 
                        className="rounded-full" 
                      />
                    ) : (
                      <Store className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{shop.shopName}</p>
                    <p className="text-xs text-gray-500">
                      {shop.status === "active" ? (
                        <span className="text-green-600">Active</span>
                      ) : shop.status === "pending_approval" ? (
                        <span className="text-amber-600">Pending Approval</span>
                      ) : (
                        <span className="text-red-600">Inactive</span>
                      )}
                      {" • "}
                      {shop.shopType === "product_shop" ? "Products" : "Services"}
                    </p>
                  </div>
                  <Link href={`/vendor/shops/${shop._id}`}>
                    <Button variant="outline" size="sm" className="text-xs">
                      Manage
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Link href="/vendor/shops">
              <Button variant="outline" className="text-burgundy">View All Shops</Button>
            </Link>
            <Link href="/onboarding/shop" className="ml-auto">
              <Button className="bg-burgundy hover:bg-burgundy-dark text-white">Add New Shop</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="bg-white hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg text-burgundy">Quick Actions</CardTitle>
            <CardDescription>Manage your products and services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Link href="/vendor/products/new">
                <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer flex items-center">
                  <Package className="h-5 w-5 text-burgundy mr-3" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Add New Product</p>
                    <p className="text-xs text-gray-500">Create a product listing for your shop</p>
                  </div>
                </div>
              </Link>
              
              <Link href="/vendor/services/new">
                <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer flex items-center">
                  <Calendar className="h-5 w-5 text-burgundy mr-3" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Add New Service</p>
                    <p className="text-xs text-gray-500">Create a service listing for your shop</p>
                  </div>
                </div>
              </Link>
              
              <Link href="/vendor/settings">
                <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer flex items-center">
                  <div className="h-5 w-5 flex items-center justify-center text-burgundy mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Account Settings</p>
                    <p className="text-xs text-gray-500">Update your profile and preferences</p>
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