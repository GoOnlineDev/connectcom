"use client";

import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Globe, 
  Store, 
  ShoppingBag, 
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Calendar,
  Eye,
  Package,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdminShopDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AdminShopDetailsPage({ params }: AdminShopDetailsPageProps) {
  const resolvedParams = React.use(params);
  const [adminNotes, setAdminNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  
  const { toast } = useToast();
  
  // Get shop details with products/services
  const shopData = useQuery(api.shops.getShopWithItems, {
    shopId: resolvedParams.id as Id<"shops">
  });
  
  // Admin mutations
  const updateShopStatus = useMutation(api.admin.updateShopStatus);
  const deleteShop = useMutation(api.admin.deleteShop);

  // Handle status change
  const handleStatusChange = async (status: string) => {
    if (!shopData) return;
    
    setIsUpdating(true);
    try {
      await updateShopStatus({ 
        shopId: shopData._id, 
        status, 
        adminNotes: adminNotes || undefined 
      });
      toast({
        title: "Status Updated",
        description: `Shop status changed to ${status}.`,
      });
      setAdminNotes("");
    } catch (error) {
      console.error("Error updating shop status:", error);
      toast({
        title: "Error",
        description: "Failed to update shop status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle shop deletion
  const handleDeleteShop = async () => {
    if (!shopData) return;
    
    setIsUpdating(true);
    try {
      await deleteShop({ shopId: shopData._id });
      toast({
        title: "Shop Deleted",
        description: `${shopData.shopName} has been successfully deleted.`,
      });
      // Redirect to shops list after deletion
      window.location.href = '/admin/shops';
    } catch (error) {
      console.error("Error deleting shop:", error);
      toast({
        title: "Error",
        description: "Failed to delete shop. Please try again.",
        variant: "destructive",
      });
      setIsUpdating(false);
    }
  };

  // Loading state
  if (shopData === undefined) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy mx-auto"></div>
          <p className="mt-4 text-burgundy/80">Loading shop details...</p>
        </div>
      </div>
    );
  }

  // Shop not found
  if (!shopData) {
    notFound();
  }

  const { products, services, ...shop } = shopData;
  const items = shop.shopType === 'product_shop' ? products : services;

  // Get status color and icon
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'active':
        return { 
          color: 'bg-green-100 text-green-800 hover:bg-green-100', 
          icon: CheckCircle, 
          label: 'Active' 
        };
      case 'pending_approval':
        return { 
          color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100', 
          icon: Clock, 
          label: 'Pending Approval' 
        };
      case 'rejected':
        return { 
          color: 'bg-red-100 text-red-800 hover:bg-red-100', 
          icon: XCircle, 
          label: 'Rejected' 
        };
      case 'suspended':
        return { 
          color: 'bg-gray-100 text-gray-800 hover:bg-gray-100', 
          icon: AlertTriangle, 
          label: 'Suspended' 
        };
      default:
        return { 
          color: 'bg-gray-100 text-gray-800 hover:bg-gray-100', 
          icon: AlertTriangle, 
          label: status 
        };
    }
  };

  const statusDisplay = getStatusDisplay(shop.status);
  const StatusIcon = statusDisplay.icon;

  return (
    <div className="min-h-screen bg-beige">
      {/* Header */}
      <div className="bg-white border-b border-burgundy/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/admin/shops" 
                className="inline-flex items-center gap-2 text-burgundy hover:text-burgundy-dark transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Shops
              </Link>
              <Separator orientation="vertical" className="h-6 bg-burgundy/20" />
              <div>
                <h1 className="text-2xl font-bold text-burgundy">Shop Details</h1>
                <p className="text-burgundy/70">Administrative view and management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link href={`/shops/${shop._id}`}>
                <Button variant="outline" className="border-burgundy text-burgundy hover:bg-burgundy/10">
                  <Eye className="w-4 h-4 mr-2" />
                  View Public Page
                </Button>
              </Link>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isUpdating}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Shop
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Shop</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{shop.shopName}"? This action cannot be undone.
                      All products, services, and data associated with this shop will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteShop}
                      disabled={isUpdating}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isUpdating ? "Deleting..." : "Delete Shop"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Shop Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Shop Info */}
            <Card className="border-burgundy/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-burgundy/10 rounded-lg flex items-center justify-center">
                      {shop.shopLogoUrl ? (
                        <img
                          src={shop.shopLogoUrl}
                          alt={shop.shopName}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Store className="w-8 h-8 text-burgundy/60" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-burgundy">{shop.shopName}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={statusDisplay.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusDisplay.label}
                        </Badge>
                        <Badge variant="outline" className="border-burgundy/30 text-burgundy">
                          {shop.shopType === 'product_shop' ? (
                            <><ShoppingBag className="w-3 h-3 mr-1" /> Product Shop</>
                          ) : (
                            <><Store className="w-3 h-3 mr-1" /> Service Shop</>
                          )}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {shop.description && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-burgundy mb-2">Description</h4>
                    <p className="text-burgundy/80 leading-relaxed">{shop.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Owner Information */}
                  <div>
                    <h4 className="font-semibold text-burgundy mb-3 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Owner Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-burgundy/70">Owner ID:</span>
                        <span className="font-mono text-burgundy">{shop.ownerId.substring(0, 12)}...</span>
                      </div>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div>
                    <h4 className="font-semibold text-burgundy mb-3 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Timeline
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-burgundy/70">Created:</span>
                        <span className="text-burgundy">{new Date(shop.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-burgundy/70">Updated:</span>
                        <span className="text-burgundy">{new Date(shop.updatedAt).toLocaleDateString()}</span>
                      </div>
                      {shop.reviewedAt && (
                        <div className="flex items-center justify-between">
                          <span className="text-burgundy/70">Reviewed:</span>
                          <span className="text-burgundy">{new Date(shop.reviewedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact & Location */}
            <Card className="border-burgundy/20">
              <CardHeader>
                <CardTitle className="text-lg text-burgundy">Contact & Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Information */}
                  <div>
                    <h4 className="font-semibold text-burgundy mb-3">Contact Information</h4>
                    <div className="space-y-3">
                      {shop.contactInfo?.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-burgundy" />
                          <span className="text-burgundy/80">{shop.contactInfo.email}</span>
                        </div>
                      )}
                      {shop.contactInfo?.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-burgundy" />
                          <span className="text-burgundy/80">{shop.contactInfo.phone}</span>
                        </div>
                      )}
                      {shop.contactInfo?.website && (
                        <div className="flex items-center gap-3">
                          <Globe className="w-4 h-4 text-burgundy" />
                          <a 
                            href={shop.contactInfo.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-burgundy hover:text-burgundy-dark hover:underline"
                          >
                            {shop.contactInfo.website}
                          </a>
                        </div>
                      )}
                      {!shop.contactInfo?.email && !shop.contactInfo?.phone && !shop.contactInfo?.website && (
                        <p className="text-burgundy/60 italic">No contact information provided</p>
                      )}
                    </div>
                  </div>

                  {/* Location & Hours */}
                  <div>
                    <h4 className="font-semibold text-burgundy mb-3">Location & Hours</h4>
                    <div className="space-y-3">
                      {shop.physicalLocation && (
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-burgundy mt-0.5" />
                          <span className="text-burgundy/80">
                            {typeof shop.physicalLocation === 'string' 
                              ? shop.physicalLocation 
                              : 'Physical location available'
                            }
                          </span>
                        </div>
                      )}
                      {shop.operatingHours && (
                        <div className="flex items-start gap-3">
                          <Clock className="w-4 h-4 text-burgundy mt-0.5" />
                          <span className="text-burgundy/80">
                            {typeof shop.operatingHours === 'string' 
                              ? shop.operatingHours 
                              : 'Operating hours available'
                            }
                          </span>
                        </div>
                      )}
                      {!shop.physicalLocation && !shop.operatingHours && (
                        <p className="text-burgundy/60 italic">No location or hours provided</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Categories */}
                {shop.categories && shop.categories.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-burgundy mb-3">Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {shop.categories.map((category) => (
                        <Badge key={category} variant="outline" className="border-burgundy/30 text-burgundy">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Products/Services */}
            <Card className="border-burgundy/20">
              <CardHeader>
                <CardTitle className="text-lg text-burgundy flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  {shop.shopType === 'product_shop' ? 'Products' : 'Services'} ({items.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {items.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item) => (
                      <Card key={item._id} className="border border-burgundy/10">
                        <CardContent className="p-4">
                          <h5 className="font-semibold text-burgundy mb-2">{item.name}</h5>
                          {item.description && (
                            <p className="text-sm text-burgundy/70 mb-3 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          
                          {/* Product specific details */}
                          {shop.shopType === 'product_shop' && (
                            <div className="space-y-1 text-xs text-burgundy/80">
                              {'price' in item && item.price && (
                                <div>Price: ${(item.price / 100).toFixed(2)}</div>
                              )}
                              {'quantityAvailable' in item && item.quantityAvailable !== undefined && (
                                <div>Stock: {item.quantityAvailable} available</div>
                              )}
                            </div>
                          )}

                          {/* Service specific details */}
                          {shop.shopType === 'service_shop' && (
                            <div className="space-y-1 text-xs text-burgundy/80">
                              {'duration' in item && item.duration && (
                                <div>Duration: {item.duration}</div>
                              )}
                              {'pricing' in item && item.pricing && (
                                <div>
                                  Price: {typeof item.pricing === 'string' ? item.pricing : 'Contact for pricing'}
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-burgundy/40 mx-auto mb-3" />
                    <p className="text-burgundy/70">
                      No {shop.shopType === 'product_shop' ? 'products' : 'services'} added yet
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Admin Actions */}
          <div className="space-y-6">
            {/* Status Management */}
            <Card className="border-burgundy/20 sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg text-burgundy flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Admin Actions
                </CardTitle>
                <CardDescription>
                  Manage shop status and add administrative notes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Current Status */}
                <div>
                  <label className="text-sm font-medium text-burgundy mb-2 block">Current Status</label>
                  <Badge className={`${statusDisplay.color} text-sm`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusDisplay.label}
                  </Badge>
                </div>

                {/* Admin Notes */}
                <div>
                  <label className="text-sm font-medium text-burgundy mb-2 block">
                    Admin Notes (optional)
                  </label>
                  <Textarea
                    placeholder="Add notes about this status change..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="border-burgundy/20 focus:border-burgundy"
                    rows={3}
                  />
                </div>

                {/* Existing Admin Notes */}
                {shop.adminNotes && (
                  <div>
                    <label className="text-sm font-medium text-burgundy mb-2 block">
                      Previous Admin Notes
                    </label>
                    <div className="bg-burgundy/5 border border-burgundy/20 rounded-md p-3">
                      <p className="text-sm text-burgundy/80">{shop.adminNotes}</p>
                    </div>
                  </div>
                )}

                <Separator className="bg-burgundy/20" />

                {/* Status Actions */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-burgundy">Change Status</h4>
                  
                  {shop.status !== "active" && (
                    <Button
                      onClick={() => handleStatusChange("active")}
                      disabled={isUpdating}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {isUpdating ? "Updating..." : "Activate Shop"}
                    </Button>
                  )}

                  {shop.status === "active" && (
                    <Button
                      onClick={() => handleStatusChange("suspended")}
                      disabled={isUpdating}
                      variant="outline"
                      className="w-full border-yellow-600 text-yellow-600 hover:bg-yellow-50"
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      {isUpdating ? "Updating..." : "Suspend Shop"}
                    </Button>
                  )}

                  {shop.status !== "rejected" && (
                    <Button
                      onClick={() => handleStatusChange("rejected")}
                      disabled={isUpdating}
                      variant="outline"
                      className="w-full border-red-600 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      {isUpdating ? "Updating..." : "Reject Shop"}
                    </Button>
                  )}

                  {shop.status === "pending_approval" && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                      <p className="text-sm text-yellow-800">
                        This shop is waiting for approval. Review the information and approve or reject.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
