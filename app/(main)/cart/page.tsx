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
    <div className="min-h-screen bg-beige-50">
      {/* Header */}
      <div className="bg-white border-b border-burgundy-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/shops" 
              className="inline-flex items-center gap-2 text-burgundy-700 hover:text-burgundy-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
            
            {cartItems.length > 0 && (
              <Button 
                variant="outline" 
                onClick={handleClearCart}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Cart
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingCart className="w-6 h-6 text-burgundy-700" />
              <h1 className="text-2xl font-bold text-burgundy-900">Shopping Cart</h1>
              <Badge className="bg-burgundy-600 text-white">
                {cartSummary.totalItems} {cartSummary.totalItems === 1 ? 'item' : 'items'}
              </Badge>
            </div>

            {(Object.entries(itemsByShop) as [string, { shop: { _id: Id<"shops">; shopName: string; shopLogoUrl?: string; shopType: string; }; items: CartItemWithDetails[] }][]).map(([shopId, shopGroup]) => (
              <Card key={shopId} className="border border-burgundy-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-beige-100 to-beige-200 rounded-lg flex items-center justify-center border border-beige-300">
                      {shopGroup.shop.shopLogoUrl ? (
                        <img
                          src={shopGroup.shop.shopLogoUrl}
                          alt={shopGroup.shop.shopName}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Store className="w-6 h-6 text-burgundy-400" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg text-burgundy-900">{shopGroup.shop.shopName}</CardTitle>
                      <CardDescription className="text-burgundy-700">
                        {shopGroup.items.length} {shopGroup.items.length === 1 ? 'item' : 'items'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {shopGroup.items.map((item: CartItemWithDetails) => (
                    <div key={item._id} className="flex gap-4 p-4 bg-beige-100/50 rounded-lg border border-beige-200">
                      {/* Item Image */}
                      <div className="w-20 h-20 bg-gradient-to-br from-beige-100 to-beige-200 rounded-lg flex items-center justify-center flex-shrink-0 border border-beige-300">
                        {item.itemType === "product" && item.itemDetails.imageUrls && item.itemDetails.imageUrls.length > 0 ? (
                          <img
                            src={item.itemDetails.imageUrls[0]}
                            alt={item.itemDetails.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-burgundy-400">
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
                            <h3 className="font-semibold text-burgundy-900 truncate">
                              {item.itemDetails.name}
                            </h3>
                            {item.itemDetails.description && (
                              <p className="text-sm text-burgundy-700 mt-1 line-clamp-2">
                                {item.itemDetails.description}
                              </p>
                            )}

                            {/* Service Details */}
                            {item.itemType === "service" && item.serviceDetails && (
                              <div className="mt-2 space-y-1 text-sm text-burgundy-700">
                                {item.serviceDetails.selectedDate && (
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-3 h-3" />
                                    <span>{item.serviceDetails.selectedDate}</span>
                                  </div>
                                )}
                                {item.serviceDetails.selectedTime && (
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-3 h-3" />
                                    <span>{item.serviceDetails.selectedTime}</span>
                                  </div>
                                )}
                                {item.serviceDetails.notes && (
                                  <div className="flex items-center gap-2">
                                    <FileText className="w-3 h-3" />
                                    <span className="truncate">{item.serviceDetails.notes}</span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Price */}
                            <div className="mt-2">
                              {item.itemType === "product" ? (
                                <div className="text-lg font-bold text-burgundy-900">
                                  {formatPrice(item.itemDetails.price || 0)}
                                  <span className="text-sm font-normal text-burgundy-700 ml-1">each</span>
                                </div>
                              ) : (
                                <div className="text-sm text-burgundy-700">
                                  {item.itemDetails.pricing || "Contact for pricing"}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col items-end gap-2 ml-4">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                className="p-2"
                                onClick={() => handleMoveToWishlist(item._id)}
                              >
                                <Heart className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="p-2"
                                onClick={() => handleRemoveItem(item._id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleQuantityUpdate(item._id, item.quantity - 1)}
                                disabled={item.quantity <= 1 || updatingItems.has(item._id)}
                                className="p-2 border-burgundy-300 text-burgundy-700 hover:bg-burgundy-50"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              
                              <span className="w-8 text-center font-semibold text-burgundy-900">
                                {updatingItems.has(item._id) ? "..." : item.quantity}
                              </span>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleQuantityUpdate(item._id, item.quantity + 1)}
                                disabled={updatingItems.has(item._id)}
                                className="p-2 border-burgundy-300 text-burgundy-700 hover:bg-burgundy-50"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>

                            {/* Item Total */}
                            {item.itemType === "product" && (
                              <div className="text-right">
                                <div className="font-bold text-burgundy-900">
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
            <Card className="border border-burgundy-200 sticky top-4">
              <CardHeader>
                <CardTitle className="text-burgundy-900">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-burgundy-700">Products ({cartSummary.totalProducts})</span>
                    <span className="font-semibold text-burgundy-900">
                      {formatPrice(cartSummary.totalAmount)}
                    </span>
                  </div>
                  
                  {cartSummary.totalServices > 0 && (
                    <div className="flex justify-between">
                      <span className="text-burgundy-700">Services ({cartSummary.totalServices})</span>
                      <span className="text-sm text-burgundy-600">Contact for pricing</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs text-burgundy-600">
                    <span>From {cartSummary.shopCount} {cartSummary.shopCount === 1 ? 'shop' : 'shops'}</span>
                  </div>
                </div>

                <Separator className="bg-burgundy-200" />

                <div className="flex justify-between font-bold text-lg text-burgundy-900">
                  <span>Total</span>
                  <span>{formatPrice(cartSummary.totalAmount)}</span>
                </div>

                {cartSummary.totalServices > 0 && (
                  <p className="text-xs text-burgundy-600">
                    * Services require direct contact with shops for pricing and booking
                  </p>
                )}

                <div className="space-y-3 pt-4">
                  <Button className="w-full bg-burgundy-600 hover:bg-burgundy-700 text-white" size="lg">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Proceed to Checkout
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-burgundy-300 text-burgundy-700 hover:bg-burgundy-50"
                    asChild
                  >
                    <Link href="/shops">
                      Continue Shopping
                    </Link>
                  </Button>
                </div>

                <div className="pt-4 border-t border-burgundy-100">
                  <h4 className="font-semibold text-burgundy-900 mb-2">Need Help?</h4>
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
