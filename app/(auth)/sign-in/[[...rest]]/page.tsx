"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import CustomSignIn from "@/components/auth/CustomSignIn";

const sanitizeRedirect = (redirect?: string | null) => {
  if (!redirect) return "/";
  try {
    const url = new URL(redirect, "http://localhost");
    if (url.origin === "http://localhost") {
      return url.pathname + url.search + url.hash;
    }
  } catch (_error) {
    // Ignore invalid URLs
  }
  return "/";
};

export default function SignInPage() {
  return <CustomSignIn />;
}

