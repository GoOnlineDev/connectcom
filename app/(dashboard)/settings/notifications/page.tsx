"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
// Using a custom checkbox with button
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Bell, Save } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotificationSettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const settings = useQuery(api.settings.getUserSettings);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const updateSettings = useMutation(api.settings.updateUserSettings);

  useEffect(() => {
    if (settings) {
      setEmailNotifications(settings.emailNotifications ?? true);
      setPushNotifications(settings.pushNotifications ?? true);
      setMarketingEmails(settings.marketingEmails ?? false);
    }
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings({
        emailNotifications,
        pushNotifications,
        marketingEmails,
      });
      
      toast({
        title: "Notifications updated",
        description: "Your notification preferences have been saved.",
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
          <h1 className="text-2xl font-bold text-burgundy">Notification Settings</h1>
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-burgundy">Notification Settings</h1>
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
            <Bell className="h-5 w-5 text-burgundy" />
            <CardTitle className="text-lg text-burgundy">Notification Preferences</CardTitle>
          </div>
          <CardDescription className="text-burgundy/70">
            Control how and when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between py-4 border-b border-burgundy/20">
            <div className="flex-1">
              <Label htmlFor="email-notifications" className="text-burgundy font-medium">
                Email Notifications
              </Label>
              <p className="text-sm text-burgundy/60 mt-1">
                Receive notifications via email
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                emailNotifications ? "bg-burgundy" : "bg-burgundy/30"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  emailNotifications ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-burgundy/20">
            <div className="flex-1">
              <Label htmlFor="push-notifications" className="text-burgundy font-medium">
                Push Notifications
              </Label>
              <p className="text-sm text-burgundy/60 mt-1">
                Receive push notifications in your browser
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPushNotifications(!pushNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                pushNotifications ? "bg-burgundy" : "bg-burgundy/30"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  pushNotifications ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="flex-1">
              <Label htmlFor="marketing-emails" className="text-burgundy font-medium">
                Marketing Emails
              </Label>
              <p className="text-sm text-burgundy/60 mt-1">
                Receive promotional emails and updates
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMarketingEmails(!marketingEmails)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                marketingEmails ? "bg-burgundy" : "bg-burgundy/30"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  marketingEmails ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
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
