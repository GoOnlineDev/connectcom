"use client";

import { SignInButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative py-16 md:py-24 lg:py-28 px-4 overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-beige via-beige/80 to-white/20 z-0"></div>
      
      <div className="container relative z-10 mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/2 space-y-6">
            <div className="space-y-3 animate-slide-up">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-burgundy">
                Connect with the Best Online Shops
              </h1>
              <p className="text-base md:text-lg text-burgundy/80 max-w-xl">
                Discover thousands of unique products from independent stores all in one place. Shop with confidence and support small businesses.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3 md:gap-4 pt-2 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Link href="/shops" className="w-full sm:w-auto">
                <Button className="bg-burgundy hover:bg-burgundy-dark text-white w-full sm:w-auto animate-scale">
                  Start Shopping
                </Button>
              </Link>
              <Link href="/onboarding/shop" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto border-burgundy text-burgundy hover:bg-burgundy/10">
                  Register Your Shop
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center gap-4 text-burgundy/70 text-sm pt-2 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Trusted by 10,000+ shops</span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Secure payments</span>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="relative h-[300px] sm:h-[350px] md:h-[400px] w-full rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/hero-image.jpg"
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