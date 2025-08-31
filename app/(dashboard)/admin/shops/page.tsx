"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Store, 
  Search, 
  Plus, 
  ChevronDown, 
  Trash2, 
  Eye,
  Edit,
  ShoppingBag,
  MapPin,
  Phone,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
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
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useToast } from "@/components/ui/use-toast";

// Define shop type
type Shop = Doc<"shops">;

const SHOP_CATEGORIES = [
  'Fashion', 'Food & Beverage', 'Technology', 'Health & Beauty', 
  'Home & Garden', 'Sports & Recreation', 'Education', 'Professional Services'
];

export default function AdminShopsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  
  const { toast } = useToast();
  
  // Get all shops
  const shops = useQuery(api.admin.getShops, {}) || [];
  
  // Delete shop mutation
  const deleteShop = useMutation(api.admin.deleteShop);
  const updateShopStatus = useMutation(api.admin.updateShopStatus);
  
  // Handle shop deletion
  const handleDeleteShop = async (shopId: Id<"shops">, shopName: string) => {
    setIsDeleting(true);
    try {
      await deleteShop({ shopId });
      toast({
        title: "Shop Deleted",
        description: `${shopName} has been successfully deleted.`,
      });
    } catch (error) {
      console.error("Error deleting shop:", error);
      toast({
        title: "Error",
        description: "Failed to delete shop. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle status change
  const handleStatusChange = async (shopId: Id<"shops">, status: string, shopName: string) => {
    try {
      await updateShopStatus({ shopId, status });
      toast({
        title: "Status Updated",
        description: `${shopName} status changed to ${status}.`,
      });
    } catch (error) {
      console.error("Error updating shop status:", error);
      toast({
        title: "Error",
        description: "Failed to update shop status. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Filtered shops based on search query and filters
  const filteredShops = shops.filter((shop: Shop) => {
    // Filter by search query
    const matchesSearch = searchQuery === "" || 
      shop.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (shop.description && shop.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      shop.ownerId.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by status
    const matchesStatus = statusFilter === "all" || shop.status === statusFilter;
    
    // Filter by type
    const matchesType = typeFilter === "all" || shop.shopType === typeFilter;
    
    // Filter by category
    const matchesCategory = categoryFilter === "all" || 
      (shop.categories && shop.categories.includes(categoryFilter));
    
    // Filter by active tab
    const matchesTab = activeTab === "all" || shop.status === activeTab;
    
    return matchesSearch && matchesStatus && matchesType && matchesCategory && matchesTab;
  });
  
  // Count shops by status
  const shopCounts = {
    all: shops.length,
    pending_approval: shops.filter((shop: Shop) => shop.status === "pending_approval").length,
    active: shops.filter((shop: Shop) => shop.status === "active").length,
    rejected: shops.filter((shop: Shop) => shop.status === "rejected").length,
    suspended: shops.filter((shop: Shop) => shop.status === "suspended").length,
  };
  
  // Show loading state while data is being fetched
  if (shops.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-burgundy">Shop Management</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-48" />
        </div>
        <Skeleton className="h-12 w-full mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-burgundy">Shop Management</h1>
        <div className="flex gap-2">
          <Link href="/admin/shops/approve">
            <Button variant="outline" className="border-burgundy text-burgundy hover:bg-burgundy/10">
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Shops
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-burgundy/60" />
          <Input
            placeholder="Search shops..."
            className="pl-10 border-burgundy/20 focus:border-burgundy"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="border-burgundy/20 focus:border-burgundy">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending_approval">Pending Approval</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="border-burgundy/20 focus:border-burgundy">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="product_shop">Product Shops</SelectItem>
            <SelectItem value="service_shop">Service Shops</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="border-burgundy/20 focus:border-burgundy">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {SHOP_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({shopCounts.all})</TabsTrigger>
          <TabsTrigger value="pending_approval">Pending ({shopCounts.pending_approval})</TabsTrigger>
          <TabsTrigger value="active">Active ({shopCounts.active})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({shopCounts.rejected})</TabsTrigger>
          <TabsTrigger value="suspended">Suspended ({shopCounts.suspended})</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Shops list */}
      <Card className="border-burgundy/20">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-burgundy">Shops</CardTitle>
          <CardDescription>
            Manage all shops in the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredShops.length > 0 ? (
            <div className="space-y-4">
              {filteredShops.map((shop: Shop) => (
                <Card key={shop._id} className="border border-burgundy/10 hover:border-burgundy/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Shop Logo */}
                        <div className="w-16 h-16 bg-burgundy/10 rounded-lg flex items-center justify-center flex-shrink-0">
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
                        
                        {/* Shop Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-burgundy truncate">
                              {shop.shopName}
                            </h3>
                            
                            {/* Status Badge */}
                            <Badge 
                              variant={
                                shop.status === "active" ? "default" : 
                                shop.status === "pending_approval" ? "secondary" :
                                shop.status === "rejected" ? "destructive" : "outline"
                              }
                              className={
                                shop.status === "active" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                                shop.status === "pending_approval" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" :
                                shop.status === "rejected" ? "bg-red-100 text-red-800 hover:bg-red-100" :
                                "bg-gray-100 text-gray-800 hover:bg-gray-100"
                              }
                            >
                              {shop.status === "pending_approval" && <Clock className="w-3 h-3 mr-1" />}
                              {shop.status === "active" && <CheckCircle className="w-3 h-3 mr-1" />}
                              {shop.status === "rejected" && <XCircle className="w-3 h-3 mr-1" />}
                              {shop.status === "suspended" && <AlertTriangle className="w-3 h-3 mr-1" />}
                              {shop.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                            
                            {/* Shop Type Badge */}
                            <Badge variant="outline" className="border-burgundy/30 text-burgundy">
                              {shop.shopType === 'product_shop' ? (
                                <><ShoppingBag className="w-3 h-3 mr-1" /> Products</>
                              ) : (
                                <><Store className="w-3 h-3 mr-1" /> Services</>
                              )}
                            </Badge>
                          </div>
                          
                          {shop.description && (
                            <p className="text-burgundy/80 text-sm mb-3 line-clamp-2">
                              {shop.description}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap gap-4 text-sm text-burgundy/70">
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Owner:</span>
                              <span>{shop.ownerId.substring(0, 12)}...</span>
                            </div>
                            
                            {shop.contactInfo?.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                <span>{shop.contactInfo.phone}</span>
                              </div>
                            )}
                            
                            {shop.physicalLocation && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span>Physical Location</span>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Created:</span>
                              <span>{new Date(shop.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          {/* Categories */}
                          {shop.categories && shop.categories.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {shop.categories.slice(0, 3).map((category) => (
                                <Badge key={category} variant="outline" className="text-xs border-burgundy/20 text-burgundy/70">
                                  {category}
                                </Badge>
                              ))}
                              {shop.categories.length > 3 && (
                                <Badge variant="outline" className="text-xs border-burgundy/20 text-burgundy/70">
                                  +{shop.categories.length - 3} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-4">
                        <Link href={`/shops/${shop._id}`}>
                          <Button variant="outline" size="sm" className="border-burgundy/30 text-burgundy hover:bg-burgundy/10">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="border-burgundy/30 text-burgundy hover:bg-burgundy/10">
                              <ChevronDown className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Manage Shop</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            
                            {/* Status Changes */}
                            {shop.status !== "active" && (
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(shop._id, "active", shop.shopName)}
                                className="text-green-600"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Activate Shop
                              </DropdownMenuItem>
                            )}
                            
                            {shop.status === "active" && (
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(shop._id, "suspended", shop.shopName)}
                                className="text-yellow-600"
                              >
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                Suspend Shop
                              </DropdownMenuItem>
                            )}
                            
                            {shop.status !== "rejected" && (
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(shop._id, "rejected", shop.shopName)}
                                className="text-red-600"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject Shop
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuSeparator />
                            
                            {/* Delete Shop */}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem 
                                  onSelect={(e) => e.preventDefault()}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Shop
                                </DropdownMenuItem>
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
                                    onClick={() => handleDeleteShop(shop._id, shop.shopName)}
                                    disabled={isDeleting}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    {isDeleting ? "Deleting..." : "Delete Shop"}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Store className="h-12 w-12 text-burgundy/40 mb-4" />
              <h3 className="text-lg font-medium text-burgundy mb-1">No shops found</h3>
              <p className="text-burgundy/70 mb-4">
                {searchQuery || statusFilter !== "all" || typeFilter !== "all" || categoryFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No shops have been created yet"
                }
              </p>
              {(searchQuery || statusFilter !== "all" || typeFilter !== "all" || categoryFilter !== "all") && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setTypeFilter("all");
                    setCategoryFilter("all");
                  }}
                  className="border-burgundy text-burgundy hover:bg-burgundy/10"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t border-burgundy/20 pt-4 flex justify-between">
          <p className="text-sm text-burgundy/70">
            Showing {filteredShops.length} of {shops.length} shops
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
