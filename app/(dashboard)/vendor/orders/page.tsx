"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Package } from "lucide-react";

export default function VendorOrdersPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-burgundy">Orders & Bookings</h1>
      </div>
      
      <Card className="bg-white border-burgundy/10">
        <CardContent className="flex flex-col items-center justify-center text-center py-12">
          <ShoppingBag className="h-16 w-16 text-burgundy/40 mb-4" />
          <h3 className="text-xl font-semibold text-burgundy mb-2">Orders Coming Soon</h3>
          <p className="text-burgundy/70 mb-6 max-w-md">
            You'll be able to view and manage orders and bookings for your shops here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

