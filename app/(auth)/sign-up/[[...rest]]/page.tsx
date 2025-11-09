"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { SignUp } from "@clerk/nextjs";

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

export default function SignUpPage() {
  const searchParams = useSearchParams();

  const redirectUrl = useMemo(
    () => sanitizeRedirect(searchParams?.get("redirect")),
    [searchParams]
  );

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8">
      <div className="flex flex-col gap-3 text-burgundy-900">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Create your account
        </h1>
        <p className="text-sm text-burgundy-700 md:text-base">
          Join ConnectCom to discover trusted vendors, manage your shop, and
          reach customers across Uganda.
        </p>
      </div>

      <SignUp
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "shadow-none border border-burgundy-100 rounded-2xl",
            formFieldInput:
              "border-burgundy-200 focus:border-burgundy-500 focus:ring-burgundy-200",
            formButtonPrimary:
              "bg-burgundy-700 hover:bg-burgundy-800 text-sm py-3 rounded-xl",
            socialButtonsBlockButton:
              "rounded-xl border-burgundy-200 text-burgundy-700 hover:border-burgundy-300",
            footerActionLink: "text-burgundy-700 hover:text-burgundy-900",
          },
        }}
        redirectUrl={redirectUrl}
        afterSignUpUrl={redirectUrl}
        signInUrl="/sign-in"
      />

      <p className="text-center text-sm text-burgundy-700">
        Already have an account?{" "}
        <Link
          href={`/sign-in?redirect=${encodeURIComponent(redirectUrl)}`}
          className="font-medium text-burgundy-800 hover:text-burgundy-900"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

