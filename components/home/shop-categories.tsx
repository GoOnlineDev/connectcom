import Image from 'next/image';
import Link from 'next/link';

const categories = [
  {
    id: 1,
    name: "Electronics",
    image: "/categories/electronics.jpg",
    slug: "electronics",
    shopCount: 42,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    id: 2,
    name: "Fashion",
    image: "/categories/fashion.jpg",
    slug: "fashion",
    shopCount: 87,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
  {
    id: 3,
    name: "Home & Garden",
    image: "/categories/home-garden.jpg",
    slug: "home-garden",
    shopCount: 65,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  {
    id: 4,
    name: "Beauty & Health",
    image: "/categories/beauty-health.jpg",
    slug: "beauty-health",
    shopCount: 54,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )
  },
  {
    id: 5,
    name: "Toys & Games",
    image: "/categories/toys-games.jpg",
    slug: "toys-games",
    shopCount: 38,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: 6,
    name: "Sports & Outdoors",
    image: "/categories/sports-outdoors.jpg",
    slug: "sports-outdoors",
    shopCount: 46,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  }
];

export default function ShopCategories() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
      {categories.map((category, index) => (
        <Link 
          href={`/categories/${category.slug}`} 
          key={category.id}
          className="group bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex flex-col h-full">
            <div className="relative h-28 sm:h-32 overflow-hidden">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy/70 via-burgundy/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
              
              {/* Category icon in a circle */}
              <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-burgundy shadow-sm transform transition-transform group-hover:rotate-12">
                {category.icon}
              </div>
            </div>
            
            <div className="p-3 flex flex-col justify-between flex-grow bg-gradient-to-b from-white to-beige/30">
              <div>
                <h3 className="text-base font-semibold text-burgundy group-hover:text-burgundy-light transition-colors">{category.name}</h3>
                <p className="text-xs text-burgundy/70 mt-0.5">{category.shopCount} shops</p>
              </div>
              
              <div className="mt-2 pt-2 border-t border-burgundy/10">
                <span className="text-xs font-medium text-burgundy/80 flex items-center">
                  Browse Category
                  <svg className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 