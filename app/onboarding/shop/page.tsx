"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UploadDropzone } from "@/utils/uploadthing";

// Define interface for shop data structure
interface ShopData {
  shopName: string;
  shopImageUrl: string; // Added shopImageUrl
  shopType: string;
  description: string;
  categories: string[];
  contactInfo: {
    email: string;
    phone: string;
    website: string;
  };
  physicalLocation: string;
  operatingHours: string;
}

export default function ShopOnboardingPage() {
  const router = useRouter();
  const { userId: clerkUserId, isSignedIn } = useAuth();
  const { user } = useUser();
  const createShop = useMutation(api.shops.createShop);
  const updateUserRole = useMutation(api.users.updateUserRole);
  const createOrGetUser = useMutation(api.users.createOrGetUser);
  
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Shop details state with proper typing
  const [shopData, setShopData] = useState<ShopData>({
    shopName: "",
    shopImageUrl: "", // Added shopImageUrl to initial state
    shopType: "product_shop", // Default to product shop
    description: "",
    categories: [],
    contactInfo: {
      email: "",
      phone: "",
      website: "",
    },
    physicalLocation: "",
    operatingHours: "",
  });

  // Handle input changes with proper typing
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes(".")) {
      // Handle nested objects like contactInfo.email
      const [parent, child] = name.split(".");
      setShopData({
        ...shopData,
        [parent]: {
          ...(shopData[parent as keyof ShopData] as Record<string, string>),
          [child]: value
        }
      });
    } else {
      // Handle regular fields
      setShopData({
        ...shopData,
        [name]: value
      });
    }
  };

  // Handle radio button changes with proper typing
  const handleShopTypeChange = (value: string) => {
    setShopData({
      ...shopData,
      shopType: value
    });
  };

  // Handle category selection with proper typing
  const handleCategoryChange = (value: string) => {
    // For simplicity, just storing a single category right now
    // Could be extended to handle multiple categories
    setShopData({
      ...shopData,
      categories: [value]
    });
  };

  // Handle form submission with proper typing
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      if (!isSignedIn) {
        throw new Error("You must be signed in to create a shop");
      }
      
      // First, ensure we have the user in our database by creating or getting the user
      const convexUserId = await createOrGetUser();
      
      // Create the shop in the database
      await createShop({
        ownerId: clerkUserId as string, // This should be the Clerk User ID
        shopName: shopData.shopName,
        shopImageUrl: shopData.shopImageUrl, // Pass shopImageUrl
        shopType: shopData.shopType,
        description: shopData.description,
        categories: shopData.categories,
        contactInfo: shopData.contactInfo,
        physicalLocation: shopData.physicalLocation,
        operatingHours: shopData.operatingHours,
        status: "pending_approval", // Initial status
      });
      
      // Update the user's role to vendor using our new function and the Convex user ID
      await updateUserRole({
        userId: convexUserId,
        newRole: "vendor"
      });

      // Send email notification to admin about new shop registration
      try {
        const emailResponse = await fetch('/api/send-email/shop-registration', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            shopName: shopData.shopName,
            shopType: shopData.shopType,
            ownerEmail: user?.emailAddresses?.[0]?.emailAddress || '',
            ownerName: user?.fullName || user?.firstName || 'Shop Owner',
            categories: shopData.categories,
            description: shopData.description,
            contactInfo: shopData.contactInfo,
          }),
        });

        if (!emailResponse.ok) {
          console.error('Failed to send registration email to admin');
        }
      } catch (emailError) {
        console.error('Error sending registration email:', emailError);
        // Don't block the registration process if email fails
      }
      
      // Redirect to success page or dashboard
      router.push("/onboarding/success");
    } catch (err: unknown) {
      console.error("Error creating shop:", err);
      setError(err instanceof Error ? err.message : "An error occurred while creating your shop");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render different steps of the onboarding process - now with 4 steps
  const renderStep = () => {
    switch(step) {
      case 1: // Basic Info
        return (
          <div className="space-y-6">
            <div className="mb-8 text-center">
              <h3 className="text-xl font-semibold text-burgundy-900 mb-3">Step 1: Basic Information</h3>
              <p className="text-burgundy-700">Let's start with the essential details about your shop.</p>
            </div>
            
            <div>
              <Label htmlFor="shopName" className="text-burgundy-900 font-medium">Shop Name *</Label>
              <Input 
                id="shopName" 
                name="shopName" 
                value={shopData.shopName} 
                onChange={handleInputChange} 
                placeholder="Enter your shop name"
                className="mt-2 bg-white border-burgundy-200 focus:border-burgundy-500 focus:ring-burgundy-500"
                required
              />
            </div>

            {/* Shop Image Upload Dropzone */}
            <div>
              <Label className="text-burgundy-900 font-medium">Upload Shop Image</Label>
              <UploadDropzone
                endpoint="shopImageUploader"
                onClientUploadComplete={(res) => {
                  if (res && res[0]?.serverData?.imageUrl) {
                    setShopData((prev) => ({ ...prev, shopImageUrl: res[0].serverData.imageUrl }));
                  }
                }}
                onUploadError={(error) => {
                  setError(error.message || "Image upload failed");
                }}
                appearance={{
                  button: "bg-burgundy-900 text-white hover:bg-burgundy-700 border-burgundy-600",
                  allowedContent: "text-burgundy-700",
                  label: "text-burgundy-900",
                }}
              />
              {shopData.shopImageUrl && (
                <div className="mt-3">
                  <Label className="text-burgundy-700 text-sm">Preview:</Label>
                  <img
                    src={shopData.shopImageUrl}
                    alt="Shop Preview"
                    className="mt-2 rounded-lg border-2 border-burgundy-200 max-h-40 mx-auto"
                  />
                </div>
              )}
            </div>
            
            <div>
              <Label className="text-burgundy-900 font-medium">Shop Type *</Label>
              <RadioGroup 
                defaultValue={shopData.shopType} 
                onValueChange={handleShopTypeChange}
                className="flex flex-col space-y-3 mt-2"
              >
                <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-burgundy-200 bg-white hover:bg-burgundy-50 hover:border-burgundy-300 transition-colors">
                  <RadioGroupItem value="product_shop" id="product_shop" className="text-burgundy-600" />
                  <Label htmlFor="product_shop" className="font-medium cursor-pointer">
                    <span className="block text-burgundy-900">Product Shop</span>
                    <span className="block text-sm text-burgundy-700 mt-1">Sell physical items that you ship to customers</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-burgundy-200 bg-white hover:bg-burgundy-50 hover:border-burgundy-300 transition-colors">
                  <RadioGroupItem value="service_shop" id="service_shop" className="text-burgundy-600" />
                  <Label htmlFor="service_shop" className="font-medium cursor-pointer">
                    <span className="block text-burgundy-900">Service Shop</span>
                    <span className="block text-sm text-burgundy-700 mt-1">Offer services, appointments, or bookable time slots</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex justify-center mt-10 pt-6 border-t border-burgundy-200">
              <Button 
                onClick={() => setStep(2)} 
                className="bg-burgundy-600 hover:bg-burgundy-700 text-white px-8 py-3 text-lg font-semibold shadow-lg transition-all duration-200 hover:scale-105"
                size="lg"
              >
                Next: Shop Description →
              </Button>
            </div>
          </div>
        );
        
      case 2: // Description & Category
        return (
          <div className="space-y-6">
            <div className="mb-8 text-center">
              <h3 className="text-xl font-semibold text-burgundy-900 mb-3">Step 2: Description & Category</h3>
              <p className="text-burgundy-700">Tell customers about your shop and what you offer.</p>
            </div>
            
            <div>
              <Label htmlFor="description" className="text-burgundy-900 font-medium">Shop Description *</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={shopData.description} 
                onChange={handleInputChange} 
                placeholder="Tell us about your shop and what you offer"
                className="mt-2 bg-white min-h-[120px] border-burgundy-200 focus:border-burgundy-500 focus:ring-burgundy-500"
                rows={4}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="category" className="text-burgundy-900 font-medium">Primary Category *</Label>
              <Select onValueChange={handleCategoryChange}>
                <SelectTrigger className="mt-2 bg-white border-burgundy-200 focus:border-burgundy-500 focus:ring-burgundy-500">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fashion">Fashion & Clothing</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="homegoods">Home & Furniture</SelectItem>
                  <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
                  <SelectItem value="food">Food & Grocery</SelectItem>
                  <SelectItem value="health">Health & Wellness</SelectItem>
                  <SelectItem value="services">Professional Services</SelectItem>
                  <SelectItem value="crafts">Arts & Crafts</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-burgundy-600 mt-2">Choose the category that best describes your shop.</p>
            </div>
            
            <div className="flex justify-between mt-10 pt-6 border-t border-burgundy-200">
              <Button 
                variant="outline" 
                onClick={() => setStep(1)}
                className="border-2 border-burgundy-600 text-burgundy-700 hover:bg-burgundy-50 px-6 py-2 text-base font-medium"
                size="lg"
              >
                ← Back
              </Button>
              <Button 
                onClick={() => setStep(3)} 
                className="bg-burgundy-600 hover:bg-burgundy-700 text-white px-6 py-2 text-base font-medium shadow-md"
                size="lg"
              >
                Next: Contact Information →
              </Button>
            </div>
          </div>
        );
        
      case 3: // Contact Info
        return (
          <div className="space-y-6">
            <div className="mb-8 text-center">
              <h3 className="text-xl font-semibold text-burgundy-900 mb-3">Step 3: Contact Information</h3>
              <p className="text-burgundy-700">Add ways for customers to get in touch with you.</p>
            </div>
            
            <div>
              <Label htmlFor="contactEmail" className="text-burgundy-900 font-medium">Contact Email *</Label>
              <Input 
                id="contactEmail" 
                name="contactInfo.email" 
                value={shopData.contactInfo.email} 
                onChange={handleInputChange} 
                placeholder="email@example.com"
                className="mt-2 bg-white border-burgundy-200 focus:border-burgundy-500 focus:ring-burgundy-500"
                type="email"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="contactPhone" className="text-burgundy-900 font-medium">Contact Phone</Label>
              <Input 
                id="contactPhone" 
                name="contactInfo.phone" 
                value={shopData.contactInfo.phone} 
                onChange={handleInputChange} 
                placeholder="+1234567890"
                className="mt-2 bg-white border-burgundy-200 focus:border-burgundy-500 focus:ring-burgundy-500"
              />
            </div>
            
            <div>
              <Label htmlFor="website" className="text-burgundy-900 font-medium">Website (if any)</Label>
              <Input 
                id="website" 
                name="contactInfo.website" 
                value={shopData.contactInfo.website} 
                onChange={handleInputChange} 
                placeholder="https://yourwebsite.com"
                className="mt-2 bg-white border-burgundy-200 focus:border-burgundy-500 focus:ring-burgundy-500"
              />
            </div>
            
            <div className="flex justify-between mt-10 pt-6 border-t border-burgundy-200">
              <Button 
                variant="outline" 
                onClick={() => setStep(2)}
                className="border-2 border-burgundy-600 text-burgundy-700 hover:bg-burgundy-50 px-6 py-2 text-base font-medium"
                size="lg"
              >
                ← Back
              </Button>
              <Button 
                onClick={() => setStep(4)} 
                className="bg-burgundy-600 hover:bg-burgundy-700 text-white px-6 py-2 text-base font-medium shadow-md"
                size="lg"
              >
                Next: Final Details →
              </Button>
            </div>
          </div>
        );
        
      case 4: // Location & Hours
        return (
          <div className="space-y-6">
            <div className="mb-8 text-center">
              <h3 className="text-xl font-semibold text-burgundy-900 mb-3">Step 4: Location & Hours</h3>
              <p className="text-burgundy-700">Add your location and business hours (if applicable).</p>
            </div>
            
            <div>
              <Label htmlFor="physicalLocation" className="text-burgundy-900 font-medium">Physical Location (if applicable)</Label>
              <Input 
                id="physicalLocation" 
                name="physicalLocation" 
                value={shopData.physicalLocation} 
                onChange={handleInputChange} 
                placeholder="123 Main St, City, Country"
                className="mt-2 bg-white border-burgundy-200 focus:border-burgundy-500 focus:ring-burgundy-500"
              />
              <p className="text-xs text-burgundy-600 mt-2">Leave blank if you don't have a physical location.</p>
            </div>
            
            <div>
              <Label htmlFor="operatingHours" className="text-burgundy-900 font-medium">Operating Hours</Label>
              <Input 
                id="operatingHours" 
                name="operatingHours" 
                value={shopData.operatingHours} 
                onChange={handleInputChange} 
                placeholder="Mon-Fri: 9AM-5PM, Sat: 10AM-3PM"
                className="mt-2 bg-white border-burgundy-200 focus:border-burgundy-500 focus:ring-burgundy-500"
              />
              <p className="text-xs text-burgundy-600 mt-2">When are you available to serve customers?</p>
            </div>
            
            <div className="flex justify-between mt-10 pt-6 border-t border-burgundy-200">
              <Button 
                variant="outline" 
                onClick={() => setStep(3)}
                className="border-2 border-burgundy-600 text-burgundy-700 hover:bg-burgundy-50 px-6 py-2 text-base font-medium"
                size="lg"
              >
                ← Back
              </Button>
              <Button 
                type="submit" 
                className="bg-burgundy-600 hover:bg-burgundy-700 text-white px-6 py-2 text-base font-medium shadow-md"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create My Shop"}
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Progress steps indicator
  const renderProgressSteps = () => {
    return (
      <div className="flex items-center justify-center mb-10">
        {[1, 2, 3, 4].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300
                ${step === stepNumber 
                  ? 'bg-burgundy-600 text-white shadow-lg scale-110' 
                  : step > stepNumber 
                    ? 'bg-burgundy-200 text-burgundy-700' 
                    : 'bg-gray-200 text-gray-500'}`}
            >
              {stepNumber}
            </div>
            {stepNumber < 4 && (
              <div 
                className={`w-12 h-1 transition-all duration-300 ${step > stepNumber ? 'bg-burgundy-400' : 'bg-gray-200'}`}
              ></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-beige-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg bg-white/95 backdrop-blur-sm border-burgundy-200">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl text-burgundy-900 font-bold">Register Your Shop</CardTitle>
            <CardDescription className="text-lg text-burgundy-700 mt-2">
              Join ConnectCom and start selling your products or services online.
            </CardDescription>
          </CardHeader>
          
          <Separator />
          
          <CardContent className="pt-6">
            {renderProgressSteps()}
            
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
              {renderStep()}
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center text-sm text-burgundy-600 border-t border-burgundy-100 pt-6">
            <p>
              By creating a shop, you agree to our <span className="text-burgundy-800 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-burgundy-800 hover:underline cursor-pointer">Privacy Policy</span>.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 