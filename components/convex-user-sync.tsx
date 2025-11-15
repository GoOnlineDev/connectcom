"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

/**
 * Ensures every authenticated Clerk user has a corresponding Convex user document.
 */
export default function ConvexUserSync() {
  const { isLoaded, isSignedIn } = useAuth();
  const createOrGetUser = useMutation(api.users.createOrGetUser);
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn) {
      hasSyncedRef.current = false;
      return;
    }

    if (hasSyncedRef.current) {
      return;
    }

    hasSyncedRef.current = true;

    createOrGetUser().catch((error) => {
      console.error("Failed to sync Convex user", error);
      hasSyncedRef.current = false;
    });
  }, [isLoaded, isSignedIn, createOrGetUser]);

  return null;
}

