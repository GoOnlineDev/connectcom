"use client";

import React, { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useUser } from '@clerk/nextjs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { ShoppingCart, MapPin, Phone, Mail, CreditCard, Loader2 } from 'lucide-react';

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shopId: Id<"shops">;
  shopName: string;
  cartItemIds: Id<"carts">[];
  totalAmount: number;
  onSuccess: () => void;
}

export function CheckoutDialog({
  open,
  onOpenChange,
  shopId,
  shopName,
  cartItemIds,
  totalAmount,
  onSuccess,
}: CheckoutDialogProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: user?.fullName || '',
    customerEmail: user?.emailAddresses[0]?.emailAddress || '',
    customerPhone: '',
    deliveryAddress: '',
    deliveryCity: 'Kampala',
    deliveryNotes: '',
    customerNotes: '',
    paymentMethod: 'mobile_money',
  });

  const createOrder = useMutation(api.orders.createOrder);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.customerName || !formData.customerEmail || !formData.customerPhone || 
          !formData.deliveryAddress || !formData.deliveryCity) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const result = await createOrder({
        shopId,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        deliveryAddress: formData.deliveryAddress,
        deliveryCity: formData.deliveryCity,
        deliveryNotes: formData.deliveryNotes || undefined,
        customerNotes: formData.customerNotes || undefined,
        paymentMethod: formData.paymentMethod || undefined,
        cartItemIds,
      });

      if (result.success) {
        toast({
          title: "Order Placed Successfully!",
          description: `Your order #${result.orderNumber} has been placed. The shop owner will be notified.`,
        });
        onSuccess();
        onOpenChange(false);
        // Reset form
        setFormData({
          customerName: user?.fullName || '',
          customerEmail: user?.emailAddresses[0]?.emailAddress || '',
          customerPhone: '',
          deliveryAddress: '',
          deliveryCity: 'Kampala',
          deliveryNotes: '',
          customerNotes: '',
          paymentMethod: 'mobile_money',
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to place order",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return `UG ${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-burgundy-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-burgundy-900 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            Checkout - {shopName}
          </DialogTitle>
          <DialogDescription className="text-burgundy-700">
            Please fill in your delivery information to complete your order
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-burgundy-900 pb-2 border-b border-burgundy-200">
              Customer Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName" className="text-burgundy-900">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                  className="border-burgundy-300 focus:border-burgundy-500 focus:ring-burgundy-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <Label htmlFor="customerEmail" className="text-burgundy-900">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="customerEmail"
                  name="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  required
                  className="border-burgundy-300 focus:border-burgundy-500 focus:ring-burgundy-500"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="customerPhone" className="text-burgundy-900">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customerPhone"
                name="customerPhone"
                type="tel"
                value={formData.customerPhone}
                onChange={handleChange}
                required
                className="border-burgundy-300 focus:border-burgundy-500 focus:ring-burgundy-500"
                placeholder="+256 700 000000"
              />
            </div>
          </div>

          {/* Delivery Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-burgundy-900 pb-2 border-b border-burgundy-200 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Delivery Information
            </h3>

            <div>
              <Label htmlFor="deliveryAddress" className="text-burgundy-900">
                Delivery Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="deliveryAddress"
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleChange}
                required
                className="border-burgundy-300 focus:border-burgundy-500 focus:ring-burgundy-500"
                placeholder="e.g. 123 Kampala Road, Nakawa"
              />
            </div>

            <div>
              <Label htmlFor="deliveryCity" className="text-burgundy-900">
                City <span className="text-red-500">*</span>
              </Label>
              <Input
                id="deliveryCity"
                name="deliveryCity"
                value={formData.deliveryCity}
                onChange={handleChange}
                required
                className="border-burgundy-300 focus:border-burgundy-500 focus:ring-burgundy-500"
                placeholder="Kampala"
              />
            </div>

            <div>
              <Label htmlFor="deliveryNotes" className="text-burgundy-900">
                Delivery Notes (Optional)
              </Label>
              <Textarea
                id="deliveryNotes"
                name="deliveryNotes"
                value={formData.deliveryNotes}
                onChange={handleChange}
                rows={3}
                className="border-burgundy-300 focus:border-burgundy-500 focus:ring-burgundy-500"
                placeholder="Any special delivery instructions..."
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-burgundy-900 pb-2 border-b border-burgundy-200 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Method
            </h3>

            <div>
              <Label htmlFor="paymentMethod" className="text-burgundy-900">
                Payment Method
              </Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) => handleSelectChange('paymentMethod', value)}
              >
                <SelectTrigger className="border-burgundy-300 focus:border-burgundy-500 focus:ring-burgundy-500">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mobile_money">Mobile Money</SelectItem>
                  <SelectItem value="cash">Cash on Delivery</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <Label htmlFor="customerNotes" className="text-burgundy-900">
              Additional Notes (Optional)
            </Label>
            <Textarea
              id="customerNotes"
              name="customerNotes"
              value={formData.customerNotes}
              onChange={handleChange}
              rows={3}
              className="border-burgundy-300 focus:border-burgundy-500 focus:ring-burgundy-500"
              placeholder="Any additional information for the shop owner..."
            />
          </div>

          {/* Order Summary */}
          <div className="bg-burgundy-50 border border-burgundy-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-burgundy-900 mb-3">Order Summary</h3>
            <div className="flex justify-between items-center">
              <span className="text-burgundy-700 font-medium">Total Amount:</span>
              <span className="text-2xl font-bold text-burgundy-900">{formatPrice(totalAmount)}</span>
            </div>
            <p className="text-xs text-burgundy-600 mt-2">
              The shop owner will contact you to confirm the order and arrange delivery/payment.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="border-burgundy-300 text-burgundy-700 hover:bg-burgundy-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-burgundy-600 hover:bg-burgundy-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Place Order
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

