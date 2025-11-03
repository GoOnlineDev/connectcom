import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/home/hero-section";
import FeaturedShops from "@/components/home/featured-shops";
import HowItWorks from "@/components/home/how-it-works";
import Testimonials from "@/components/home/testimonials";
import TrendingCategories from "@/components/home/trending-categories";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen animate-fade-in">
      {/* Hero Section with improved mobile responsiveness */}
      <HeroSection />
      
      {/* Trending Categories Section */}
      <section className="py-8 md:py-10 lg:py-12">
        <div className="container px-4 mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-burgundy-900 mb-2">Trending Categories</h2>
            <p className="text-burgundy-700 text-sm md:text-base">
              Discover the most popular categories that our community loves
            </p>
          </div>
          <TrendingCategories />
        </div>
      </section>
      
      {/* Featured Shops Section - Two column grid on mobile, horizontal scroll */}
      <section className="py-8 md:py-10 lg:py-12 bg-beige-100">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-3 mb-5 md:mb-6">
            <div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-burgundy-900">Featured Shops</h2>
              <p className="text-burgundy-700 mt-1 text-sm md:text-base">Discover our handpicked selection of outstanding stores</p>
            </div>
            <Link href="/shops" className="inline-block">
              <Button variant="outline" size="sm" className="w-full md:w-auto">
                View All Shops
              </Button>
            </Link>
          </div>
          <FeaturedShops />
        </div>
      </section>
      
      {/* How It Works - Two column grid, more compact */}
      <section className="py-8 md:py-10 lg:py-12">
        <div className="container px-4 mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-burgundy-900 mb-2">How ConnectCom Works</h2>
            <p className="text-burgundy-700 text-sm md:text-base">
              Your journey from browsing to receiving products or services is simple and enjoyable
            </p>
          </div>
          <HowItWorks />
        </div>
      </section>
      
      {/* Testimonials - Two column grid, better design */}
      <section className="py-8 md:py-10 lg:py-12 bg-beige-100">
        <div className="container px-4 mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-burgundy-900 mb-2">What Our Users Say</h2>
            <p className="text-burgundy-700 text-sm md:text-base">
              Hear from customers and shop owners about their experiences with ConnectCom
            </p>
          </div>
          <Testimonials />
        </div>
      </section>
      
      {/* CTA Section - Redesigned with theme colors */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-burgundy-800 via-burgundy-900 to-burgundy-950 text-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-beige-300 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-beige-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="container px-4 mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-white">
              Ready to join ConnectCom?
            </h2>
            <p className="text-base md:text-lg text-beige-100 mb-6 md:mb-8 max-w-2xl mx-auto">
              Start shopping from amazing local businesses or register your shop to reach thousands of customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                asChild 
                size="lg"
                className="w-full sm:w-auto bg-white text-burgundy-900 hover:bg-beige-50 hover:text-burgundy-950 font-semibold px-8 py-6 text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg"
              >
                <Link href="/shops" className="flex items-center justify-center gap-2">
                  <span>Start Shopping</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-2 border-beige-200 text-white bg-burgundy-800/50 backdrop-blur-sm hover:bg-burgundy-700 hover:border-beige-300 font-semibold px-8 py-6 text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg"
              >
                <Link href="/onboarding/shop" className="flex items-center justify-center gap-2">
                  <span>Register Your Shop</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </Link>
              </Button>
            </div>
            
            {/* Additional info */}
            <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-burgundy-700/50 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 text-sm md:text-base text-beige-200">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-beige-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Free to join</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-beige-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secure platform</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-beige-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Join thousands of users</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
