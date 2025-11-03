"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ShoppingBag, 
  Heart, 
  ShoppingCart,
  MessageSquare,
  Package,
  Calendar,
  TrendingUp
} from "lucide-react";

export default function CustomerDashboardPage() {
  // Get user's cart
  const cart = useQuery(api.carts.getUserCart, {}) || [];
  
  // Get user's wishlist
  const wishlist = useQuery(api.wishlists.getUserWishlist, {}) || [];
  
  // Get cart count
  const cartCount = useQuery(api.carts.getCartCount, {}) || 0;
  
  // Get wishlist count
  const wishlistCount = useQuery(api.wishlists.getWishlistCount, {}) || 0;

  // Show loading state
  if (cart === undefined || wishlist === undefined || cartCount === undefined || wishlistCount === undefined) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-burgundy mb-6">My Dashboard</h1>
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
      </div>
    );
  }

  const totalCartItems = cartCount;
  const totalWishlistItems = wishlistCount;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-burgundy">My Dashboard</h1>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <Card className="bg-white hover:shadow-md transition-shadow border-burgundy/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-burgundy/70">Cart Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold text-burgundy">{totalCartItems}</p>
                <p className="text-xs text-burgundy/60">Items in cart</p>
              </div>
              <div className="h-10 w-10 bg-burgundy/10 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-burgundy" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white hover:shadow-md transition-shadow border-burgundy/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-burgundy/70">Favorites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold text-burgundy">{totalWishlistItems}</p>
                <p className="text-xs text-burgundy/60">Saved items</p>
              </div>
              <div className="h-10 w-10 bg-burgundy/10 rounded-full flex items-center justify-center">
                <Heart className="h-5 w-5 text-burgundy" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white hover:shadow-md transition-shadow border-burgundy/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-burgundy/70">Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold text-burgundy">0</p>
                <p className="text-xs text-burgundy/60">Coming soon</p>
              </div>
              <div className="h-10 w-10 bg-burgundy/10 rounded-full flex items-center justify-center">
                <Package className="h-5 w-5 text-burgundy" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white hover:shadow-md transition-shadow border-burgundy/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-burgundy/70">Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold text-burgundy">0</p>
                <p className="text-xs text-burgundy/60">Coming soon</p>
              </div>
              <div className="h-10 w-10 bg-burgundy/10 rounded-full flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-burgundy" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Cart */}
        <Card className="bg-white border-burgundy/10">
          <CardHeader>
            <CardTitle className="text-lg text-burgundy">Shopping Cart</CardTitle>
            <CardDescription className="text-burgundy/70">Items you're ready to purchase</CardDescription>
          </CardHeader>
          <CardContent>
            {cart.length > 0 ? (
              <div className="space-y-3">
                {cart.slice(0, 3).map((item: any) => (
                  <div key={item._id} className="flex items-center p-3 border border-burgundy/10 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-burgundy truncate">
                        {item.itemDetails?.name || "Item"}
                      </p>
                      <p className="text-xs text-burgundy/60">
                        Quantity: {item.quantity} • ${item.itemDetails?.price ? (item.itemDetails.price / 100).toFixed(2) : "0.00"}
                      </p>
                    </div>
                  </div>
                ))}
                {cart.length > 3 && (
                  <p className="text-sm text-burgundy/70 text-center pt-2">
                    +{cart.length - 3} more items
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-6">
                <ShoppingCart className="h-12 w-12 text-burgundy/40 mb-3" />
                <p className="text-burgundy/70">Your cart is empty</p>
              </div>
            )}
          </CardContent>
          <div className="px-6 pb-6">
            <Link href="/customer/orders">
              <Button className="w-full bg-burgundy-600 text-white hover:bg-burgundy-700">
                View Cart
              </Button>
            </Link>
          </div>
        </Card>
        
        {/* Favorites */}
        <Card className="bg-white border-burgundy/10">
          <CardHeader>
            <CardTitle className="text-lg text-burgundy">Favorites</CardTitle>
            <CardDescription className="text-burgundy/70">Items you've saved</CardDescription>
          </CardHeader>
          <CardContent>
            {wishlist.length > 0 ? (
              <div className="space-y-3">
                {wishlist.slice(0, 3).map((item: any) => (
                  <div key={item._id} className="flex items-center p-3 border border-burgundy/10 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-burgundy truncate">
                        {item.itemDetails?.name || "Item"}
                      </p>
                      <p className="text-xs text-burgundy/60">
                        {item.shopDetails?.shopName || "Shop"}
                      </p>
                    </div>
                  </div>
                ))}
                {wishlist.length > 3 && (
                  <p className="text-sm text-burgundy/70 text-center pt-2">
                    +{wishlist.length - 3} more items
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-6">
                <Heart className="h-12 w-12 text-burgundy/40 mb-3" />
                <p className="text-burgundy/70">No favorites yet</p>
              </div>
            )}
          </CardContent>
          <div className="px-6 pb-6">
            <Link href="/customer/favorites">
              <Button variant="outline" className="w-full border-burgundy text-burgundy hover:bg-burgundy/10">
                View All Favorites
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}


