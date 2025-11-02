"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, TrendingUp, Package, Bell } from "lucide-react";

export default function AdminContentPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-burgundy">Content Management</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <Card className="bg-white border-burgundy/10 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg text-burgundy flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Featured Shops
            </CardTitle>
            <CardDescription className="text-burgundy/70">
              Manage featured shop listings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-burgundy/70 text-sm">Coming soon</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-burgundy/10 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg text-burgundy flex items-center gap-2">
              <Package className="h-5 w-5" />
              Categories
            </CardTitle>
            <CardDescription className="text-burgundy/70">
              Manage product and service categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-burgundy/70 text-sm">Coming soon</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-burgundy/10 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg text-burgundy flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Announcements
            </CardTitle>
            <CardDescription className="text-burgundy/70">
              Create and manage platform announcements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-burgundy/70 text-sm">Coming soon</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-white border-burgundy/10">
        <CardHeader>
          <CardTitle className="text-lg text-burgundy">Content Management System</CardTitle>
          <CardDescription className="text-burgundy/70">
            Manage platform content and features
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center py-12">
          <FileText className="h-16 w-16 text-burgundy/40 mb-4" />
          <h3 className="text-xl font-semibold text-burgundy mb-2">Content Management Coming Soon</h3>
          <p className="text-burgundy/70 mb-6 max-w-md">
            Content management features will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

