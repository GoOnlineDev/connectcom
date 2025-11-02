"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Store, Package, Calendar, Clock, MapPin, Mail, Phone, Globe, PlusCircle, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { slugify } from "@/lib/utils";

export default function VendorShopsPage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [clerkId, setClerkId] = useState<string | null>(null);
  
  // Set Clerk ID when user is loaded
  useEffect(() => {
    if (isUserLoaded && user) {
      setClerkId(user.id);
    }
  }, [isUserLoaded, user]);
  
  // Get shops owned by the user
  const shops = useQuery(
    api.shops.getShopsByOwner, 
    clerkId ? { ownerId: clerkId } : "skip"
  );
  
  // Show loading state while data is being fetched
  if (!shops) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-burgundy">My Shops</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 gap-6">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }
  
  // Filter shops by status
  const pendingShops = shops.filter(shop => shop.status === "pending_approval");
  const activeShops = shops.filter(shop => shop.status === "active");
  const inactiveShops = shops.filter(shop => shop.status !== "active" && shop.status !== "pending_approval");
  
  // Handle case when user has no shops
  if (shops.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-burgundy">My Shops</h1>
          <Link href="/onboarding/shop">
            <Button className="bg-burgundy hover:bg-burgundy-dark text-white">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Shop
            </Button>
          </Link>
        </div>
        
        <Card className="bg-white">
          <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center text-center">
            <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No Shops Found</h3>
            <p className="text-gray-600 mb-6 max-w-md">
              You haven't created any shops yet. Create your first shop to start selling products or services.
            </p>
            <Link href="/onboarding/shop">
              <Button className="bg-burgundy hover:bg-burgundy-dark text-white">
                Create Your First Shop
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Render a shop card
  const renderShopCard = (shop: any) => (
    <Card key={shop._id} className="bg-white hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
              {shop.shopLogoUrl ? (
                <Image 
                  src={shop.shopLogoUrl} 
                  alt={shop.shopName} 
                  width={48} 
                  height={48} 
                  className="rounded-full" 
                />
              ) : (
                <Store className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <div>
              <CardTitle className="text-xl text-gray-800">{shop.shopName}</CardTitle>
              <div className="flex items-center mt-1">
                <Badge className={
                  shop.status === "active" 
                    ? "bg-green-100 text-green-800 hover:bg-green-100" 
                    : shop.status === "pending_approval" 
                    ? "bg-amber-100 text-amber-800 hover:bg-amber-100" 
                    : "bg-red-100 text-red-800 hover:bg-red-100"
                }>
                  {shop.status === "active" 
                    ? "Active" 
                    : shop.status === "pending_approval" 
                    ? "Pending Approval" 
                    : "Inactive"}
                </Badge>
                <Badge className="ml-2 bg-gray-100 text-gray-800 hover:bg-gray-100">
                  {shop.shopType === "product_shop" ? "Products" : "Services"}
                </Badge>
              </div>
            </div>
          </div>
          <Link href={`/shops/${shop._id}/${slugify(shop.shopName)}`}>
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-gray-600 text-sm mb-4">
          {shop.description ? (
            shop.description.length > 150 
              ? `${shop.description.substring(0, 150)}...` 
              : shop.description
          ) : (
            "No description provided."
          )}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {shop.contactInfo?.email && (
            <div className="flex items-center text-gray-600">
              <Mail className="h-4 w-4 mr-2" />
              <span className="truncate">{shop.contactInfo.email}</span>
            </div>
          )}
          
          {shop.contactInfo?.phone && (
            <div className="flex items-center text-gray-600">
              <Phone className="h-4 w-4 mr-2" />
              <span>{shop.contactInfo.phone}</span>
            </div>
          )}
          
          {shop.contactInfo?.website && (
            <div className="flex items-center text-gray-600">
              <Globe className="h-4 w-4 mr-2" />
              <span className="truncate">{shop.contactInfo.website}</span>
            </div>
          )}
          
          {shop.operatingHours && (
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              <span className="truncate">{shop.operatingHours.toString()}</span>
            </div>
          )}
          
          {shop.physicalLocation && (
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="truncate">{shop.physicalLocation.toString()}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <div className="flex space-x-4">
          <div className="flex items-center text-gray-600 text-sm">
            <Package className="h-4 w-4 mr-1" />
            <span>0 Products</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar className="h-4 w-4 mr-1" />
            <span>0 Services</span>
          </div>
        </div>
        <div>
          <span className="text-xs text-gray-500">
            Created {new Date(shop.createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-burgundy">My Shops</h1>
        <Link href="/onboarding/shop">
          <Button className="bg-burgundy hover:bg-burgundy-dark text-white">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Shop
          </Button>
        </Link>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Shops ({shops.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeShops.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingShops.length})</TabsTrigger>
          {inactiveShops.length > 0 && (
            <TabsTrigger value="inactive">Inactive ({inactiveShops.length})</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          {shops.map(renderShopCard)}
        </TabsContent>
        
        <TabsContent value="active" className="space-y-6">
          {activeShops.length > 0 ? (
            activeShops.map(renderShopCard)
          ) : (
            <Card className="bg-white">
              <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center text-center">
                <AlertCircle className="h-8 w-8 text-amber-500 mb-3" />
                <p className="text-gray-600">
                  You don't have any active shops. Your shops may be pending approval.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-6">
          {pendingShops.length > 0 ? (
            pendingShops.map(renderShopCard)
          ) : (
            <Card className="bg-white">
              <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center text-center">
                <AlertCircle className="h-8 w-8 text-green-500 mb-3" />
                <p className="text-gray-600">
                  You don't have any shops pending approval.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {inactiveShops.length > 0 && (
          <TabsContent value="inactive" className="space-y-6">
            {inactiveShops.map(renderShopCard)}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
} 