"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Calendar, Plus, Store } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function VendorInventoryPage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [clerkId, setClerkId] = useState<string | null>(null);
  
  useEffect(() => {
    if (isUserLoaded && user) {
      setClerkId(user.id);
    }
  }, [isUserLoaded, user]);
  
  const shops = useQuery(
    api.shops.getShopsByOwner, 
    clerkId ? { ownerId: clerkId } : "skip"
  );

  if (!shops) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-burgundy">Inventory Management</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (shops.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-burgundy">Inventory Management</h1>
        </div>
        <Card className="bg-white border-burgundy/10">
          <CardContent className="flex flex-col items-center justify-center text-center py-12">
            <Package className="h-16 w-16 text-burgundy/40 mb-4" />
            <h3 className="text-xl font-semibold text-burgundy mb-2">No Shops Found</h3>
            <p className="text-burgundy/70 mb-6 max-w-md">
              Create a shop first to manage your inventory.
            </p>
            <Link href="/onboarding/shop">
              <Button className="bg-burgundy hover:bg-burgundy-dark text-white">
                Create Shop
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-burgundy">Inventory Management</h1>
        <div className="flex gap-2">
          <Link href="/vendor/inventory/products/new">
            <Button className="bg-burgundy hover:bg-burgundy-dark text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
          <Link href="/vendor/inventory/services/new">
            <Button variant="outline" className="border-burgundy text-burgundy hover:bg-burgundy/10">
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="space-y-6">
        {shops.map((shop) => (
          <Card key={shop._id} className="bg-white border-burgundy/10">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Store className="h-5 w-5 text-burgundy" />
                  <CardTitle className="text-lg text-burgundy">{shop.shopName}</CardTitle>
                  <Badge variant="outline" className="border-burgundy/20 text-burgundy">
                    {shop.shopType === "product_shop" ? "Products" : "Services"}
                  </Badge>
                </div>
                <Link href={`/vendor/inventory/shop/${shop._id}`}>
                  <Button variant="outline" size="sm" className="border-burgundy text-burgundy hover:bg-burgundy/10">
                    Manage
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-burgundy/70 mb-4">
                {shop.description || "No description provided."}
              </p>
              <div className="flex gap-4 text-sm text-burgundy/60">
                <span>Status: <Badge variant={shop.status === "active" ? "default" : "secondary"}>{shop.status}</Badge></span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

