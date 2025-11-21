"use client";

import * as React from "react";
import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const sanitizeRedirect = (redirect?: string | null) => {
  if (!redirect) return "/";
  try {
    const url = new URL(redirect, "http://localhost");
    if (url.origin === "http://localhost") {
      return url.pathname + url.search + url.hash;
    }
  } catch (_e) {}
  return "/";
};

export default function CustomSignUp() {
  const searchParams = useSearchParams();
  const redirectUrl = React.useMemo(
    () => sanitizeRedirect(searchParams?.get("redirect")),
    [searchParams]
  );

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3 text-burgundy-900 mb-4">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-burgundy-700">
          Join ConnectCom to discover trusted vendors and reach customers.
        </p>
      </div>

      <SignUp.Root routing="path" afterSignUpUrl={redirectUrl} signInUrl="/sign-in">
        <SignUp.Step name="start" className="space-y-4">
          <div className="grid gap-2">
            <Clerk.Connection
              name="google"
              className="w-full rounded-xl border border-burgundy-200 text-burgundy-800 hover:bg-burgundy-50 px-4 py-2 font-medium"
            >
              Sign up with Google
            </Clerk.Connection>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px bg-burgundy-200 flex-1" />
            <span className="text-xs text-burgundy-600">or</span>
            <div className="h-px bg-burgundy-200 flex-1" />
          </div>

          <div className="grid gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Clerk.Field name="firstName" className="grid gap-2">
                <Clerk.Label className="text-sm text-burgundy-900">First name</Clerk.Label>
                <Clerk.Input className="w-full rounded-xl border-burgundy-200 focus:border-burgundy-500 focus:ring-burgundy-200" />
                <Clerk.FieldError className="text-sm text-red-600" />
              </Clerk.Field>
              <Clerk.Field name="lastName" className="grid gap-2">
                <Clerk.Label className="text-sm text-burgundy-900">Last name</Clerk.Label>
                <Clerk.Input className="w-full rounded-xl border-burgundy-200 focus:border-burgundy-500 focus:ring-burgundy-200" />
                <Clerk.FieldError className="text-sm text-red-600" />
              </Clerk.Field>
            </div>
            <Clerk.Field name="emailAddress" className="grid gap-2">
              <Clerk.Label className="text-sm text-burgundy-900">Email</Clerk.Label>
              <Clerk.Input className="w-full rounded-xl border-burgundy-200 focus:border-burgundy-500 focus:ring-burgundy-200" />
              <Clerk.FieldError className="text-sm text-red-600" />
            </Clerk.Field>

            <Clerk.Field name="password" className="grid gap-2">
              <Clerk.Label className="text-sm text-burgundy-900">Password</Clerk.Label>
              <Clerk.Input type="password" className="w-full rounded-xl border-burgundy-200 focus:border-burgundy-500 focus:ring-burgundy-200" />
              <Clerk.FieldError className="text-sm text-red-600" />
            </Clerk.Field>
          </div>

          <SignUp.Action
            submit
            className="w-full bg-burgundy-700 hover:bg-burgundy-800 text-white rounded-xl px-4 py-3 font-semibold"
          >
            Create account
          </SignUp.Action>

          <Clerk.GlobalError className="text-sm text-red-600" />
        </SignUp.Step>

        {/* No verification step */}
      </SignUp.Root>

      <p className="text-center text-sm text-burgundy-700 pt-4 border-t border-burgundy-100">
        Already have an account?{" "}
        <Link
          href={`/sign-in?redirect=${encodeURIComponent(redirectUrl)}`}
          className="font-medium text-burgundy-800 hover:text-burgundy-900 underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}


