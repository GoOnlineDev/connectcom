"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Eye, ShoppingBag } from "lucide-react";

export default function VendorAnalyticsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-burgundy">Analytics</h1>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <Card className="bg-white border-burgundy/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-burgundy/70">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold text-burgundy">0</p>
                <p className="text-xs text-burgundy/60">Coming soon</p>
              </div>
              <div className="h-10 w-10 bg-burgundy/10 rounded-full flex items-center justify-center">
                <Eye className="h-5 w-5 text-burgundy" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-burgundy/10">
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
                <ShoppingBag className="h-5 w-5 text-burgundy" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-burgundy/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-burgundy/70">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold text-burgundy">$0</p>
                <p className="text-xs text-burgundy/60">Coming soon</p>
              </div>
              <div className="h-10 w-10 bg-burgundy/10 rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-burgundy" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-burgundy/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-burgundy/70">Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold text-burgundy">0%</p>
                <p className="text-xs text-burgundy/60">Coming soon</p>
              </div>
              <div className="h-10 w-10 bg-burgundy/10 rounded-full flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-burgundy" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-white border-burgundy/10">
        <CardHeader>
          <CardTitle className="text-lg text-burgundy">Analytics Dashboard</CardTitle>
          <CardDescription className="text-burgundy/70">
            Detailed analytics and insights for your shops
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center py-12">
          <BarChart3 className="h-16 w-16 text-burgundy/40 mb-4" />
          <h3 className="text-xl font-semibold text-burgundy mb-2">Analytics Coming Soon</h3>
          <p className="text-burgundy/70 mb-6 max-w-md">
            Comprehensive analytics and reporting features will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

