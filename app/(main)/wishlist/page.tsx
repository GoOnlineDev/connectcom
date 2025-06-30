"use client";

import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Store, 
  ShoppingBag,
  Package,
  ArrowLeft,
  Filter,
  Grid3X3,
  List,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { Id } from '@/convex/_generated/dataModel';

export default function WishlistPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilter, setActiveFilter] = useState<'all' | 'product' | 'service'>('all');

  // Fetch wishlist data
  const allWishlistItems = useQuery(api.wishlists.getUserWishlist, {});
  const wishlistCount = useQuery(api.wishlists.getWishlistCount, {});

  // Mutations
  const removeFromWishlist = useMutation(api.wishlists.removeFromWishlist);
  const clearWishlist = useMutation(api.wishlists.clearWishlist);
  const addToCart = useMutation(api.carts.addToCart);

  // Filter wishlist items based on active filter
  const wishlistItems = allWishlistItems?.filter(item => {
    if (activeFilter === 'all') return true;
    return item.itemType === activeFilter;
  }) || [];

  const handleRemoveFromWishlist = async (itemId: Id<"products"> | Id<"services">) => {
    try {
      const result = await removeFromWishlist({ itemId });
      
      if (result.success) {
        toast({
          title: "Success",
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
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive",
      });
    }
  };

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
          title: "Success",
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
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const handleClearWishlist = async () => {
    try {
      const result = await clearWishlist();
      
      if (result.success) {
        toast({
          title: "Success",
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
      toast({
        title: "Error",
        description: "Failed to clear wishlist",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(2)}`;
  };

  // Loading state
  if (allWishlistItems === undefined || wishlistCount === undefined) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy mx-auto"></div>
          <p className="mt-4 text-burgundy/80">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  // Empty wishlist state
  if (!allWishlistItems || allWishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-beige">
        {/* Header */}
        <div className="bg-white border-b border-burgundy/10">
          <div className="container mx-auto px-4 py-4">
            <Link 
              href="/shops" 
              className="inline-flex items-center gap-2 text-burgundy hover:text-burgundy-dark transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Browse Shops
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Heart className="w-12 h-12 text-burgundy/40" />
            </div>
            <h1 className="text-3xl font-bold text-burgundy mb-4">Your Wishlist is Empty</h1>
            <p className="text-burgundy/80 mb-8">
              Save items you love to your wishlist and come back to them later.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full bg-burgundy hover:bg-burgundy-dark">
                <Link href="/shops">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Browse Shops
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                className="w-full border-burgundy text-burgundy hover:bg-burgundy/10"
              >
                <Link href="/cart">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  View Cart
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Count items by type
  const productCount = allWishlistItems.filter(item => item.itemType === 'product').length;
  const serviceCount = allWishlistItems.filter(item => item.itemType === 'service').length;

  return (
    <div className="min-h-screen bg-beige">
      {/* Header */}
      <div className="bg-white border-b border-burgundy/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/shops" 
              className="inline-flex items-center gap-2 text-burgundy hover:text-burgundy-dark transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Browse Shops
            </Link>
            
            {allWishlistItems.length > 0 && (
              <Button 
                variant="outline" 
                onClick={handleClearWishlist}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Wishlist
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-burgundy" />
            <h1 className="text-2xl font-bold text-burgundy">My Wishlist</h1>
            <Badge className="bg-burgundy text-white">
              {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'}
            </Badge>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-burgundy hover:bg-burgundy-dark' : 'border-burgundy text-burgundy hover:bg-burgundy/10'}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-burgundy hover:bg-burgundy-dark' : 'border-burgundy text-burgundy hover:bg-burgundy/10'}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <Tabs value={activeFilter} onValueChange={(value) => setActiveFilter(value as any)} className="mb-8">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              All ({allWishlistItems.length})
            </TabsTrigger>
            <TabsTrigger value="product" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Products ({productCount})
            </TabsTrigger>
            <TabsTrigger value="service" className="flex items-center gap-2">
              <Store className="w-4 h-4" />
              Services ({serviceCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Wishlist Items */}
        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
              {activeFilter === 'product' ? (
                <Package className="w-8 h-8 text-burgundy/40" />
              ) : activeFilter === 'service' ? (
                <Store className="w-8 h-8 text-burgundy/40" />
              ) : (
                <Heart className="w-8 h-8 text-burgundy/40" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-burgundy mb-2">
              No {activeFilter === 'all' ? '' : activeFilter + 's'} in your wishlist
            </h3>
            <p className="text-burgundy/70 mb-4">
              {activeFilter === 'all' 
                ? 'Your filtered wishlist is empty'
                : `You haven't saved any ${activeFilter}s to your wishlist yet`
              }
            </p>
            <Button asChild className="bg-burgundy hover:bg-burgundy-dark">
              <Link href="/shops">
                Browse {activeFilter === 'all' ? 'Shops' : activeFilter === 'product' ? 'Products' : 'Services'}
              </Link>
            </Button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {wishlistItems.map((item) => (
              <Card 
                key={item._id} 
                className={`border-burgundy/20 hover:shadow-md transition-shadow ${
                  viewMode === 'list' ? 'flex-row' : ''
                }`}
              >
                {viewMode === 'grid' ? (
                  // Grid View
                  <>
                    {/* Item Image */}
                    <div className="relative h-48 bg-gradient-to-br from-beige to-beige-dark rounded-t-lg">
                      {item.itemType === "product" && item.itemDetails.imageUrls && item.itemDetails.imageUrls.length > 0 ? (
                        <img
                          src={item.itemDetails.imageUrls[0]}
                          alt={item.itemDetails.name}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          {item.itemType === "product" ? (
                            <Package className="w-12 h-12 text-burgundy/40" />
                          ) : (
                            <Store className="w-12 h-12 text-burgundy/40" />
                          )}
                        </div>
                      )}

                      {/* Price Badge */}
                      {item.itemType === "product" && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-burgundy text-white hover:bg-burgundy-dark">
                            {formatPrice(item.itemDetails.price)}
                          </Badge>
                        </div>
                      )}

                      {/* Remove Button */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveFromWishlist(item.itemId)}
                        className="absolute top-3 left-3 p-2 bg-white/90 hover:bg-white border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>

                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-bold text-burgundy line-clamp-1">
                        {item.itemDetails.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {item.itemDetails.description || 'No description available'}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0">
                      {/* Shop Info */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 bg-gradient-to-br from-beige to-beige-dark rounded flex items-center justify-center">
                          {item.shopDetails.shopLogoUrl ? (
                            <img
                              src={item.shopDetails.shopLogoUrl}
                              alt={item.shopDetails.shopName}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <Store className="w-3 h-3 text-burgundy/40" />
                          )}
                        </div>
                        <span className="text-sm text-burgundy/70 truncate">
                          {item.shopDetails.shopName}
                        </span>
                      </div>

                      {/* Service Pricing */}
                      {item.itemType === "service" && (
                        <div className="mb-4">
                          <p className="text-sm text-burgundy/80">
                            {item.itemDetails.pricing || "Contact for pricing"}
                          </p>
                          {item.itemDetails.duration && (
                            <p className="text-xs text-burgundy/60">
                              Duration: {item.itemDetails.duration}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAddToCart(item)}
                          className="flex-1 bg-burgundy hover:bg-burgundy-dark"
                          size="sm"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="border-burgundy text-burgundy hover:bg-burgundy/10"
                          size="sm"
                        >
                          <Link href={`/shops/${item.shopId}`}>
                            View Shop
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  // List View
                  <div className="flex gap-4 p-4">
                    {/* Item Image */}
                    <div className="w-24 h-24 bg-gradient-to-br from-beige to-beige-dark rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.itemType === "product" && item.itemDetails.imageUrls && item.itemDetails.imageUrls.length > 0 ? (
                        <img
                          src={item.itemDetails.imageUrls[0]}
                          alt={item.itemDetails.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-burgundy/40">
                          {item.itemType === "product" ? (
                            <Package className="w-8 h-8" />
                          ) : (
                            <Store className="w-8 h-8" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-burgundy truncate">
                            {item.itemDetails.name}
                          </h3>
                          <p className="text-sm text-burgundy/70 line-clamp-2 mt-1">
                            {item.itemDetails.description || 'No description available'}
                          </p>

                          {/* Shop Info */}
                          <div className="flex items-center gap-2 mt-2">
                            <Store className="w-3 h-3 text-burgundy/40" />
                            <span className="text-xs text-burgundy/60 truncate">
                              {item.shopDetails.shopName}
                            </span>
                          </div>

                          {/* Price/Pricing */}
                          <div className="mt-2">
                            {item.itemType === "product" ? (
                              <div className="text-lg font-bold text-burgundy">
                                {formatPrice(item.itemDetails.price)}
                              </div>
                            ) : (
                              <div className="text-sm text-burgundy/80">
                                {item.itemDetails.pricing || "Contact for pricing"}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemoveFromWishlist(item.itemId)}
                            className="p-2 border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(item)}
                            className="bg-burgundy hover:bg-burgundy-dark"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {wishlistItems.length > 0 && (
          <div className="mt-12 text-center">
            <Card className="border-burgundy/20 bg-gradient-to-r from-burgundy/5 to-burgundy/10 max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-burgundy">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full bg-burgundy hover:bg-burgundy-dark">
                  <Link href="/cart">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    View Cart
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full border-burgundy text-burgundy hover:bg-burgundy/10"
                >
                  <Link href="/shops">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Continue Shopping
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
