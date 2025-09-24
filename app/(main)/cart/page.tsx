"use client";

import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Heart, 
  Store, 
  ShoppingBag,
  Package,
  CreditCard,
  ArrowLeft,
  Calendar,
  Clock,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { Id } from '@/convex/_generated/dataModel';

// Type for cart items with details
type CartItemWithDetails = {
  _id: Id<"carts">;
  _creationTime: number;
  userId: string;
  itemType: string;
  itemId: Id<"products"> | Id<"services">;
  shopId: Id<"shops">;
  quantity: number;
  serviceDetails?: {
    selectedDate?: string;
    selectedTime?: string;
    notes?: string;
  };
  createdAt: number;
  updatedAt: number;
  itemDetails: {
    _id: Id<"products"> | Id<"services">;
    _creationTime: number;
    shopId: Id<"shops">;
    name: string;
    description?: string;
    imageUrls?: string[];
    price?: number;
    quantityAvailable?: number;
    tags?: string[];
    duration?: any;
    pricing?: any;
    bookingInfo?: any;
    updatedAt: number;
  };
  shopDetails: {
    _id: Id<"shops">;
    shopName: string;
    shopLogoUrl?: string;
    shopType: string;
  };
  itemTotal: number;
};

export default function CartPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  // Fetch cart data
  const cartItems = useQuery(api.carts.getUserCart);
  const cartSummary = useQuery(api.carts.getCartSummary);

  // Mutations
  const updateCartQuantity = useMutation(api.carts.updateCartQuantity);
  const removeFromCart = useMutation(api.carts.removeFromCart);
  const clearCart = useMutation(api.carts.clearCart);
  const moveToWishlist = useMutation(api.carts.moveToWishlist);

  const handleQuantityUpdate = async (cartId: Id<"carts">, newQuantity: number) => {
    if (newQuantity <= 0) return;

    setUpdatingItems(prev => new Set(prev).add(cartId));
    
    try {
      const result = await updateCartQuantity({ cartId, quantity: newQuantity });
      
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
        description: "Failed to update quantity",
        variant: "destructive",
      });
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (cartId: Id<"carts">) => {
    try {
      const result = await removeFromCart({ cartId });
      
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
        description: "Failed to remove item",
        variant: "destructive",
      });
    }
  };

  const handleMoveToWishlist = async (cartId: Id<"carts">) => {
    try {
      const result = await moveToWishlist({ cartId });
      
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
        description: "Failed to move to wishlist",
        variant: "destructive",
      });
    }
  };

  const handleClearCart = async () => {
    try {
      const result = await clearCart();
      
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
        description: "Failed to clear cart",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(2)}`;
  };

  // Loading state
  if (cartItems === undefined || cartSummary === undefined) {
    return (
      <div className="min-h-screen bg-beige-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600 mx-auto"></div>
          <p className="mt-4 text-burgundy-700">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-beige-50">
        {/* Header */}
        <div className="bg-white border-b border-burgundy-100">
          <div className="container mx-auto px-4 py-4">
            <Link 
              href="/shops" 
              className="inline-flex items-center gap-2 text-burgundy-700 hover:text-burgundy-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-sm border border-beige-200">
              <ShoppingCart className="w-12 h-12 text-burgundy-400" />
            </div>
            <h1 className="text-3xl font-bold text-burgundy-900 mb-4">Your Cart is Empty</h1>
            <p className="text-burgundy-700 mb-8">
              Discover amazing products and services from local shops in our marketplace.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full bg-burgundy-600 hover:bg-burgundy-700 text-white">
                <Link href="/shops">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Browse Shops
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-burgundy-300 text-burgundy-700 hover:bg-burgundy-50">
                <Link href="/wishlist">
                  <Heart className="w-4 h-4 mr-2" />
                  View Wishlist
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Group items by shop
  const itemsByShop = cartItems.reduce((acc, item) => {
    const shopId = item.shopId;
    if (!acc[shopId]) {
      acc[shopId] = {
        shop: item.shopDetails,
        items: []
      };
    }
    acc[shopId].items.push(item);
    return acc;
  }, {} as Record<string, { 
    shop: {
      _id: Id<"shops">;
      shopName: string;
      shopLogoUrl?: string;
      shopType: string;
    }; 
    items: CartItemWithDetails[]
  }>);

  return (
    <div className="min-h-screen bg-beige-50 pb-10">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-burgundy-100 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/shops" 
              className="inline-flex items-center gap-1.5 text-burgundy-700 hover:text-burgundy-800 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Continue Shopping</span>
              <span className="inline sm:hidden">Shop</span>
            </Link>
            
            {cartItems.length > 0 && (
              <Button 
                variant="outline" 
                onClick={handleClearCart}
                className="border-red-200 text-red-600 hover:bg-red-50 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm h-auto"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">Clear Cart</span>
                <span className="inline sm:hidden">Clear</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-burgundy-700" />
              <h1 className="text-xl sm:text-2xl font-bold text-burgundy-900">Shopping Cart</h1>
              <Badge className="bg-burgundy-600 text-white text-xs sm:text-sm">
                {cartSummary.totalItems} {cartSummary.totalItems === 1 ? 'item' : 'items'}
              </Badge>
            </div>

            {(Object.entries(itemsByShop) as [string, { shop: { _id: Id<"shops">; shopName: string; shopLogoUrl?: string; shopType: string; }; items: CartItemWithDetails[] }][]).map(([shopId, shopGroup]) => (
              <Card key={shopId} className="border border-burgundy-200">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-beige-100 to-beige-200 rounded-lg flex items-center justify-center border border-beige-300">
                      {shopGroup.shop.shopLogoUrl ? (
                        <img
                          src={shopGroup.shop.shopLogoUrl}
                          alt={shopGroup.shop.shopName}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Store className="w-5 h-5 sm:w-6 sm:h-6 text-burgundy-400" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-base sm:text-lg text-burgundy-900">{shopGroup.shop.shopName}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm text-burgundy-700">
                        {shopGroup.items.length} {shopGroup.items.length === 1 ? 'item' : 'items'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 sm:space-y-4">
                  {shopGroup.items.map((item: CartItemWithDetails) => (
                    <div key={item._id} className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 bg-beige-100/50 rounded-lg border border-beige-200">
                      {/* Item Image */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-beige-100 to-beige-200 rounded-lg flex items-center justify-center flex-shrink-0 border border-beige-300 mx-auto sm:mx-0">
                        {item.itemType === "product" && item.itemDetails.imageUrls && item.itemDetails.imageUrls.length > 0 ? (
                          <img
                            src={item.itemDetails.imageUrls[0]}
                            alt={item.itemDetails.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-burgundy-400">
                            {item.itemType === "product" ? (
                              <Package className="w-7 h-7 sm:w-8 sm:h-8" />
                            ) : (
                              <Store className="w-7 h-7 sm:w-8 sm:h-8" />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-2 sm:gap-0">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-burgundy-900 truncate text-base sm:text-lg mb-1">
                              {item.itemDetails.name}
                            </h3>
                            {item.itemDetails.description && (
                              <p className="text-xs sm:text-sm text-burgundy-700 line-clamp-2">
                                {item.itemDetails.description}
                              </p>
                            )}

                            {/* Service Details */}
                            {item.itemType === "service" && item.serviceDetails && (
                              <div className="mt-1.5 space-y-0.5 text-xs sm:text-sm text-burgundy-700">
                                {item.serviceDetails.selectedDate && (
                                  <div className="flex items-center justify-center sm:justify-start gap-1.5">
                                    <Calendar className="w-3 h-3" />
                                    <span>{item.serviceDetails.selectedDate}</span>
                                  </div>
                                )}
                                {item.serviceDetails.selectedTime && (
                                  <div className="flex items-center justify-center sm:justify-start gap-1.5">
                                    <Clock className="w-3 h-3" />
                                    <span>{item.serviceDetails.selectedTime}</span>
                                  </div>
                                )}
                                {item.serviceDetails.notes && (
                                  <div className="flex items-center justify-center sm:justify-start gap-1.5">
                                    <FileText className="w-3 h-3" />
                                    <span className="truncate max-w-[150px] sm:max-w-none">{item.serviceDetails.notes}</span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Price */}
                            <div className="mt-2 sm:mt-3">
                              {item.itemType === "product" ? (
                                <div className="text-base sm:text-lg font-bold text-burgundy-900">
                                  {formatPrice(item.itemDetails.price || 0)}
                                  <span className="text-xs sm:text-sm font-normal text-burgundy-700 ml-1">each</span>
                                </div>
                              ) : (
                                <div className="text-xs sm:text-sm text-burgundy-700">
                                  {item.itemDetails.pricing || "Contact for pricing"}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col items-center sm:items-end gap-2 sm:ml-4 mt-3 sm:mt-0">
                            <div className="flex items-center gap-2">
                              <Button
                                size="icon"
                                className="w-8 h-8 p-0"
                                onClick={() => handleMoveToWishlist(item._id)}
                              >
                                <Heart className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                className="w-8 h-8 p-0 border-red-200 text-red-600 hover:bg-red-50"
                                onClick={() => handleRemoveItem(item._id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* Quantity Controls */}
                            {item.itemType === "product" && (
                              <div className="flex items-center gap-1 sm:gap-2 mt-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => handleQuantityUpdate(item._id, item.quantity - 1)}
                                  disabled={item.quantity <= 1 || updatingItems.has(item._id)}
                                  className="w-7 h-7 sm:w-8 sm:h-8 p-0 border-burgundy-300 text-burgundy-700 hover:bg-burgundy-50"
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                
                                <span className="w-7 sm:w-8 text-center font-semibold text-burgundy-900 text-sm">
                                  {updatingItems.has(item._id) ? "..." : item.quantity}
                                </span>
                                
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => handleQuantityUpdate(item._id, item.quantity + 1)}
                                  disabled={updatingItems.has(item._id)}
                                  className="w-7 h-7 sm:w-8 sm:h-8 p-0 border-burgundy-300 text-burgundy-700 hover:bg-burgundy-50"
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                            )}

                            {/* Item Total */}
                            {item.itemType === "product" && (
                              <div className="text-center sm:text-right mt-2 sm:mt-3">
                                <div className="font-bold text-burgundy-900 text-base sm:text-lg">
                                  {formatPrice(item.itemTotal)}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border border-burgundy-200 lg:sticky lg:top-24">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl text-burgundy-900">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="space-y-1.5 sm:space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-burgundy-700 text-sm">Products ({cartSummary.totalProducts})</span>
                    <span className="font-semibold text-burgundy-900 text-sm">
                      {formatPrice(cartSummary.totalAmount)}
                    </span>
                  </div>
                  
                  {cartSummary.totalServices > 0 && (
                    <div className="flex justify-between">
                      <span className="text-burgundy-700 text-sm">Services ({cartSummary.totalServices})</span>
                      <span className="text-sm text-burgundy-600">Contact for pricing</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs text-burgundy-600">
                    <span>From {cartSummary.shopCount} {cartSummary.shopCount === 1 ? 'shop' : 'shops'}</span>
                  </div>
                </div>

                <Separator className="bg-burgundy-200" />

                <div className="flex justify-between font-bold text-base sm:text-lg text-burgundy-900">
                  <span>Total</span>
                  <span>{formatPrice(cartSummary.totalAmount)}</span>
                </div>

                {cartSummary.totalServices > 0 && (
                  <p className="text-xs text-burgundy-600 pt-1">
                    * Services require direct contact with shops for pricing and booking
                  </p>
                )}

                <div className="space-y-2 pt-3 sm:pt-4">
                  <Button variant="primary" className="w-full" size="lg">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Proceed to Checkout
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    size="lg"
                    asChild
                  >
                    <Link href="/shops">
                      Continue Shopping
                    </Link>
                  </Button>
                </div>

                <div className="pt-3 sm:pt-4 border-t border-burgundy-100 mt-4 sm:mt-5">
                  <h4 className="font-semibold text-burgundy-900 mb-1.5 text-sm sm:text-base">Need Help?</h4>
                  <p className="text-xs text-burgundy-700">
                    Contact the shops directly for service bookings or product inquiries.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
