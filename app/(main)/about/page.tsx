import AboutUsStats from '@/components/home/homepage-stats'; // Renamed to AboutUsStats
import { constructMetadata } from '@/lib/seo';
import { Metadata } from 'next';

export const metadata: Metadata = constructMetadata({
  title: "About Us - ConnectCom Uganda",
  description: "Learn about ConnectCom, Uganda's premier online marketplace. Connecting independent shops with customers worldwide since 2023.",
  canonical: '/about',
});

export default function AboutPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-burgundy-900">About ConnectCom</h1>
            <p className="text-lg max-w-3xl mx-auto text-burgundy-700">
              Connecting independent shops with customers worldwide since 2023
            </p>
          </div>

          <div className="bg-white border border-burgundy-100 rounded-2xl shadow-lg p-8 md:p-12 text-burgundy-700 space-y-6">
            <p className="text-lg leading-relaxed">
              We are a community-driven marketplace that helps Ugandan entrepreneurs launch and grow their online shops.
              From Kampala to Gulu, our network of makers, service providers, and boutique brands uses ConnectCom to reach
              customers without paying heavy marketplace taxes or agency fees.
            </p>
            <p className="text-md leading-relaxed">
              Our marketplace champions transparency, fast onboarding, and honest storytelling—helping merchants build trust
              with buyers nationwide.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-beige-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-burgundy-900">Our Impact</h2>
          <AboutUsStats />
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-4 bg-beige-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-burgundy-900">Our Story</h2>
          
          <div className="space-y-6 text-burgundy-700">
            <p>
              ConnectCom was founded with a simple mission: to create a platform where independent online 
              shops could thrive and connect with customers looking for unique products. 
            </p>
            
            <p>
              What started as a small project has grown into a vibrant marketplace featuring thousands of 
              independent sellers from around the world. We believe in the power of small businesses and 
              the unique products they create.
            </p>
            
            <p>
              Our platform provides tools for sellers to showcase their products and connect with customers 
              who appreciate quality, craftsmanship, and originality. For shoppers, we offer a curated 
              experience that makes it easy to discover and purchase products that can't be found elsewhere.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-burgundy-900">Our Values</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-burgundy-100">
              <div className="w-12 h-12 bg-burgundy-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-burgundy-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-burgundy-900">Community</h3>
              <p className="text-burgundy-700">
                We believe in building strong communities of sellers and shoppers who share common values.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-burgundy-100">
              <div className="w-12 h-12 bg-burgundy-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-burgundy-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-burgundy-900">Trust & Safety</h3>
              <p className="text-burgundy-700">
                We're committed to creating a secure platform where both sellers and buyers feel protected.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-burgundy-100">
              <div className="w-12 h-12 bg-burgundy-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-burgundy-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-burgundy-900">Diversity</h3>
              <p className="text-burgundy-700">
                We celebrate the diversity of our global community of sellers and the unique products they create.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Context */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto space-y-6 text-burgundy-700 leading-relaxed">
          <h2 className="text-3xl font-bold text-burgundy-900">Built for Uganda&apos;s Next Generation of Online Sellers</h2>
          <p>
            ConnectCom is laser-focused on helping Ugandans list products and services in minutes. No coding, no marketing
            jargon, just the tools and transparency you need to build trust online. Thousands of shoppers rely on ConnectCom
            every week to discover salons, artisans, grocery shops, and service providers who speak their language and deliver
            locally.
          </p>
          <p>
            We provide detailed analytics, messaging tools, and marketing prompts that help owners grow repeat customers.
            We believe that clear pricing, easy communication, and mobile-first design unlock real growth for small shops.
          </p>
        </div>
      </section>
    </div>
  );
}
