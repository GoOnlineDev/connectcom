"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { User, Save } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const currentUser = useQuery(api.users.getCurrentUser);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const updateProfile = useMutation(api.settings.updateUserProfile);

  // Initialize form when user data loads
  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.firstName || "");
      setLastName(currentUser.lastName || "");
      setPhoneNumber(currentUser.phoneNumber || "");
      setLocation(currentUser.location || "");
    }
  }, [currentUser]);

  const handleSave = async () => {
    if (!currentUser) return;
    
    setIsSaving(true);
    try {
      await updateProfile({
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        phoneNumber: phoneNumber.trim() || undefined,
        location: location.trim() || undefined,
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (currentUser === undefined) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-burgundy">Profile Settings</h1>
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-burgundy">Profile Settings</h1>
        </div>
        <Card className="bg-white border-burgundy/10">
          <CardContent className="p-6 text-center">
            <p className="text-burgundy">User not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-burgundy">Profile Settings</h1>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="text-burgundy border-burgundy hover:bg-burgundy/10"
        >
          Back
        </Button>
      </div>

      <Card className="bg-white border-burgundy/10">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-burgundy" />
            <CardTitle className="text-lg text-burgundy">Personal Information</CardTitle>
          </div>
          <CardDescription className="text-burgundy/70">
            Update your personal details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="email" className="text-burgundy">
                Email Address
              </Label>
              <Input
                id="email"
                value={currentUser.email}
                disabled
                className="bg-beige/50 text-burgundy/60"
              />
              <p className="text-xs text-burgundy/60 mt-1">
                Email cannot be changed
              </p>
            </div>

            <div>
              <Label htmlFor="role" className="text-burgundy">
                Role
              </Label>
              <Input
                id="role"
                value={currentUser.role}
                disabled
                className="bg-beige/50 text-burgundy/60 capitalize"
              />
              <p className="text-xs text-burgundy/60 mt-1">
                Role is assigned by administrators
              </p>
            </div>

            <div>
              <Label htmlFor="firstName" className="text-burgundy">
                First Name
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                className="border-burgundy/20 focus:border-burgundy"
              />
            </div>

            <div>
              <Label htmlFor="lastName" className="text-burgundy">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                className="border-burgundy/20 focus:border-burgundy"
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber" className="text-burgundy">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+256 783 618441"
                className="border-burgundy/20 focus:border-burgundy"
              />
            </div>

            <div>
              <Label htmlFor="location" className="text-burgundy">
                Location
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your location"
                className="border-burgundy/20 focus:border-burgundy"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-burgundy/20">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="text-burgundy border-burgundy hover:bg-burgundy/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-burgundy text-white hover:bg-burgundy-dark"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
