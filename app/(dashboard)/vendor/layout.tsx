"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";

export default function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Get the current user from Convex to check their role
  const convexUser = useQuery(api.users.getCurrentUser);

  useEffect(() => {
    // Wait until auth is loaded and Convex user data is available
    if (!isLoaded || convexUser === undefined) return;

    // If not signed in, redirect to login
    if (!isSignedIn) {
      router.push("/");
      return;
    }

    // Check if the user has the vendor role
    if (convexUser && convexUser.role === "vendor") {
      setIsAuthorized(true);
    } else {
      // Redirect to home or unauthorized page
      router.push("/");
    }

    setIsChecking(false);
  }, [isLoaded, isSignedIn, convexUser, router]);

  // Show loading while checking authorization
  if (isChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-beige">
        <Loader2 className="h-10 w-10 text-burgundy animate-spin" />
        <p className="mt-4 text-burgundy/80">Loading vendor dashboard...</p>
      </div>
    );
  }

  // Show dashboard content if user is authorized
  if (isAuthorized) {
    return <>{children}</>;
  }

  // This should not be shown as the user would be redirected
  return null;
} 