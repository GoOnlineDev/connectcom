import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-burgundy">About ConnectCom</h1>
            <p className="text-lg max-w-3xl mx-auto text-burgundy/80">
              Connecting independent shops with customers worldwide since 2023
            </p>
          </div>
          
          <div className="relative h-[400px] w-full mb-12">
            <Image
              src="/about-hero.jpg"
              alt="ConnectCom Team"
              fill
              className="object-cover rounded-lg shadow-lg"
              style={{ objectPosition: 'center' }}
            />
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-4 bg-beige">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-burgundy">Our Story</h2>
          
          <div className="space-y-6 text-burgundy/80">
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
          <h2 className="text-3xl font-bold mb-12 text-center text-burgundy">Our Values</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border-burgundy/10">
              <div className="w-12 h-12 bg-burgundy/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-burgundy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-burgundy">Community</h3>
              <p className="text-burgundy/80">
                We believe in building strong communities of sellers and shoppers who share common values.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border-burgundy/10">
              <div className="w-12 h-12 bg-burgundy/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-burgundy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-burgundy">Trust & Safety</h3>
              <p className="text-burgundy/80">
                We're committed to creating a secure platform where both sellers and buyers feel protected.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border-burgundy/10">
              <div className="w-12 h-12 bg-burgundy/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-burgundy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-burgundy">Diversity</h3>
              <p className="text-burgundy/80">
                We celebrate the diversity of our global community of sellers and the unique products they create.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-beige">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-burgundy">Our Team</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="relative h-32 w-32 mx-auto mb-4">
                  <Image
                    src={`/team-member-${i}.jpg`}
                    alt={`Team Member ${i}`}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <h3 className="text-xl font-semibold text-burgundy">Team Member {i}</h3>
                <p className="text-burgundy/80">Position</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
