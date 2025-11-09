"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Get the current user from Convex to check their role
  const convexUser = useQuery(api.users.getCurrentUser);

  const signInUrl = useMemo(() => {
    const redirect = !pathname || pathname === "/" ? "/customer" : pathname;
    return `/sign-in?redirect=${encodeURIComponent(redirect)}`;
  }, [pathname]);

  useEffect(() => {
    // Wait until auth is loaded and Convex user data is available
    if (!isLoaded || convexUser === undefined) return;

    // If not signed in, redirect to login
    if (!isSignedIn) {
      router.replace(signInUrl);
      return;
    }

    // Check if the user has the customer role
    if (convexUser && convexUser.role === "customer") {
      setIsAuthorized(true);
      setIsChecking(false);
      return;
    }

    // Redirect to home or unauthorized page
    router.replace("/");
  }, [isLoaded, isSignedIn, convexUser, router, signInUrl]);

  // Show loading while checking authorization
  if (isChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-beige">
        <Loader2 className="h-10 w-10 text-burgundy animate-spin" />
        <p className="mt-4 text-burgundy/80">Loading customer dashboard...</p>
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


