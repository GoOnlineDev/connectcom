"use client";

import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { ProductImageUploadButton } from '@/utils/uploadthing';
import { 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Globe, 
  Store, 
  ShoppingBag, 
  ArrowLeft,
  MessageCircle,
  Info,
  Package,
  Edit3,
  Plus,
  Settings,
  Trash2,
  AlertCircle,
  Crown,
  Upload,
  X,
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface ShopPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ShopPage({ params }: ShopPageProps) {
  const resolvedParams = React.use(params);
  const [activeTab, setActiveTab] = useState("products");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isShelfDialogOpen, setIsShelfDialogOpen] = useState(false);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [selectedShelfId, setSelectedShelfId] = useState<Id<"shelves"> | null>(null);
  const [shelfName, setShelfName] = useState("");
  const [shelfDescription, setShelfDescription] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [itemDuration, setItemDuration] = useState("");
  const [itemPricing, setItemPricing] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isEditingItem, setIsEditingItem] = useState(false);
  
  const { user } = useUser();
  const { toast } = useToast();
  
  const shopData = useQuery(api.shops.getShopById, {
    shopId: resolvedParams.id as Id<"shops">
  });
  
  const shelves = useQuery(api.shelves.getShopShelves, {
    shopId: resolvedParams.id as Id<"shops">
  });
  
  const currentUser = useQuery(api.users.getCurrentUser);
  
  const shelfLimits = useQuery(api.subscriptions.canShopCreateShelf, {
    shopId: resolvedParams.id as Id<"shops">
  });
  
  const createShelf = useMutation(api.shelves.createShelf);
  const createProduct = useMutation(api.products.createProduct);
  const createService = useMutation(api.services.createService);
  const deleteShelf = useMutation(api.shelves.deleteShelf);
  const updateProduct = useMutation(api.products.updateProduct);
  const updateService = useMutation(api.services.updateService);
  const deleteProduct = useMutation(api.products.deleteProduct);
  const deleteService = useMutation(api.services.deleteService);

  // Loading state
  if (shopData === undefined || shelves === undefined || currentUser === undefined) {
    return (
      <div className="min-h-screen bg-beige-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600 mx-auto"></div>
          <p className="mt-4 text-burgundy-700">Loading shop details...</p>
        </div>
      </div>
    );
  }

  // Shop not found
  if (!shopData) {
    notFound();
  }

  // Check if current user is the owner of this shop
  const isOwner = currentUser && user && shopData.ownerId === user.id;
  const isVendor = currentUser?.role === 'vendor';

  const handleCreateShelf = async () => {
    if (!shelfName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a shelf name",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await createShelf({
        shopId: resolvedParams.id as Id<"shops">,
        shelfName: shelfName.trim(),
        shelfDescription: shelfDescription.trim() || undefined,
      });

      if (result.success) {
        toast({
          title: "Success",
          description: "Shelf created successfully",
        });
        setIsShelfDialogOpen(false);
        setShelfName("");
        setShelfDescription("");
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create shelf",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create shelf",
        variant: "destructive",
      });
    }
  };

  const handleCreateItem = async () => {
    if (!itemName.trim() || !selectedShelfId) {
      toast({
        title: "Error",
        description: "Please enter item details and select a shelf",
        variant: "destructive",
      });
      return;
    }

    try {
      let result;
      
      if (isEditingItem && editingItem) {
        // Update existing item
        if (shopData.shopType === 'product_shop') {
          if (!itemPrice) {
            toast({
              title: "Error",
              description: "Please enter a price for the product",
              variant: "destructive",
            });
            return;
          }
          
          result = await updateProduct({
            productId: editingItem._id,
            name: itemName.trim(),
            description: itemDescription.trim() || undefined,
            price: Math.round(parseFloat(itemPrice) * 100),
            quantityAvailable: itemQuantity ? parseInt(itemQuantity) : undefined,
            imageUrls: uploadedImages.length > 0 ? uploadedImages : undefined,
          });
        } else {
          result = await updateService({
            serviceId: editingItem._id,
            name: itemName.trim(),
            description: itemDescription.trim() || undefined,
            duration: itemDuration.trim() || undefined,
            pricing: itemPricing.trim() || undefined,
          });
        }
      } else {
        // Create new item
        if (shopData.shopType === 'product_shop') {
          if (!itemPrice) {
            toast({
              title: "Error",
              description: "Please enter a price for the product",
              variant: "destructive",
            });
            return;
          }
          
          result = await createProduct({
            shopId: resolvedParams.id as Id<"shops">,
            shelfId: selectedShelfId,
            name: itemName.trim(),
            description: itemDescription.trim() || undefined,
            price: Math.round(parseFloat(itemPrice) * 100), // Convert to cents
            quantityAvailable: itemQuantity ? parseInt(itemQuantity) : undefined,
            imageUrls: uploadedImages.length > 0 ? uploadedImages : undefined,
          });
        } else {
          result = await createService({
            shopId: resolvedParams.id as Id<"shops">,
            shelfId: selectedShelfId,
            name: itemName.trim(),
            description: itemDescription.trim() || undefined,
            duration: itemDuration.trim() || undefined,
            pricing: itemPricing.trim() || undefined,
          });
        }
      }

      if (result.success) {
        toast({
          title: "Success",
          description: `${shopData.shopType === 'product_shop' ? 'Product' : 'Service'} ${isEditingItem ? 'updated' : 'created'} successfully`,
        });
        resetItemForm();
      } else {
        toast({
          title: "Error",
          description: result.error || `Failed to ${isEditingItem ? 'update' : 'create'} ${shopData.shopType === 'product_shop' ? 'product' : 'service'}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditingItem ? 'update' : 'create'} ${shopData.shopType === 'product_shop' ? 'product' : 'service'}`,
        variant: "destructive",
      });
    }
  };

  const resetItemForm = () => {
    setIsItemDialogOpen(false);
    setIsEditingItem(false);
    setEditingItem(null);
    setSelectedShelfId(null);
    setItemName("");
    setItemDescription("");
    setItemPrice("");
    setItemQuantity("");
    setItemDuration("");
    setItemPricing("");
    setUploadedImages([]);
  };

  const handleEditItem = (item: any, shelfId: Id<"shelves">) => {
    setEditingItem(item);
    setIsEditingItem(true);
    setSelectedShelfId(shelfId);
    setItemName(item.name);
    setItemDescription(item.description || "");
    setUploadedImages(item.imageUrls || []);
    
    if (shopData.shopType === 'product_shop') {
      setItemPrice((item.price / 100).toString());
      setItemQuantity(item.quantityAvailable?.toString() || "");
    } else {
      setItemDuration(item.duration || "");
      setItemPricing(item.pricing || "");
    }
    
    setIsItemDialogOpen(true);
  };

  const handleDeleteItem = async (item: any) => {
    try {
      let result;
      if (shopData.shopType === 'product_shop') {
        result = await deleteProduct({ productId: item._id });
      } else {
        result = await deleteService({ serviceId: item._id });
      }

      if (result.success) {
        toast({
          title: "Success",
          description: `${shopData.shopType === 'product_shop' ? 'Product' : 'Service'} deleted successfully`,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || `Failed to delete ${shopData.shopType === 'product_shop' ? 'product' : 'service'}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete ${shopData.shopType === 'product_shop' ? 'product' : 'service'}`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteShelf = async (shelfId: Id<"shelves">) => {
    try {
      const result = await deleteShelf({ shelfId });
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Shelf deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete shelf",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete shelf",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-beige">
      {/* Back Navigation */}
      <div className="bg-white border-b border-burgundy-100">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/shops" 
            className="inline-flex items-center gap-2 text-burgundy-700 hover:text-burgundy-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shops
          </Link>
        </div>
      </div>

      {/* Shop Hero Section */}
      <div className="relative w-full bg-white shadow-sm">
        {/* Banner Image */}
        <div className="w-full h-64 md:h-80 bg-gradient-to-br from-beige-100 to-beige-300 relative flex items-center justify-center overflow-hidden">
          {shopData.shopImageUrl ? (
            <img
              src={shopData.shopImageUrl}
              alt={shopData.shopName}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <Store className="w-24 h-24 text-burgundy-300" />
            </div>
          )}
          {/* Overlay for darkening image for text readability */}
          <div className="absolute inset-0 bg-black/20" />
          {/* Shop Title Overlay */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg mb-2">{shopData.shopName}</h1>
            {shopData.categories && shopData.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {shopData.categories.map((category) => (
                  <Badge key={category} variant="outline" className="text-xs border-white/40 text-white bg-black/30">
                    {category}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">



            {/* Right Panel - Tabbed Content */}
            <div className="lg:col-span-2">
              {/* Edit Mode Notification */}
              {isEditMode && isOwner && isVendor && (
                <div className="mb-4 p-4 bg-burgundy-50 border border-burgundy-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-burgundy-600" />
                    <div>
                      <h4 className="font-semibold text-burgundy-900">Edit Mode Active</h4>
                      <p className="text-sm text-burgundy-700">You can now manage your shop content and shelves.</p>
                    </div>
                  </div>
                </div>
              )}
              
                              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="flex items-center justify-between mb-6">
                    <TabsList className="grid grid-cols-3 bg-beige-100 border border-burgundy-200">
                      <TabsTrigger 
                        value="products" 
                        className="flex items-center gap-2 data-[state=active]:bg-burgundy-600 data-[state=active]:text-white data-[state=active]:shadow-sm text-burgundy-700 hover:text-burgundy-900 hover:bg-burgundy-50"
                      >
                        <Package className="w-4 h-4" />
                        {shopData.shopType === 'product_shop' ? 'Products' : 'Services'}
                      </TabsTrigger>
                      <TabsTrigger 
                        value="about" 
                        className="flex items-center gap-2 data-[state=active]:bg-burgundy-600 data-[state=active]:text-white data-[state=active]:shadow-sm text-burgundy-700 hover:text-burgundy-900 hover:bg-burgundy-50"
                      >
                        <Info className="w-4 h-4" />
                        About Shop
                      </TabsTrigger>
                      <TabsTrigger 
                        value="contact" 
                        className="flex items-center gap-2 data-[state=active]:bg-burgundy-600 data-[state=active]:text-white data-[state=active]:shadow-sm text-burgundy-700 hover:text-burgundy-900 hover:bg-burgundy-50"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Contact Shop
                      </TabsTrigger>
                    </TabsList>
                  
                  {/* Edit Mode Toggle - Only show for shop owners */}
                  {isOwner && isVendor && (
                    <Button
                      onClick={() => setIsEditMode(!isEditMode)}
                      variant={isEditMode ? "default" : "outline"}
                      className={isEditMode ? "bg-burgundy-600 hover:bg-burgundy-700" : "border-burgundy-600 text-burgundy-700 hover:bg-burgundy-50"}
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      {isEditMode ? 'Exit Edit' : 'Edit Shop'}
                    </Button>
                  )}
                </div>

                {/* Products/Services Tab */}
                <TabsContent value="products" className="space-y-6">
                  {/* Subscription Limits Info */}
                  {isOwner && isVendor && shelfLimits && (
                    <Card className="border-burgundy-200 bg-gradient-to-r from-burgundy-50 to-burgundy-100">
                      <CardHeader>
                        <CardTitle className="text-burgundy-900 flex items-center gap-2">
                          <Crown className="w-5 h-5" />
                          Subscription Limits
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-burgundy-700">
                              {shelfLimits.currentShelfCount}/{shelfLimits.maxShelves}
                            </div>
                            <div className="text-burgundy-700">Shelves Used</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-burgundy-700 capitalize">
                              {shelfLimits.packageName}
                            </div>
                            <div className="text-burgundy-700">Current Plan</div>
                          </div>
                          <div className="text-center">
                            {shelfLimits.canCreate ? (
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                Can Add Shelves
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                Shelf Limit Reached
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Edit Mode Actions */}
                  {isEditMode && isOwner && isVendor && (
                    <Card className="border-burgundy-200 bg-burgundy-50">
                      <CardHeader>
                        <CardTitle className="text-burgundy-900 flex items-center gap-2">
                          <Settings className="w-5 h-5" />
                          Manage {shopData.shopType === 'product_shop' ? 'Products' : 'Services'}
                        </CardTitle>
                        <CardDescription>
                          Organize your shop with shelves and add {shopData.shopType === 'product_shop' ? 'products' : 'services'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-3">
                          <Dialog open={isShelfDialogOpen} onOpenChange={setIsShelfDialogOpen}>
                            <DialogTrigger asChild>
                              <Button 
                                className="bg-burgundy-600 hover:bg-burgundy-700"
                                disabled={!shelfLimits?.canCreate}
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add New Shelf
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Create New Shelf</DialogTitle>
                                <DialogDescription>
                                  Add a new shelf to organize your {shopData.shopType === 'product_shop' ? 'products' : 'services'}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="shelfName">Shelf Name</Label>
                                  <Input
                                    id="shelfName"
                                    value={shelfName}
                                    onChange={(e) => setShelfName(e.target.value)}
                                    placeholder="e.g., Electronics, Clothing, Featured Items"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="shelfDescription">Description (Optional)</Label>
                                  <Textarea
                                    id="shelfDescription"
                                    value={shelfDescription}
                                    onChange={(e) => setShelfDescription(e.target.value)}
                                    placeholder="Describe what this shelf contains..."
                                    rows={3}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsShelfDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleCreateShelf} className="bg-burgundy-600 hover:bg-burgundy-700">
                                  Create Shelf
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          {shelves && shelves.length > 0 && (
                            <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
                              <DialogTrigger asChild>
                                <Button variant="outline" className="border-burgundy-600 text-burgundy-700 hover:bg-burgundy-50">
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add {shopData.shopType === 'product_shop' ? 'Product' : 'Service'}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                                <DialogHeader className="flex-shrink-0">
                                  <DialogTitle>
                                    {isEditingItem ? 'Edit' : 'Add New'} {shopData.shopType === 'product_shop' ? 'Product' : 'Service'}
                                  </DialogTitle>
                                  <DialogDescription>
                                    {isEditingItem ? 'Update the' : 'Add a new'} {shopData.shopType === 'product_shop' ? 'product' : 'service'} {isEditingItem ? 'details' : 'to one of your shelves'}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                                  {!isEditingItem && (
                                    <div>
                                      <Label htmlFor="shelf">Select Shelf</Label>
                                      <select
                                        id="shelf"
                                        value={selectedShelfId || ""}
                                        onChange={(e) => setSelectedShelfId(e.target.value as Id<"shelves">)}
                                        className="w-full p-2 border rounded-md"
                                      >
                                        <option value="">Choose a shelf...</option>
                                        {shelves.map((shelf) => (
                                          <option key={shelf._id} value={shelf._id}>
                                            {shelf.shelfName}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  )}
                                  <div>
                                    <Label htmlFor="itemName">{shopData.shopType === 'product_shop' ? 'Product' : 'Service'} Name</Label>
                                    <Input
                                      id="itemName"
                                      value={itemName}
                                      onChange={(e) => setItemName(e.target.value)}
                                      placeholder={`Enter ${shopData.shopType === 'product_shop' ? 'product' : 'service'} name...`}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="itemDescription">Description</Label>
                                    <Textarea
                                      id="itemDescription"
                                      value={itemDescription}
                                      onChange={(e) => setItemDescription(e.target.value)}
                                      placeholder="Describe your item..."
                                      rows={3}
                                    />
                                  </div>

                                                                    {/* Image Upload Section */}
                                  <div>
                                    <Label>Images (Optional)</Label>
                                    <div className="space-y-4">
                                      <ProductImageUploadButton
                                        endpoint="productImageUploader"
                                        onClientUploadComplete={(res) => {
                                          const imageUrls = res.map(file => file.url);
                                          setUploadedImages(prev => [...prev, ...imageUrls].slice(0, 5));
                                          toast({
                                            title: "Success",
                                            description: `${res.length} image(s) uploaded successfully`,
                                          });
                                        }}
                                        onUploadError={(error) => {
                                          toast({
                                            title: "Error",
                                            description: "Failed to upload images",
                                            variant: "destructive",
                                          });
                                        }}
                                        className="w-full"
                                      />

                                      {/* Image Preview */}
                                      {uploadedImages.length > 0 && (
                                        <div>
                                          <div className="text-sm font-medium text-burgundy-700 mb-2">
                                            Uploaded Images ({uploadedImages.length}/5)
                                          </div>
                                          <div className="grid grid-cols-3 gap-2">
                                            {uploadedImages.map((url, index) => (
                                              <div key={index} className="relative group">
                                                <img
                                                  src={url}
                                                  alt={`Upload ${index + 1}`}
                                                  className="w-full h-20 object-cover rounded-lg border border-burgundy-200"
                                                />
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    setUploadedImages(prev => prev.filter((_, i) => i !== index));
                                                  }}
                                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                  <X className="w-3 h-3" />
                                                </button>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {shopData.shopType === 'product_shop' ? (
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label htmlFor="itemPrice">Price ($)</Label>
                                        <Input
                                          id="itemPrice"
                                          type="number"
                                          step="0.01"
                                          value={itemPrice}
                                          onChange={(e) => setItemPrice(e.target.value)}
                                          placeholder="0.00"
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="itemQuantity">Quantity Available</Label>
                                        <Input
                                          id="itemQuantity"
                                          type="number"
                                          value={itemQuantity}
                                          onChange={(e) => setItemQuantity(e.target.value)}
                                          placeholder="Optional"
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label htmlFor="itemDuration">Duration</Label>
                                        <Input
                                          id="itemDuration"
                                          value={itemDuration}
                                          onChange={(e) => setItemDuration(e.target.value)}
                                          placeholder="e.g., 30 minutes, 2 hours"
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="itemPricing">Pricing</Label>
                                        <Input
                                          id="itemPricing"
                                          value={itemPricing}
                                          onChange={(e) => setItemPricing(e.target.value)}
                                          placeholder="e.g., $50/hour, Contact for quote"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <DialogFooter className="flex-shrink-0 mt-4">
                                  <Button 
                                    variant="outline" 
                                    onClick={resetItemForm}
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    onClick={handleCreateItem} 
                                    className="bg-burgundy-600 hover:bg-burgundy-700"
                                  >
                                    {isEditingItem ? 'Update' : 'Add'} {shopData.shopType === 'product_shop' ? 'Product' : 'Service'}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Shelves Display */}
                  {shelves && shelves.length > 0 ? (
                    <div className="space-y-6">
                      {shelves.map((shelf) => (
                        <ShelfComponent
                          key={shelf._id}
                          shelf={shelf}
                          shopType={shopData.shopType}
                          isEditMode={!!(isEditMode && isOwner && isVendor)}
                          onDeleteShelf={handleDeleteShelf}
                          onEditItem={handleEditItem}
                          onDeleteItem={handleDeleteItem}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card className="text-center py-12 border-burgundy-200">
                      <CardContent>
                        <Store className="mx-auto h-16 w-16 text-burgundy-400 mb-4" />
                        <h3 className="text-xl font-semibold text-burgundy-900 mb-2">
                          No shelves yet
                        </h3>
                        <p className="text-burgundy-700 mb-4">
                          {isOwner && isVendor 
                            ? "Create your first shelf to start organizing your shop"
                            : "This shop hasn't set up any shelves yet. Check back later!"
                          }
                        </p>
                        {isOwner && isVendor && (
                          <Button 
                            onClick={() => setIsEditMode(true)}
                            className="bg-burgundy-600 hover:bg-burgundy-700"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Get Started
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* About Shop Tab */}
                <TabsContent value="about" className="space-y-6">
                  <Card className="border-burgundy-200">
                    <CardHeader>
                      <CardTitle className="text-burgundy-900">About {shopData.shopName}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {shopData.description ? (
                        <p className="text-burgundy-700 leading-relaxed">
                          {shopData.description}
                        </p>
                      ) : (
                        <p className="text-burgundy-600 italic">
                          No description available for this shop.
                        </p>
                      )}

                      <Separator className="bg-burgundy-200" />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-burgundy-900 mb-3">Shop Information</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant={shopData.shopType === 'product_shop' ? 'default' : 'secondary'} 
                                     className="bg-burgundy-600 hover:bg-burgundy-700">
                                {shopData.shopType === 'product_shop' ? (
                                  <><ShoppingBag className="w-4 h-4 mr-1" /> Product Shop</>
                                ) : (
                                  <><Store className="w-4 h-4 mr-1" /> Service Shop</>
                                )}
                              </Badge>
                            </div>
                            {shopData.categories && shopData.categories.length > 0 && (
                              <div>
                                <p className="text-sm text-burgundy-700 mb-2">Categories:</p>
                                <div className="flex flex-wrap gap-1">
                                  {shopData.categories.map((category) => (
                                    <Badge key={category} variant="outline" className="text-xs border-burgundy-300 text-burgundy-700">
                                      {category}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {shopData.operatingHours && (
                          <div>
                            <h4 className="font-semibold text-burgundy-900 mb-3">Operating Hours</h4>
                            <div className="flex items-start gap-2">
                              <Clock className="w-4 h-4 text-burgundy-700 mt-0.5" />
                              <span className="text-sm text-burgundy-700">
                                {typeof shopData.operatingHours === 'string' 
                                  ? shopData.operatingHours 
                                  : 'View operating hours'
                                }
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Contact Shop Tab */}
                <TabsContent value="contact" className="space-y-6">
                  <Card className="border-burgundy-200">
                    <CardHeader>
                      <CardTitle className="text-burgundy-900">Contact {shopData.shopName}</CardTitle>
                      <CardDescription>
                        Get in touch with the shop for inquiries, orders, or support.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-burgundy-900 mb-3">Contact Information</h4>
                          <div className="space-y-3">
                            {shopData.contactInfo?.phone && (
                              <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-burgundy-600" />
                                <span className="text-sm text-burgundy-700">{shopData.contactInfo.phone}</span>
                              </div>
                            )}
                            
                            {shopData.contactInfo?.email && (
                              <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-burgundy-600" />
                                <span className="text-sm text-burgundy-700">{shopData.contactInfo.email}</span>
                              </div>
                            )}
                            
                            {shopData.contactInfo?.website && (
                              <div className="flex items-center gap-3">
                                <Globe className="w-4 h-4 text-burgundy-600" />
                                <a 
                                  href={shopData.contactInfo.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm text-burgundy-700 hover:text-burgundy-900 hover:underline"
                                >
                                  Visit Website
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        {shopData.physicalLocation && (
                          <div>
                            <h4 className="font-semibold text-burgundy-900 mb-3">Location</h4>
                            <div className="flex items-start gap-3">
                              <MapPin className="w-4 h-4 text-burgundy-600 mt-0.5" />
                              <span className="text-sm text-burgundy-700">
                                {typeof shopData.physicalLocation === 'string' 
                                  ? shopData.physicalLocation 
                                  : 'Physical location available'
                                }
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <Separator className="bg-burgundy-200" />

                      <div className="space-y-4">
                        <h4 className="font-semibold text-burgundy-900">Get in Touch</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {shopData.contactInfo?.phone && (
                            <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Contact Shop
                            </Button>
                          )}
                          
                          {shopData.contactInfo?.website && (
                            <Button variant="outline" className="border-burgundy-600 text-burgundy-700 hover:bg-burgundy-50">
                              <Globe className="w-4 h-4 mr-2" />
                              Visit Website
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-burgundy-200 shadow-lg p-4 lg:hidden">
        <div className="flex gap-2">
          <Button 
            onClick={() => setActiveTab("products")} 
            variant={activeTab === "products" ? "default" : "outline"}
            className={`flex-1 ${activeTab === "products" ? "bg-burgundy-600 hover:bg-burgundy-700" : "border-burgundy-600 text-burgundy-700 hover:bg-burgundy-50"}`}
            size="sm"
          >
            <Package className="w-4 h-4 mr-2" />
            {shopData.shopType === 'product_shop' ? 'Products' : 'Services'}
          </Button>
          
          <Button 
            onClick={() => setActiveTab("about")} 
            variant={activeTab === "about" ? "default" : "outline"}
            className={`flex-1 ${activeTab === "about" ? "bg-burgundy-600 hover:bg-burgundy-700" : "border-burgundy-600 text-burgundy-700 hover:bg-burgundy-50"}`}
            size="sm"
          >
            <Info className="w-4 h-4 mr-2" />
            About
          </Button>

          <Button 
            onClick={() => setActiveTab("contact")} 
            variant={activeTab === "contact" ? "default" : "outline"}
            className={`flex-1 ${activeTab === "contact" ? "bg-burgundy-600 hover:bg-burgundy-700" : "border-burgundy-600 text-burgundy-700 hover:bg-burgundy-50"}`}
            size="sm"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact
          </Button>
        </div>
      </div>

      {/* Add bottom padding for mobile action bar */}
      <div className="h-20 lg:hidden"></div>
    </div>
  );
}

// Shelf Component to display individual shelves with their items
interface ShelfComponentProps {
  shelf: {
    _id: Id<"shelves">;
    shelfName: string;
    shelfDescription?: string;
    shelfOrder: number;
  };
  shopType: string;
  isEditMode: boolean;
  onDeleteShelf: (shelfId: Id<"shelves">) => void;
  onEditItem: (item: any, shelfId: Id<"shelves">) => void;
  onDeleteItem: (item: any) => void;
}

function ShelfComponent({ shelf, shopType, isEditMode, onDeleteShelf, onEditItem, onDeleteItem }: ShelfComponentProps) {
  const shelfWithItems = useQuery(api.shelves.getShelfWithItems, {
    shelfId: shelf._id
  });
  
  const shelfItemLimits = useQuery(api.subscriptions.canShelfAddItem, {
    shelfId: shelf._id
  });

  if (!shelfWithItems) {
    return (
      <Card className="border-burgundy-200">
        <CardContent className="p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-burgundy-200 h-4 w-4"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-burgundy-200 rounded w-1/4"></div>
              <div className="h-3 bg-burgundy-200 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const items = shopType === 'product_shop' ? shelfWithItems.products : shelfWithItems.services;

  return (
    <Card className="border-burgundy-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-burgundy-600 rounded-full"></div>
            <div>
              <CardTitle className="text-lg text-burgundy-900">{shelf.shelfName}</CardTitle>
              {shelf.shelfDescription && (
                <CardDescription className="text-burgundy-700">
                  {shelf.shelfDescription}
                </CardDescription>
              )}
            </div>
          </div>
          
          {isEditMode && (
            <div className="flex items-center gap-2">
              {shelfItemLimits && (
                <Badge variant="outline" className="text-xs border-burgundy-300 text-burgundy-700">
                  {shelfItemLimits.currentItemCount}/{shelfItemLimits.maxItems} items
                </Badge>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDeleteShelf(shelf._id)}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {items.length > 0 ? (
          <div className="relative">
            {/* Horizontal scroll container */}
            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-thin scrollbar-track-burgundy-100 scrollbar-thumb-burgundy-300 hover:scrollbar-thumb-burgundy-500">
              {items.map((item) => (
                <Card key={item._id} className="flex-shrink-0 w-64 hover:shadow-md transition-shadow border-burgundy-200 relative group">
                  <div className="h-32 bg-gradient-to-br from-beige-100 to-beige-300 rounded-t-lg relative">
                    {shopType === 'product_shop' && 'imageUrls' in item && item.imageUrls && item.imageUrls.length > 0 ? (
                      <img
                        src={item.imageUrls[0]}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        {shopType === 'product_shop' ? (
                          <ShoppingBag className="w-8 h-8 text-burgundy-400" />
                        ) : (
                          <Store className="w-8 h-8 text-burgundy-400" />
                        )}
                      </div>
                    )}
                    
                    {shopType === 'product_shop' && 'price' in item && item.price && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-burgundy-600 text-white hover:bg-burgundy-700">
                          ${(item.price / 100).toFixed(2)}
                        </Badge>
                      </div>
                    )}

                    {/* Edit/Delete buttons - only visible in edit mode */}
                    {isEditMode && (
                      <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEditItem(item, shelf._id)}
                          className="h-7 w-7 p-0 bg-white/90 hover:bg-white border-burgundy/30"
                        >
                          <Edit3 className="w-3 h-3 text-burgundy" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDeleteItem(item)}
                          className="h-7 w-7 p-0 bg-white/90 hover:bg-red-50 border-red-200"
                        >
                          <Trash2 className="w-3 h-3 text-red-600" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold line-clamp-2 text-burgundy-900">
                      {item.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {item.description && (
                      <CardDescription className="text-xs line-clamp-3 mb-3 text-burgundy-700">
                        {item.description}
                      </CardDescription>
                    )}

                    {shopType === 'product_shop' && (
                      <div className="space-y-1 text-xs text-burgundy-700">
                        {'quantityAvailable' in item && item.quantityAvailable !== undefined && (
                          <div>Stock: {item.quantityAvailable} available</div>
                        )}
                      </div>
                    )}

                    {shopType === 'service_shop' && (
                      <div className="space-y-1 text-xs text-burgundy-700">
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
          </div>
        ) : (
          <div className="text-center py-8 text-burgundy-600">
            <Package className="mx-auto h-12 w-12 text-burgundy-400 mb-2" />
            <p>No {shopType === 'product_shop' ? 'products' : 'services'} on this shelf yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 