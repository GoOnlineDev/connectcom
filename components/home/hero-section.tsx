"use client";

import { SignInButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useHomepageStats } from '@/hooks/useData';

export default function HeroSection() {
  const { data: stats, isLoading } = useHomepageStats();

  return (
    <section className="relative py-16 md:py-24 lg:py-28 px-4 overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-beige via-beige/80 to-white/20 z-0"></div>
      
      <div className="container relative z-10 mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/2 space-y-6">
            <div className="space-y-3 animate-slide-up text-center md:text-left" >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-burgundy">
                Connect and Create with the best online shops
              </h1>
              <p className="text-base md:text-lg text-burgundy/80 max-w-xl">
                Discover products and services from independent stores all in one place. Shop with confidence and support small businesses.
              </p>
            </div>
            
            {/* Buttons in row direction with padding */}
            <div className="flex flex-row gap-4 pt-2 animate-fade-in w-full" style={{ animationDelay: "0.2s" }}>
              <Link href="/shops" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto px-4 py-2 rounded-xl text-sm animate-scale">
                  Start Shopping
                </Button>
              </Link>
              <Link href="/onboarding/shop" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto px-4 py-2 rounded-xl text-sm">
                  Register Your Shop
                </Button>
              </Link>
            </div>
            

            {/* Live stats */}
            {stats && (
              <div className="grid grid-cols-3 gap-4 pt-4 animate-fade-in" style={{ animationDelay: "0.6s" }}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-burgundy-900">{stats.totalProducts.toLocaleString()}</div>
                  <div className="text-xs text-burgundy-700">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-burgundy-900">{stats.totalServices.toLocaleString()}</div>
                  <div className="text-xs text-burgundy-700">Services</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-burgundy-900">{stats.totalUsers.toLocaleString()}</div>
                  <div className="text-xs text-burgundy-700">Users</div>
                </div>
              </div>
            )}
          </div>
          
          <div className="w-full md:w-1/2 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="relative h-[300px] sm:h-[350px] md:h-[400px] w-full rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/connectcom.png"
                alt="ConnectCom Marketplace"
                fill
                className="object-cover transition-transform hover:scale-105 duration-700"
                style={{ objectPosition: 'center' }}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy/30 to-transparent"></div>
              
              {/* Floating elements for visual interest */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-burgundy/10 rounded-full blur-xl"></div>
              <div className="absolute -top-5 -left-5 w-24 h-24 bg-burgundy/5 rounded-full blur-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 