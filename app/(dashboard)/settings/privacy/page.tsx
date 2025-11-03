"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
// Using a custom toggle with button
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Shield, Save } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PrivacySettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const settings = useQuery(api.settings.getUserSettings);
  const [profileVisibility, setProfileVisibility] = useState("public");
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [theme, setTheme] = useState("light");
  const [isSaving, setIsSaving] = useState(false);
  
  const updateSettings = useMutation(api.settings.updateUserSettings);

  useEffect(() => {
    if (settings) {
      setProfileVisibility(settings.profileVisibility || "public");
      setShowEmail(settings.showEmail ?? false);
      setShowPhone(settings.showPhone ?? false);
      setTheme(settings.theme || "light");
    }
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings({
        profileVisibility,
        showEmail,
        showPhone,
        theme,
      });
      
      toast({
        title: "Privacy settings updated",
        description: "Your privacy preferences have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update settings.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (settings === undefined) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-burgundy">Privacy Settings</h1>
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-burgundy">Privacy Settings</h1>
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
            <Shield className="h-5 w-5 text-burgundy" />
            <CardTitle className="text-lg text-burgundy">Privacy & Preferences</CardTitle>
          </div>
          <CardDescription className="text-burgundy/70">
            Control who can see your information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="profile-visibility" className="text-burgundy-900 font-medium">
              Profile Visibility
            </Label>
            <Select value={profileVisibility} onValueChange={setProfileVisibility}>
              <SelectTrigger id="profile-visibility" className="border-burgundy-300 focus:border-burgundy-500 focus:ring-burgundy-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="friends">Friends Only</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-burgundy/60">
              Control who can view your profile
            </p>
          </div>

          <div className="flex items-center justify-between py-4 border-t border-burgundy/20">
            <div className="flex-1">
              <Label htmlFor="show-email" className="text-burgundy-900 font-medium">
                Show Email Address
              </Label>
              <p className="text-sm text-burgundy/60 mt-1">
                Allow others to see your email address
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowEmail(!showEmail)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                showEmail ? "bg-burgundy-600" : "bg-burgundy-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showEmail ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-4 border-t border-burgundy/20">
            <div className="flex-1">
              <Label htmlFor="show-phone" className="text-burgundy-900 font-medium">
                Show Phone Number
              </Label>
              <p className="text-sm text-burgundy/60 mt-1">
                Allow others to see your phone number
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowPhone(!showPhone)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                showPhone ? "bg-burgundy-600" : "bg-burgundy-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showPhone ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="space-y-2 pt-4 border-t border-burgundy/20">
            <Label htmlFor="theme" className="text-burgundy-900 font-medium">
              Theme
            </Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger id="theme" className="border-burgundy-300 focus:border-burgundy-500 focus:ring-burgundy-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-burgundy/60">
              Choose your preferred theme
            </p>
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
              className="bg-burgundy-600 text-white hover:bg-burgundy-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
