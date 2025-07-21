import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/home/hero-section";
import FeaturedShops from "@/components/home/featured-shops";
import ShopCategories from "@/components/home/shop-categories";
import HowItWorks from "@/components/home/how-it-works";
import Testimonials from "@/components/home/testimonials";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen animate-fade-in">
      {/* Hero Section with improved mobile responsiveness */}
      <HeroSection />
      
      {/* Featured Shops Section - Responsive grid with better spacing */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6 md:mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary">Featured Shops</h2>
              <p className="text-muted-foreground mt-1 md:mt-2">Discover our handpicked selection of outstanding stores</p>
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
      
      {/* Shop Categories - Improved spacing and transitions */}
      <section className="py-12 md:py-16 lg:py-20 bg-secondary">
        <div className="container px-4 mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2 md:mb-3">Shop by Category</h2>
            <p className="text-muted-foreground">
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
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2 md:mb-3">How ConnectCom Works</h2>
            <p className="text-muted-foreground">
              Your journey from browsing to receiving products or services is simple and enjoyable
            </p>
          </div>
          <HowItWorks />
        </div>
      </section>
      
      {/* Testimonials - Improved responsive layout */}
      <section className="py-12 md:py-16 lg:py-20 bg-secondary">
        <div className="container px-4 mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2 md:mb-3">What Our Users Say</h2>
            <p className="text-muted-foreground">
              Hear from customers and shop owners about their experiences with ConnectCom
            </p>
          </div>
          <Testimonials />
        </div>
      </section>
      
      {/* CTA Section - Enhanced with better responsiveness */}
      <section className="py-12 md:py-16 lg:py-20 bg-primary text-primary-foreground">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Ready to Join ConnectCom?</h2>
            <p className="mb-6 md:mb-8 opacity-90 max-w-2xl mx-auto">
              Whether you're looking to shop or sell, ConnectCom offers a seamless experience for all your business needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
              <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 w-full sm:w-auto">
                Start Shopping
              </Button>
              <Button variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 w-full sm:w-auto">
                Register Your Shop
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
