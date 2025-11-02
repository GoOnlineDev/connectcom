"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Settings, User, Bell, Shield } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const currentUser = useQuery(api.users.getCurrentUser);
  const settings = useQuery(api.settings.getUserSettings);

  if (currentUser === undefined || settings === undefined) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-burgundy mb-6">Settings</h1>
        <div className="space-y-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-burgundy mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/settings/profile">
          <Card className="bg-white border-burgundy/10 hover:border-burgundy/30 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-burgundy" />
                <CardTitle className="text-lg text-burgundy">Profile</CardTitle>
              </div>
              <CardDescription className="text-burgundy/70">
                Manage your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-burgundy/60">
                Update your name, email, phone, and location
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/settings/notifications">
          <Card className="bg-white border-burgundy/10 hover:border-burgundy/30 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-burgundy" />
                <CardTitle className="text-lg text-burgundy">Notifications</CardTitle>
              </div>
              <CardDescription className="text-burgundy/70">
                Control your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-burgundy/60">
                Email, push, and marketing notifications
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/settings/privacy">
          <Card className="bg-white border-burgundy/10 hover:border-burgundy/30 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-burgundy" />
                <CardTitle className="text-lg text-burgundy">Privacy</CardTitle>
              </div>
              <CardDescription className="text-burgundy/70">
                Manage your privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-burgundy/60">
                Control what information is visible
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
