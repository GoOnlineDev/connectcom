import Image from 'next/image';
import Link from 'next/link';

const featuredShops = [
  {
    id: 1,
    name: "Artisan Crafts",
    description: "Handmade crafts and artisan products",
    image: "/shops/artisan-crafts.jpg",
    slug: "artisan-crafts",
    rating: 4.8,
    reviewCount: 124,
    tags: ["Handmade", "Art"]
  },
  {
    id: 2,
    name: "Tech Haven",
    description: "Latest gadgets and tech accessories",
    image: "/shops/tech-haven.jpg",
    slug: "tech-haven",
    rating: 4.6,
    reviewCount: 89,
    tags: ["Electronics", "Gadgets"]
  },
  {
    id: 3,
    name: "Fashion Forward",
    description: "Trending fashion and accessories",
    image: "/shops/fashion-forward.jpg",
    slug: "fashion-forward",
    rating: 4.9,
    reviewCount: 210,
    tags: ["Fashion", "Accessories"]
  },
  {
    id: 4,
    name: "Home Elegance",
    description: "Premium home decor and furnishings",
    image: "/shops/home-elegance.jpg",
    slug: "home-elegance",
    rating: 4.7,
    reviewCount: 156,
    tags: ["Home Decor", "Furniture"]
  }
];

export default function FeaturedShops() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {featuredShops.map((shop, index) => (
        <Link 
          href={`/shops/${shop.slug}`} 
          key={shop.id}
          className="group bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px] animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="relative h-40 sm:h-44 lg:h-48 overflow-hidden">
            <Image
              src={shop.image}
              alt={shop.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-3 left-3 flex gap-1.5">
              {shop.tags.map((tag, i) => (
                <span key={i} className="text-xs px-2 py-0.5 bg-white/90 text-burgundy rounded-full shadow-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-lg font-semibold text-burgundy group-hover:text-burgundy-light transition-colors">{shop.name}</h3>
              <div className="flex items-center bg-beige rounded-full px-2 py-0.5">
                <svg className="w-3.5 h-3.5 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs font-medium text-burgundy/90">{shop.rating}</span>
              </div>
            </div>
            
            <p className="text-burgundy/70 text-sm mb-3 line-clamp-2">{shop.description}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-burgundy/60">{shop.reviewCount} reviews</span>
              <span className="text-xs font-medium text-burgundy bg-beige-dark px-2 py-1 rounded-md inline-flex items-center group-hover:bg-burgundy/10 transition-colors">
                View Shop
                <svg className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 