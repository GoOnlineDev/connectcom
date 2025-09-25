"use client";

import Link from "next/link";
import { CheckCircle, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ShopCreationSuccessPage() {
  return (
    <div className="min-h-screen bg-beige-50 py-12 px-4 flex items-center justify-center">
      <Card className="max-w-md w-full shadow-lg bg-white/95 backdrop-blur-sm border border-burgundy-200 rounded-xl">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <CheckCircle className="h-16 w-16 text-burgundy-600" />
              <Store className="h-8 w-8 text-burgundy-700 absolute bottom-0 right-0" />
            </div>
          </div>
          <CardTitle className="text-2xl text-burgundy-900">Shop Created Successfully!</CardTitle>
          <CardDescription className="text-burgundy-700 mt-2">
            Your shop has been submitted for approval. Our team will review it shortly.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center space-y-4 pt-0">
          <div className="p-4 bg-burgundy-50 border border-burgundy-200 rounded-lg">
            <p className="text-burgundy-900 font-medium mb-2">
              You are now a Vendor on ConnectCom!
            </p>
            <p className="text-burgundy-700">
              Once approved, your shop will be visible to customers. You'll receive a notification when your shop is live.
            </p>
          </div>
          <p className="text-burgundy-700">
            In the meantime, you can start adding products or services to your shop from your dashboard.
          </p>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
          <Link href="/vendor" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-burgundy-900 hover:bg-burgundy-700 text-white px-6 py-2 text-base font-medium shadow-md" size="lg">
              Go to My Shop Dashboard
            </Button>
          </Link>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto border-2 border-burgundy-300 text-burgundy-900 hover:bg-burgundy/5 px-6 py-2 text-base font-medium" size="lg">
              Return to Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
} 