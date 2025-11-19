"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren, useMemo } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();

  const isSignUp = useMemo(() => pathname?.includes("sign-up"), [pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige via-white to-burgundy-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          {/* Left Panel - Branding (hidden on mobile) */}
          <div className="hidden md:flex md:w-1/2 lg:w-2/5">
            <div className="relative w-full overflow-hidden bg-burgundy-900 rounded-3xl px-10 py-12 text-white shadow-2xl">
              <div className="absolute inset-0 bg-[url('/presentation 2-06.png')] bg-cover bg-center opacity-20" />
              <div className="relative z-10 flex flex-col gap-6">
                <Link href="/" className="flex items-center gap-3">
                  <Image
                    src="/logo.png"
                    alt="ConnectCom Logo"
                    width={44}
                    height={44}
                    className="rounded-full bg-white p-1"
                  />
                  <span className="text-2xl font-semibold tracking-tight">
                    ConnectCom
                  </span>
                </Link>
                <div className="space-y-4">
                  <h1 className="text-3xl font-semibold leading-tight lg:text-4xl">
                    Uganda&apos;s marketplace,
                    <br />
                    tailored for you
                  </h1>
                  <p className="max-w-sm text-base text-white/80">
                    Discover trusted vendors, manage your shop, and stay connected
                    with customers—all in one place. Sign in to pick up right where
                    you left off.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Auth Form */}
          <div className="w-full md:w-1/2 lg:w-3/5">
            <div className="bg-white rounded-3xl shadow-2xl ring-1 ring-burgundy-100 p-6 sm:p-8 lg:p-10">
              {/* Mobile Header */}
              <div className="mb-6 flex items-center justify-between md:hidden">
                <Link href="/" className="flex items-center gap-3 text-burgundy-900">
                  <Image
                    src="/logo.png"
                    alt="ConnectCom Logo"
                    width={40}
                    height={40}
                    className="rounded-full bg-burgundy-50 p-1"
                  />
                  <span className="text-xl font-semibold">ConnectCom</span>
                </Link>
                <Link
                  href={isSignUp ? "/sign-in" : "/sign-up"}
                  className="text-sm font-medium text-burgundy-700 hover:text-burgundy-900"
                >
                  {isSignUp ? "Sign in" : "Create account"}
                </Link>
              </div>
              
              {/* Auth Content */}
              <div className="w-full">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

