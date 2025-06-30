"use client";

import Link from "next/link";
import { CheckCircle, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ShopCreationSuccessPage() {
  return (
    <div className="min-h-screen bg-beige py-12 px-4 flex items-center justify-center">
      <Card className="max-w-md w-full shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <CheckCircle className="h-16 w-16 text-green-600" />
              <Store className="h-8 w-8 text-burgundy absolute bottom-0 right-0" />
            </div>
          </div>
          <CardTitle className="text-2xl text-burgundy">Shop Created Successfully!</CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            Your shop has been submitted for approval. Our team will review it shortly.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
            <p className="text-gray-700 font-medium mb-2">
              You are now a Vendor on ConnectCom!
            </p>
            <p className="text-gray-700">
              Once approved, your shop will be visible to customers. You'll receive a notification when your shop is live.
            </p>
          </div>
          <p className="text-gray-600">
            In the meantime, you can start adding products or services to your shop from your dashboard.
          </p>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
          <Link href="/vendor" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-burgundy hover:bg-burgundy-dark text-white px-6 py-2 text-base font-medium shadow-md" size="lg">
              Go to My Shop Dashboard
            </Button>
          </Link>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto border-2 border-burgundy text-burgundy hover:bg-burgundy/5 px-6 py-2 text-base font-medium" size="lg">
              Return to Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
} 