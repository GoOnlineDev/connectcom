"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Package,
  Store,
  Trash2,
  Plus,
  Minus,
  CreditCard
} from "lucide-react";
import { useMutation } from "convex/react";
import { useToast } from "@/components/ui/use-toast";
import { Id } from "@/convex/_generated/dataModel";

export default function CustomerOrdersPage() {
  const { toast } = useToast();
  
  // Get user's cart
  const cart = useQuery(api.carts.getUserCart, {});
  
  // Mutations
  const removeFromCart = useMutation(api.carts.removeFromCart);
  const updateCartQuantity = useMutation(api.carts.updateCartQuantity);
  
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Handle remove from cart
  const handleRemove = async (cartId: Id<"carts">) => {
    setUpdatingId(cartId);
    try {
      const result = await removeFromCart({ cartId });
      if (result.success) {
        toast({
          title: "Removed from cart",
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
      console.error("Error removing from cart:", error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle quantity update
  const handleQuantityChange = async (cartId: Id<"carts">, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemove(cartId);
      return;
    }
    
    setUpdatingId(cartId);
    try {
      const result = await updateCartQuantity({ cartId, quantity: newQuantity });
      if (result.success) {
        toast({
          title: "Cart updated",
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
      console.error("Error updating cart:", error);
      toast({
        title: "Error",
        description: "Failed to update cart",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  // Calculate total
  const calculateTotal = () => {
    if (!cart) return 0;
    return cart.reduce((total: number, item: any) => {
      const price = item.itemDetails?.price || 0;
      return total + (price * item.quantity) / 100;
    }, 0);
  };

  // Show loading state
  if (cart === undefined) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-burgundy">Shopping Cart</h1>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-white">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Skeleton className="h-24 w-24" />
                  <div className="flex-1">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-burgundy">Shopping Cart</h1>
        </div>
        <Card className="bg-white border-burgundy/10">
          <CardContent className="flex flex-col items-center justify-center text-center py-12">
            <ShoppingCart className="h-16 w-16 text-burgundy/40 mb-4" />
            <h3 className="text-xl font-semibold text-burgundy mb-2">Your Cart is Empty</h3>
            <p className="text-burgundy/70 mb-6 max-w-md">
              Start adding items to your cart to proceed with checkout.
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

  const total = calculateTotal();
  const groupedByShop = cart.reduce((acc: any, item: any) => {
    const shopId = item.shopId;
    if (!acc[shopId]) {
      acc[shopId] = {
        shop: item.shopDetails,
        items: [],
      };
    }
    acc[shopId].items.push(item);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-burgundy">Shopping Cart</h1>
        <Badge className="bg-burgundy text-white">
          {cart.length} {cart.length === 1 ? "item" : "items"}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {Object.values(groupedByShop).map((group: any) => (
            <Card key={group.shop._id} className="bg-white border-burgundy/10">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  {group.shop.shopLogoUrl && (
                    <Image
                      src={group.shop.shopLogoUrl}
                      alt={group.shop.shopName}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  )}
                  <CardTitle className="text-lg text-burgundy flex items-center gap-2">
                    <Store className="h-4 w-4" />
                    {group.shop.shopName}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {group.items.map((item: any) => {
                  const itemDetails = item.itemDetails;
                  const isUpdating = updatingId === item._id;
                  
                  return (
                    <div
                      key={item._id}
                      className="flex flex-col sm:flex-row gap-4 p-4 border border-burgundy/10 rounded-lg"
                    >
                      {/* Item Image */}
                      <div className="relative h-24 w-24 bg-beige-100 rounded-lg overflow-hidden flex-shrink-0">
                        {itemDetails?.imageUrls && itemDetails.imageUrls[0] ? (
                          <Image
                            src={itemDetails.imageUrls[0]}
                            alt={itemDetails.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Package className="h-8 w-8 text-burgundy/40" />
                          </div>
                        )}
                      </div>
                      
                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-burgundy mb-1 truncate">
                          {itemDetails?.name || "Item"}
                        </h3>
                        <p className="text-sm text-burgundy/70 mb-2">
                          {item.itemType === "product" ? "Product" : "Service"}
                        </p>
                        <p className="text-lg font-bold text-burgundy">
                          ${itemDetails?.price ? ((itemDetails.price * item.quantity) / 100).toFixed(2) : "0.00"}
                        </p>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                        <div className="flex items-center gap-2 border border-burgundy/20 rounded-lg p-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            disabled={isUpdating}
                            className="h-8 w-8 p-0 hover:bg-burgundy/10"
                          >
                            <Minus className="h-4 w-4 text-burgundy" />
                          </Button>
                          <span className="text-burgundy font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            disabled={isUpdating}
                            className="h-8 w-8 p-0 hover:bg-burgundy/10"
                          >
                            <Plus className="h-4 w-4 text-burgundy" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(item._id)}
                          disabled={isUpdating}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="bg-white border-burgundy/10 sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg text-burgundy">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-burgundy/70">
                <span>Subtotal</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-burgundy/70">
                <span>Shipping</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
              <div className="border-t border-burgundy/20 pt-4">
                <div className="flex justify-between text-burgundy font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <Button
                className="w-full bg-burgundy hover:bg-burgundy-dark text-white mt-4"
                size="lg"
                disabled
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Proceed to Checkout
              </Button>
              
              <p className="text-xs text-burgundy/60 text-center">
                Checkout functionality coming soon
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
