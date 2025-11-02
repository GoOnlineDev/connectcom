"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  ShoppingCart,
  Store,
  Package,
  Calendar,
  X,
  Trash2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Id } from "@/convex/_generated/dataModel";
import { slugify } from "@/lib/utils";

export default function CustomerFavoritesPage() {
  const { toast } = useToast();
  
  // Get user's wishlist
  const wishlist = useQuery(api.wishlists.getUserWishlist, {});
  
  // Mutations
  const removeFromWishlist = useMutation(api.wishlists.removeFromWishlist);
  const addToCart = useMutation(api.carts.addToCart);
  
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Handle remove from wishlist
  const handleRemove = async (itemId: Id<"products"> | Id<"services">) => {
    setRemovingId(itemId);
    try {
      const result = await removeFromWishlist({ itemId });
      if (result.success) {
        toast({
          title: "Removed from favorites",
          description: result.message,
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to remove item from favorites",
        variant: "destructive",
      });
    } finally {
      setRemovingId(null);
    }
  };

  // Handle add to cart
  const handleAddToCart = async (item: any) => {
    try {
      const result = await addToCart({
        itemType: item.itemType,
        itemId: item.itemId,
        shopId: item.shopId,
        quantity: 1,
      });
      
      if (result.success) {
        toast({
          title: "Added to cart",
          description: result.message,
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  // Show loading state
  if (wishlist === undefined) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-burgundy">My Favorites</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="bg-white">
              <CardHeader>
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-burgundy">My Favorites</h1>
        </div>
        <Card className="bg-white border-burgundy/10">
          <CardContent className="flex flex-col items-center justify-center text-center py-12">
            <Heart className="h-16 w-16 text-burgundy/40 mb-4" />
            <h3 className="text-xl font-semibold text-burgundy mb-2">No Favorites Yet</h3>
            <p className="text-burgundy/70 mb-6 max-w-md">
              Start adding items to your favorites to save them for later.
            </p>
            <Link href="/shops">
              <Button className="bg-burgundy hover:bg-burgundy-dark text-white">
                Browse Shops
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
        <h1 className="text-2xl font-bold text-burgundy">My Favorites</h1>
        <Badge className="bg-burgundy text-white">
          {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {wishlist.map((item: any) => {
          const itemDetails = item.itemDetails;
          const shopDetails = item.shopDetails;
          const isProduct = item.itemType === "product";
          
          return (
            <Card key={item._id} className="bg-white border-burgundy/10 hover:shadow-md transition-shadow">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full bg-beige-100 rounded-t-lg overflow-hidden">
                  {itemDetails?.imageUrls && itemDetails.imageUrls[0] ? (
                    <Image
                      src={itemDetails.imageUrls[0]}
                      alt={itemDetails.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      {isProduct ? (
                        <Package className="h-12 w-12 text-burgundy/40" />
                      ) : (
                        <Calendar className="h-12 w-12 text-burgundy/40" />
                      )}
                    </div>
                  )}
                  <button
                    onClick={() => handleRemove(item.itemId)}
                    disabled={removingId === item.itemId}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-burgundy/10 transition-colors"
                  >
                    <Heart className={`h-4 w-4 ${removingId === item.itemId ? 'text-gray-400' : 'text-red-500 fill-red-500'}`} />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-burgundy truncate mb-1">
                      {itemDetails?.name || "Item"}
                    </h3>
                    <Link href={`/shops/${shopDetails?._id}/${slugify(shopDetails?.shopName || "shop")}`}>
                      <p className="text-xs text-burgundy/60 hover:text-burgundy flex items-center gap-1">
                        <Store className="h-3 w-3" />
                        {shopDetails?.shopName || "Shop"}
                      </p>
                    </Link>
                  </div>
                  <Badge variant="outline" className="border-burgundy/20 text-burgundy text-xs ml-2">
                    {isProduct ? "Product" : "Service"}
                  </Badge>
                </div>
                
                {itemDetails?.description && (
                  <p className="text-sm text-burgundy/70 mb-3 line-clamp-2">
                    {itemDetails.description}
                  </p>
                )}
                
                {isProduct && itemDetails?.price && (
                  <p className="text-lg font-bold text-burgundy mb-3">
                    ${(itemDetails.price / 100).toFixed(2)}
                  </p>
                )}
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 bg-burgundy hover:bg-burgundy-dark text-white text-sm"
                    size="sm"
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={() => handleRemove(item.itemId)}
                    disabled={removingId === item.itemId}
                    variant="outline"
                    size="sm"
                    className="border-burgundy text-burgundy hover:bg-burgundy/10"
                  >
                    {removingId === item.itemId ? (
                      <X className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}


