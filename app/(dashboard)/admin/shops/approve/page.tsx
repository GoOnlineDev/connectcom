"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";

// Type definition for shop object from admin query
type AdminShop = {
  _id: Id<"shops">;
  _creationTime: number;
  ownerId: string;
  shopName: string;
  shopLogoUrl?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  operatingHours?: any;
  physicalLocation?: any;
  description?: string;
  shopType: string;
  categories?: string[];
  productIds?: Id<"products">[];
  serviceIds?: Id<"services">[];
  shelfIds?: Id<"shelves">[];
  status: string;
  adminNotes?: string;
  reviewedAt?: number;
  shopLayoutConfig?: any;
  createdAt: number;
  updatedAt: number;
};
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Store, 
  CheckCircle, 
  XCircle, 
  Info, 
  Calendar, 
  Phone, 
  Mail,
  Globe,
  MapPin,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

export default function ShopApprovalPage() {
  const { toast } = useToast();
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
  const [processingShops, setProcessingShops] = useState<Record<string, boolean>>({});
  
  // Get all shops
  const shops = useQuery(api.admin.getShops, {});
  
  // Update shop status mutation
  const updateShopStatus = useMutation(api.admin.updateShopStatus);
  
  // Handle shop approval
  const handleApprove = async (shopId: Id<"shops">) => {
    setProcessingShops(prev => ({ ...prev, [shopId]: true }));
    try {
      // Find the shop to get owner details
      const shop = shops?.find((s: any) => s._id === shopId);
      if (!shop) {
        throw new Error("Shop not found");
      }

      const previousStatus = shop.status;
      
      await updateShopStatus({
        shopId,
        status: "active",
        adminNotes: adminNotes[shopId]
      });

      // Send email notification to shop owner
      try {
        const emailResponse = await fetch('/api/send-email/shop-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            shopName: shop.shopName,
            shopOwnerEmail: shop.contactInfo?.email || '',
            shopOwnerName: shop.ownerId, // We might need to fetch user details
            newStatus: "active",
            previousStatus: previousStatus,
            adminNotes: adminNotes[shopId] || '',
          }),
        });

        if (!emailResponse.ok) {
          console.error('Failed to send approval email to shop owner');
        }
      } catch (emailError) {
        console.error('Error sending approval email:', emailError);
        // Don't block the approval process if email fails
      }

      toast({
        title: "Shop Approved",
        description: "The shop has been approved successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error approving shop:", error);
      toast({
        title: "Error",
        description: "Failed to approve shop. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingShops(prev => ({ ...prev, [shopId]: false }));
    }
  };
  
  // Handle shop rejection
  const handleReject = async (shopId: Id<"shops">) => {
    if (!adminNotes[shopId] || adminNotes[shopId].trim() === "") {
      toast({
        title: "Note Required",
        description: "Please provide a reason for rejecting this shop.",
        variant: "destructive",
      });
      return;
    }
    
    setProcessingShops(prev => ({ ...prev, [shopId]: true }));
    try {
      // Find the shop to get owner details
      const shop = shops?.find((s: any) => s._id === shopId);
      if (!shop) {
        throw new Error("Shop not found");
      }

      const previousStatus = shop.status;
      
      await updateShopStatus({
        shopId,
        status: "rejected",
        adminNotes: adminNotes[shopId]
      });

      // Send email notification to shop owner
      try {
        const emailResponse = await fetch('/api/send-email/shop-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            shopName: shop.shopName,
            shopOwnerEmail: shop.contactInfo?.email || '',
            shopOwnerName: shop.ownerId, // We might need to fetch user details
            newStatus: "rejected",
            previousStatus: previousStatus,
            adminNotes: adminNotes[shopId] || '',
          }),
        });

        if (!emailResponse.ok) {
          console.error('Failed to send rejection email to shop owner');
        }
      } catch (emailError) {
        console.error('Error sending rejection email:', emailError);
        // Don't block the rejection process if email fails
      }

      toast({
        title: "Shop Rejected",
        description: "The shop has been rejected.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error rejecting shop:", error);
      toast({
        title: "Error",
        description: "Failed to reject shop. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingShops(prev => ({ ...prev, [shopId]: false }));
    }
  };
  
  // Show loading state while data is being fetched
  if (!shops) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">Shop Approvals</h1>
        </div>
        <Skeleton className="h-12 w-full mb-6" />
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }
  
  // Filter shops by status
  const pendingShops = shops?.filter((shop: AdminShop) => shop.status === "pending_approval") || [];
  const approvedShops = shops?.filter((shop: AdminShop) => shop.status === "active") || [];
  const rejectedShops = shops?.filter((shop: AdminShop) => shop.status === "rejected") || [];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Shop Approvals</h1>
        <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100 hover:text-blue-600">
          {pendingShops.length} Pending Approval
        </Badge>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="pending" className="w-full mb-6">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingShops.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedShops.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedShops.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="mt-6">
          {pendingShops.length > 0 ? (
            <div className="space-y-6">
              {pendingShops.map((shop: AdminShop) => (
                <Card key={shop._id} className="overflow-hidden">
                  <CardHeader className="bg-amber-50 border-b pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                          <Store className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-gray-800">{shop.shopName}</CardTitle>
                          <CardDescription>
                            Submitted on {new Date(shop.createdAt).toLocaleDateString()} •&nbsp;
                            {shop.shopType === "product_shop" ? "Product Shop" : "Service Shop"}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 hover:text-amber-800">
                        Pending Approval
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Shop Details</h3>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Description</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {shop.description || "No description provided"}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            {shop.contactInfo?.email && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                <span>{shop.contactInfo.email}</span>
                              </div>
                            )}
                            
                            {shop.contactInfo?.phone && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                <span>{shop.contactInfo.phone}</span>
                              </div>
                            )}
                            
                            {shop.contactInfo?.website && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Globe className="h-4 w-4 mr-2 text-gray-400" />
                                <span>{shop.contactInfo.website}</span>
                              </div>
                            )}
                            
                            {shop.physicalLocation && (
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                <span>{shop.physicalLocation.toString()}</span>
                              </div>
                            )}
                            
                            {shop.operatingHours && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                <span>{shop.operatingHours.toString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Admin Notes</h3>
                        <Textarea 
                          placeholder="Add notes about this shop (required for rejection)"
                          className="min-h-[120px]"
                          value={adminNotes[shop._id] || ""}
                          onChange={(e) => setAdminNotes(prev => ({ ...prev, [shop._id]: e.target.value }))}
                        />
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="border-t pt-4 flex justify-end space-x-4">
                    <Button 
                      variant="outline" 
                      onClick={() => handleReject(shop._id)}
                      disabled={processingShops[shop._id]}
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button 
                      onClick={() => handleApprove(shop._id)}
                      disabled={processingShops[shop._id]}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
                <h3 className="text-lg font-medium text-gray-800 mb-1">No Pending Shops</h3>
                <p className="text-gray-600">
                  There are no shops waiting for approval at this time.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="approved" className="mt-6">
          {approvedShops.length > 0 ? (
            <div className="space-y-4">
              {approvedShops.map((shop: AdminShop) => (
                <Card key={shop._id} className="overflow-hidden">
                  <CardHeader className="bg-green-50 border-b pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                          <Store className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-gray-800">{shop.shopName}</CardTitle>
                          <CardDescription>
                            Approved on {shop.reviewedAt ? new Date(shop.reviewedAt).toLocaleDateString() : "Unknown"} •&nbsp;
                            {shop.shopType === "product_shop" ? "Product Shop" : "Service Shop"}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800">
                        Approved
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-4">
                    <div className="flex items-start">
                      <Info className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                      <p className="text-sm text-gray-600">
                        This shop has been approved and is visible to customers.
                      </p>
                    </div>
                    
                    {shop.adminNotes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm font-medium text-gray-700 mb-1">Admin Notes:</p>
                        <p className="text-sm text-gray-600">{shop.adminNotes}</p>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="border-t pt-4">
                    <Link href={`/admin/shops/${shop._id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center text-center">
                <Info className="h-12 w-12 text-blue-500 mb-3" />
                <h3 className="text-lg font-medium text-gray-800 mb-1">No Approved Shops</h3>
                <p className="text-gray-600">
                  There are no approved shops at this time.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="rejected" className="mt-6">
          {rejectedShops.length > 0 ? (
            <div className="space-y-4">
              {rejectedShops.map((shop: AdminShop) => (
                <Card key={shop._id} className="overflow-hidden">
                  <CardHeader className="bg-red-50 border-b pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                          <Store className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-gray-800">{shop.shopName}</CardTitle>
                          <CardDescription>
                            Rejected on {shop.reviewedAt ? new Date(shop.reviewedAt).toLocaleDateString() : "Unknown"} •&nbsp;
                            {shop.shopType === "product_shop" ? "Product Shop" : "Service Shop"}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800">
                        Rejected
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-4">
                    <div className="flex items-start">
                      <Info className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                      <p className="text-sm text-gray-600">
                        This shop has been rejected and is not visible to customers.
                      </p>
                    </div>
                    
                    {shop.adminNotes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm font-medium text-gray-700 mb-1">Rejection Reason:</p>
                        <p className="text-sm text-gray-600">{shop.adminNotes}</p>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="border-t pt-4">
                    <Link href={`/admin/shops/${shop._id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center text-center">
                <Info className="h-12 w-12 text-blue-500 mb-3" />
                <h3 className="text-lg font-medium text-gray-800 mb-1">No Rejected Shops</h3>
                <p className="text-gray-600">
                  There are no rejected shops at this time.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 