"use client";

import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { 
  Package, 
  Users, 
  DollarSign, 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Crown,
  Star,
  Zap,
  BarChart3,
  RefreshCw
} from 'lucide-react';

export default function AdminSubscriptionsPage() {
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [isCreatingPackage, setIsCreatingPackage] = useState(false);
  const { toast } = useToast();

  // Queries
  const subscriptionPackages = useQuery(api.subscriptions.getSubscriptionPackages);
  const subscriptionStats = useQuery(api.subscriptions.getSubscriptionStatistics);
  
  // Mutations
  const initializePackages = useMutation(api.subscriptions.initializeSubscriptionPackages);
  const createPackage = useMutation(api.subscriptions.createSubscriptionPackage);
  const updatePackage = useMutation(api.subscriptions.updateSubscriptionPackage);

  // Package form state
  const [packageForm, setPackageForm] = useState({
    packageName: '',
    displayName: '',
    description: '',
    price: 0,
    currency: 'USD',
    maxShops: 1,
    maxShelvesPerShop: 3,
    maxItemsPerShelf: 3,
    features: [] as string[],
    isActive: true,
  });

  const [newFeature, setNewFeature] = useState('');

  const handleInitializePackages = async () => {
    try {
      await initializePackages({});
      toast({
        title: "Success",
        description: "Subscription packages initialized successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize subscription packages",
        variant: "destructive",
      });
    }
  };

  const handleSavePackage = async () => {
    try {
      if (isCreatingPackage) {
        const result = await createPackage({
          packageName: packageForm.packageName,
          displayName: packageForm.displayName,
          description: packageForm.description,
          price: packageForm.price,
          currency: packageForm.currency,
          maxShops: packageForm.maxShops,
          maxShelvesPerShop: packageForm.maxShelvesPerShop,
          maxItemsPerShelf: packageForm.maxItemsPerShelf,
          features: packageForm.features,
          isActive: packageForm.isActive,
        });

        if (result.success) {
          toast({
            title: "Success",
            description: "Subscription package created successfully!",
          });
          resetForm();
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to create package",
            variant: "destructive",
          });
        }
      } else if (editingPackage) {
        const result = await updatePackage({
          packageId: editingPackage._id,
          displayName: packageForm.displayName,
          description: packageForm.description,
          price: packageForm.price,
          currency: packageForm.currency,
          maxShops: packageForm.maxShops,
          maxShelvesPerShop: packageForm.maxShelvesPerShop,
          maxItemsPerShelf: packageForm.maxItemsPerShelf,
          features: packageForm.features,
          isActive: packageForm.isActive,
        });

        if (result.success) {
          toast({
            title: "Success",
            description: "Subscription package updated successfully!",
          });
          resetForm();
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to update package",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !packageForm.features.includes(newFeature.trim())) {
      setPackageForm(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (feature: string) => {
    setPackageForm(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  const resetForm = () => {
    setPackageForm({
      packageName: '',
      displayName: '',
      description: '',
      price: 0,
      currency: 'USD',
      maxShops: 1,
      maxShelvesPerShop: 3,
      maxItemsPerShelf: 3,
      features: [],
      isActive: true,
    });
    setEditingPackage(null);
    setIsCreatingPackage(false);
  };

  const startEdit = (pkg: any) => {
    setPackageForm({
      packageName: pkg.packageName,
      displayName: pkg.displayName,
      description: pkg.description || '',
      price: pkg.price,
      currency: pkg.currency,
      maxShops: pkg.maxShops,
      maxShelvesPerShop: pkg.maxShelvesPerShop,
      maxItemsPerShelf: pkg.maxItemsPerShelf,
      features: pkg.features || [],
      isActive: pkg.isActive,
    });
    setEditingPackage(pkg);
    setIsCreatingPackage(false);
  };

  const getPackageIcon = (packageName: string) => {
    switch (packageName) {
      case 'free':
        return <Package className="w-5 h-5 text-green-600" />;
      case 'pro':
        return <Star className="w-5 h-5 text-blue-600" />;
      case 'unlimited':
        return <Crown className="w-5 h-5 text-purple-600" />;
      default:
        return <Zap className="w-5 h-5 text-burgundy" />;
    }
  };

  const getPackageColor = (packageName: string) => {
    switch (packageName) {
      case 'free':
        return 'border-green-200 bg-green-50';
      case 'pro':
        return 'border-blue-200 bg-blue-50';
      case 'unlimited':
        return 'border-purple-200 bg-purple-50';
      default:
        return 'border-burgundy/20 bg-burgundy/5';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-burgundy">Subscription Management</h1>
          <p className="text-burgundy/70 mt-2">
            Manage subscription packages, pricing, and user limits
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleInitializePackages}
            variant="outline"
            className="border-burgundy text-burgundy hover:bg-burgundy/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Initialize Packages
          </Button>
          
          <Button
            onClick={() => {
              resetForm();
              setIsCreatingPackage(true);
            }}
            className="bg-burgundy hover:bg-burgundy-dark"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Package
          </Button>
        </div>
      </div>

      <Tabs defaultValue="packages" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-fit">
          <TabsTrigger value="packages" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Packages
          </TabsTrigger>
          <TabsTrigger value="statistics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Statistics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Packages Tab */}
        <TabsContent value="packages" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            {/* Package List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-burgundy">Current Packages</h2>
                {subscriptionPackages && (
                  <Badge variant="outline" className="border-burgundy/30 text-burgundy">
                    {subscriptionPackages.length} packages
                  </Badge>
                )}
              </div>

              {subscriptionPackages === undefined ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader className="pb-4">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 rounded"></div>
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : subscriptionPackages.length === 0 ? (
                <Card className="text-center py-12 border-burgundy/20">
                  <CardContent>
                    <Package className="mx-auto h-16 w-16 text-burgundy/40 mb-4" />
                    <h3 className="text-lg font-semibold text-burgundy mb-2">
                      No Subscription Packages
                    </h3>
                    <p className="text-burgundy/70 mb-4">
                      Initialize the default packages or create custom ones.
                    </p>
                    <Button
                      onClick={handleInitializePackages}
                      className="bg-burgundy hover:bg-burgundy-dark"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Initialize Default Packages
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {subscriptionPackages.map((pkg) => (
                    <Card key={pkg._id} className={`border-2 ${getPackageColor(pkg.packageName)}`}>
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getPackageIcon(pkg.packageName)}
                            <div>
                              <CardTitle className="text-lg text-burgundy flex items-center gap-2">
                                {pkg.displayName}
                                {!pkg.isActive && (
                                  <Badge variant="secondary" className="text-xs">
                                    Inactive
                                  </Badge>
                                )}
                              </CardTitle>
                              <CardDescription className="text-sm">
                                {pkg.description}
                              </CardDescription>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEdit(pkg)}
                              className="border-burgundy/30 text-burgundy hover:bg-burgundy/10"
                            >
                              <Edit3 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Pricing */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-burgundy/80">Price:</span>
                          <span className="text-lg font-bold text-burgundy">
                            {pkg.price === 0 ? 'Free' : `$${(pkg.price / 100).toFixed(2)}`}
                            {pkg.price > 0 && <span className="text-sm font-normal">/month</span>}
                          </span>
                        </div>

                        <Separator className="bg-burgundy/20" />

                        {/* Limits */}
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-burgundy">{pkg.maxShops}</div>
                            <div className="text-xs text-burgundy/70">Shop{pkg.maxShops !== 1 ? 's' : ''}</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-burgundy">{pkg.maxShelvesPerShop}</div>
                            <div className="text-xs text-burgundy/70">Shelves/Shop</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-burgundy">{pkg.maxItemsPerShelf}</div>
                            <div className="text-xs text-burgundy/70">Items/Shelf</div>
                          </div>
                        </div>

                        {/* Features */}
                        {pkg.features && pkg.features.length > 0 && (
                          <>
                            <Separator className="bg-burgundy/20" />
                            <div>
                              <div className="text-sm font-medium text-burgundy/80 mb-2">Features:</div>
                              <div className="flex flex-wrap gap-1">
                                {pkg.features.slice(0, 3).map((feature) => (
                                  <Badge key={feature} variant="outline" className="text-xs border-burgundy/30 text-burgundy">
                                    {feature}
                                  </Badge>
                                ))}
                                {pkg.features.length > 3 && (
                                  <Badge variant="outline" className="text-xs border-burgundy/30 text-burgundy">
                                    +{pkg.features.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Package Form */}
            {(isCreatingPackage || editingPackage) && (
              <Card className="border-burgundy/20 h-fit">
                <CardHeader>
                  <CardTitle className="text-burgundy flex items-center gap-2">
                    {isCreatingPackage ? (
                      <>
                        <Plus className="w-5 h-5" />
                        Create New Package
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-5 h-5" />
                        Edit Package
                      </>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {isCreatingPackage 
                      ? "Configure a new subscription package with custom limits and features."
                      : "Update the selected subscription package details."
                    }
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="packageName" className="text-burgundy">Package Name</Label>
                        <Input
                          id="packageName"
                          value={packageForm.packageName}
                          onChange={(e) => setPackageForm(prev => ({ ...prev, packageName: e.target.value }))}
                          placeholder="e.g., premium"
                          disabled={!isCreatingPackage}
                          className="border-burgundy/30 focus:border-burgundy"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="displayName" className="text-burgundy">Display Name</Label>
                        <Input
                          id="displayName"
                          value={packageForm.displayName}
                          onChange={(e) => setPackageForm(prev => ({ ...prev, displayName: e.target.value }))}
                          placeholder="e.g., Premium"
                          className="border-burgundy/30 focus:border-burgundy"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-burgundy">Description</Label>
                      <Textarea
                        id="description"
                        value={packageForm.description}
                        onChange={(e) => setPackageForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Package description..."
                        rows={3}
                        className="border-burgundy/30 focus:border-burgundy"
                      />
                    </div>
                  </div>

                  <Separator className="bg-burgundy/20" />

                  {/* Pricing */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-burgundy">Pricing</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price" className="text-burgundy">Price (cents)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={packageForm.price}
                          onChange={(e) => setPackageForm(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                          placeholder="0"
                          className="border-burgundy/30 focus:border-burgundy"
                        />
                        <div className="text-xs text-burgundy/70 mt-1">
                          Display: {packageForm.price === 0 ? 'Free' : `$${(packageForm.price / 100).toFixed(2)}/month`}
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="currency" className="text-burgundy">Currency</Label>
                        <Input
                          id="currency"
                          value={packageForm.currency}
                          onChange={(e) => setPackageForm(prev => ({ ...prev, currency: e.target.value }))}
                          placeholder="USD"
                          className="border-burgundy/30 focus:border-burgundy"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-burgundy/20" />

                  {/* Limits */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-burgundy">Limits</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="maxShops" className="text-burgundy">Max Shops</Label>
                        <Input
                          id="maxShops"
                          type="number"
                          value={packageForm.maxShops}
                          onChange={(e) => setPackageForm(prev => ({ ...prev, maxShops: parseInt(e.target.value) || 1 }))}
                          min="1"
                          className="border-burgundy/30 focus:border-burgundy"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="maxShelvesPerShop" className="text-burgundy">Shelves/Shop</Label>
                        <Input
                          id="maxShelvesPerShop"
                          type="number"
                          value={packageForm.maxShelvesPerShop}
                          onChange={(e) => setPackageForm(prev => ({ ...prev, maxShelvesPerShop: parseInt(e.target.value) || 1 }))}
                          min="1"
                          className="border-burgundy/30 focus:border-burgundy"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="maxItemsPerShelf" className="text-burgundy">Items/Shelf</Label>
                        <Input
                          id="maxItemsPerShelf"
                          type="number"
                          value={packageForm.maxItemsPerShelf}
                          onChange={(e) => setPackageForm(prev => ({ ...prev, maxItemsPerShelf: parseInt(e.target.value) || 1 }))}
                          min="1"
                          className="border-burgundy/30 focus:border-burgundy"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-burgundy/20" />

                  {/* Features */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-burgundy">Features</h4>
                    
                    <div className="flex gap-2">
                      <Input
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="Add a feature..."
                        className="border-burgundy/30 focus:border-burgundy"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                      />
                      <Button
                        type="button"
                        onClick={handleAddFeature}
                        size="sm"
                        className="bg-burgundy hover:bg-burgundy-dark"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {packageForm.features.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {packageForm.features.map((feature, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="border-burgundy/30 text-burgundy cursor-pointer hover:bg-burgundy/10"
                            onClick={() => handleRemoveFeature(feature)}
                          >
                            {feature}
                            <XCircle className="w-3 h-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={resetForm}
                      variant="outline"
                      className="flex-1 border-burgundy/30 text-burgundy hover:bg-burgundy/10"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSavePackage}
                      className="flex-1 bg-burgundy hover:bg-burgundy-dark"
                      disabled={!packageForm.packageName || !packageForm.displayName}
                    >
                      {isCreatingPackage ? 'Create Package' : 'Update Package'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
            <Card className="border-burgundy/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-burgundy/80">Total Users</CardTitle>
                  <Users className="w-4 h-4 text-burgundy/60" />
                </div>
              </CardHeader>
                             <CardContent>
                 <div className="text-2xl font-bold text-burgundy">
                   {subscriptionStats?.totalUsers ?? '--'}
                 </div>
                 <p className="text-xs text-burgundy/60">All registered users</p>
               </CardContent>
             </Card>
 
             <Card className="border-burgundy/20">
               <CardHeader className="pb-3">
                 <div className="flex items-center justify-between">
                   <CardTitle className="text-sm font-medium text-burgundy/80">Free Users</CardTitle>
                   <Package className="w-4 h-4 text-green-600" />
                 </div>
               </CardHeader>
               <CardContent>
                 <div className="text-2xl font-bold text-burgundy">
                   {subscriptionStats?.freeUsers ?? '--'}
                 </div>
                 <p className="text-xs text-burgundy/60">On free plan</p>
               </CardContent>
             </Card>
 
             <Card className="border-burgundy/20">
               <CardHeader className="pb-3">
                 <div className="flex items-center justify-between">
                   <CardTitle className="text-sm font-medium text-burgundy/80">Pro Users</CardTitle>
                   <Star className="w-4 h-4 text-blue-600" />
                 </div>
               </CardHeader>
               <CardContent>
                 <div className="text-2xl font-bold text-burgundy">
                   {subscriptionStats?.proUsers ?? '--'}
                 </div>
                 <p className="text-xs text-burgundy/60">On pro plan</p>
               </CardContent>
             </Card>
 
             <Card className="border-burgundy/20">
               <CardHeader className="pb-3">
                 <div className="flex items-center justify-between">
                   <CardTitle className="text-sm font-medium text-burgundy/80">Premium Users</CardTitle>
                   <Crown className="w-4 h-4 text-purple-600" />
                 </div>
               </CardHeader>
               <CardContent>
                 <div className="text-2xl font-bold text-burgundy">
                   {subscriptionStats?.unlimitedUsers ?? '--'}
                 </div>
                                  <p className="text-xs text-burgundy/60">On unlimited plan</p>
               </CardContent>
             </Card>

             <Card className="border-burgundy/20">
               <CardHeader className="pb-3">
                 <div className="flex items-center justify-between">
                   <CardTitle className="text-sm font-medium text-burgundy/80">Monthly Revenue</CardTitle>
                   <DollarSign className="w-4 h-4 text-emerald-600" />
                 </div>
               </CardHeader>
               <CardContent>
                 <div className="text-2xl font-bold text-burgundy">
                   {subscriptionStats ? `$${(subscriptionStats.totalRevenue / 100).toFixed(2)}` : '--'}
                 </div>
                 <p className="text-xs text-burgundy/60">Total monthly revenue</p>
               </CardContent>
             </Card>
           </div>

           {/* Package Distribution */}
           {subscriptionStats && subscriptionStats.packageDistribution.length > 0 && (
             <Card className="border-burgundy/20">
               <CardHeader>
                 <CardTitle className="text-burgundy">Package Distribution</CardTitle>
                 <CardDescription>
                   Current distribution of users across subscription packages
                 </CardDescription>
               </CardHeader>
               <CardContent>
                 <div className="space-y-4">
                   {subscriptionStats.packageDistribution.map((pkg) => (
                     <div key={pkg.packageName} className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                         {getPackageIcon(pkg.packageName)}
                         <div>
                           <div className="font-medium text-burgundy capitalize">{pkg.packageName}</div>
                           <div className="text-sm text-burgundy/70">{pkg.count} users</div>
                         </div>
                       </div>
                       <div className="flex items-center gap-3">
                         <div className="w-32 bg-gray-200 rounded-full h-2">
                           <div 
                             className="bg-burgundy h-2 rounded-full transition-all duration-300"
                             style={{ width: `${pkg.percentage}%` }}
                           ></div>
                         </div>
                         <div className="text-sm font-medium text-burgundy w-12 text-right">
                           {pkg.percentage}%
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               </CardContent>
             </Card>
           )}

          <Card className="border-burgundy/20">
            <CardHeader>
              <CardTitle className="text-burgundy">Subscription Analytics</CardTitle>
              <CardDescription>
                Detailed analytics and user subscription trends will be available here.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
              <BarChart3 className="mx-auto h-16 w-16 text-burgundy/40 mb-4" />
              <h3 className="text-lg font-semibold text-burgundy mb-2">
                Analytics Coming Soon
              </h3>
              <p className="text-burgundy/70">
                Advanced subscription analytics and reporting features will be implemented here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="border-burgundy/20">
            <CardHeader>
              <CardTitle className="text-burgundy">Subscription Settings</CardTitle>
              <CardDescription>
                Configure global subscription settings and policies.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
              <Settings className="mx-auto h-16 w-16 text-burgundy/40 mb-4" />
              <h3 className="text-lg font-semibold text-burgundy mb-2">
                Settings Panel Coming Soon
              </h3>
              <p className="text-burgundy/70">
                Global subscription settings, payment configurations, and policy management will be available here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
