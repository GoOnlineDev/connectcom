import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/home/hero-section";
import FeaturedShops from "@/components/home/featured-shops";
import ShopCategories from "@/components/home/shop-categories";
import HowItWorks from "@/components/home/how-it-works";
import Testimonials from "@/components/home/testimonials";
import RecentShops from "@/components/home/recent-shops";
import TrendingCategories from "@/components/home/trending-categories";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen animate-fade-in">
      {/* Hero Section with improved mobile responsiveness */}
      <HeroSection />
      
      {/* Trending Categories Section */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-burgundy-900 mb-2 md:mb-3">Trending Categories</h2>
            <p className="text-burgundy-700">
              Discover the most popular categories that our community loves
            </p>
          </div>
          <TrendingCategories />
        </div>
      </section>
      
      {/* Featured Shops Section - Responsive grid with better spacing */}
      <section className="py-12 md:py-16 lg:py-20 bg-beige-100">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6 md:mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-burgundy-900">Featured Shops</h2>
              <p className="text-burgundy-700 mt-1 md:mt-2">Discover our handpicked selection of outstanding stores</p>
            </div>
            <Link href="/shops" className="inline-block">
              <Button variant="outline" className="w-full md:w-auto">
                View All Shops
              </Button>
            </Link>
          </div>
          <FeaturedShops />
        </div>
      </section>
      
      {/* Recent Shops Section */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6 md:mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-burgundy-900">Newest Additions</h2>
              <p className="text-burgundy-700 mt-1 md:mt-2">Check out the latest shops that have joined our platform</p>
            </div>
            <Link href="/shops" className="inline-block">
              <Button variant="outline" className="w-full md:w-auto">
                Browse All
              </Button>
            </Link>
          </div>
          <RecentShops />
        </div>
      </section>
      
      {/* Shop Categories - Improved spacing and transitions */}
      <section className="py-12 md:py-16 lg:py-20 bg-beige-100">
        <div className="container px-4 mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-burgundy-900 mb-2 md:mb-3">Shop by Category</h2>
            <p className="text-burgundy-700">
              Explore our wide range of shops organized by category to find exactly what you're looking for
            </p>
          </div>
          <ShopCategories />
        </div>
      </section>
      
      {/* How It Works - Modern card layout */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-burgundy-900 mb-2 md:mb-3">How ConnectCom Works</h2>
            <p className="text-burgundy-700">
              Your journey from browsing to receiving products or services is simple and enjoyable
            </p>
          </div>
          <HowItWorks />
        </div>
      </section>
      
      {/* Testimonials - Improved responsive layout */}
      <section className="py-12 md:py-16 lg:py-20 bg-beige-100">
        <div className="container px-4 mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-burgundy-900 mb-2 md:mb-3">What Our Users Say</h2>
            <p className="text-burgundy-700">
              Hear from customers and shop owners about their experiences with ConnectCom
            </p>
          </div>
          <Testimonials />
        </div>
      </section>
      
      {/* CTA Section - Minimalistic and simple with redesigned buttons */}
      <section className="py-10 bg-burgundy-900 text-white">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center justify-center text-center gap-4">
            <h2 className="text-xl md:text-2xl font-semibold">Ready to join?</h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
              <Button asChild size="pill-lg" variant="secondary" className="w-full sm:w-auto bg-white text-burgundy-900 hover:bg-beige-100">
                <Link href="/shops">Start Shopping</Link>
              </Button>
              <Button asChild variant="primary" size="pill-lg" className="w-full sm:w-auto border border-white">
                <Link href="/onboarding/shop">Register Shop</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
