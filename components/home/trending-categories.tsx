'use client';

import Link from 'next/link';
import { useCategories, useShops } from '@/hooks/useData';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Smartphone,
  Shirt,
  Home,
  Heart,
  Gamepad2,
  Dumbbell,
  UtensilsCrossed,
  BookOpen,
  ShoppingBag,
  Music,
  Car,
  Camera,
  Baby,
  Flower2,
  Wrench,
  Stethoscope,
  LucideIcon,
} from 'lucide-react';

// Category icons with colors - using component types instead of ReactNode
type IconConfig = {
  IconComponent: LucideIcon;
  bgColor: string;
  iconColor: string;
};

const categoryIcons: Record<string, IconConfig> = {
  "Electronics": {
    IconComponent: Smartphone,
    bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
    iconColor: "text-white"
  },
  "Fashion": {
    IconComponent: Shirt,
    bgColor: "bg-gradient-to-br from-pink-500 to-rose-600",
    iconColor: "text-white"
  },
  "Home & Garden": {
    IconComponent: Home,
    bgColor: "bg-gradient-to-br from-green-500 to-emerald-600",
    iconColor: "text-white"
  },
  "Beauty & Health": {
    IconComponent: Heart,
    bgColor: "bg-gradient-to-br from-red-500 to-pink-600",
    iconColor: "text-white"
  },
  "Toys & Games": {
    IconComponent: Gamepad2,
    bgColor: "bg-gradient-to-br from-purple-500 to-indigo-600",
    iconColor: "text-white"
  },
  "Sports & Outdoors": {
    IconComponent: Dumbbell,
    bgColor: "bg-gradient-to-br from-orange-500 to-red-600",
    iconColor: "text-white"
  },
  "Food & Beverages": {
    IconComponent: UtensilsCrossed,
    bgColor: "bg-gradient-to-br from-amber-500 to-orange-600",
    iconColor: "text-white"
  },
  "Books & Media": {
    IconComponent: BookOpen,
    bgColor: "bg-gradient-to-br from-indigo-500 to-blue-600",
    iconColor: "text-white"
  },
  "Automotive": {
    IconComponent: Car,
    bgColor: "bg-gradient-to-br from-gray-600 to-gray-800",
    iconColor: "text-white"
  },
  "Photography": {
    IconComponent: Camera,
    bgColor: "bg-gradient-to-br from-teal-500 to-cyan-600",
    iconColor: "text-white"
  },
  "Baby & Kids": {
    IconComponent: Baby,
    bgColor: "bg-gradient-to-br from-yellow-400 to-amber-500",
    iconColor: "text-white"
  },
  "Flowers": {
    IconComponent: Flower2,
    bgColor: "bg-gradient-to-br from-pink-400 to-rose-500",
    iconColor: "text-white"
  },
  "Tools & Hardware": {
    IconComponent: Wrench,
    bgColor: "bg-gradient-to-br from-slate-600 to-slate-800",
    iconColor: "text-white"
  },
  "Medical": {
    IconComponent: Stethoscope,
    bgColor: "bg-gradient-to-br from-emerald-500 to-teal-600",
    iconColor: "text-white"
  },
  "Music": {
    IconComponent: Music,
    bgColor: "bg-gradient-to-br from-violet-500 to-purple-600",
    iconColor: "text-white"
  },
};

export default function TrendingCategories() {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: allShops, isLoading: shopsLoading } = useShops();

  if (!categories || !allShops || categoriesLoading || shopsLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
            <Skeleton className="h-8 w-8 mb-2" />
            <Skeleton className="h-4 w-3/4 mb-1" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  // Category name variations mapping - maps any variation to a standard category name
  const categoryNameMap: Record<string, string> = {
    // Electronics variations
    'electronics': 'Electronics',
    'electronic': 'Electronics',
    'tech': 'Electronics',
    'technology': 'Electronics',
    
    // Fashion variations
    'fashion': 'Fashion',
    'clothing': 'Fashion',
    'apparel': 'Fashion',
    'wear': 'Fashion',
    'style': 'Fashion',
    
    // Home & Garden variations
    'home & garden': 'Home & Garden',
    'home and garden': 'Home & Garden',
    'home': 'Home & Garden',
    'garden': 'Home & Garden',
    'furniture': 'Home & Garden',
    
    // Beauty & Health variations
    'beauty & health': 'Beauty & Health',
    'beauty and health': 'Beauty & Health',
    'beauty': 'Beauty & Health',
    'health': 'Beauty & Health',
    'cosmetics': 'Beauty & Health',
    'wellness': 'Beauty & Health',
    
    // Toys & Games variations
    'toys & games': 'Toys & Games',
    'toys and games': 'Toys & Games',
    'toys': 'Toys & Games',
    'games': 'Toys & Games',
    'gaming': 'Toys & Games',
    
    // Sports & Outdoors variations
    'sports & outdoors': 'Sports & Outdoors',
    'sports and outdoors': 'Sports & Outdoors',
    'sports': 'Sports & Outdoors',
    'outdoor': 'Sports & Outdoors',
    'fitness': 'Sports & Outdoors',
    'exercise': 'Sports & Outdoors',
    
    // Food & Beverages variations
    'food & beverages': 'Food & Beverages',
    'food and beverages': 'Food & Beverages',
    'food': 'Food & Beverages',
    'beverage': 'Food & Beverages',
    'beverages': 'Food & Beverages',
    'restaurant': 'Food & Beverages',
    'dining': 'Food & Beverages',
    
    // Books & Media variations
    'books & media': 'Books & Media',
    'books and media': 'Books & Media',
    'books': 'Books & Media',
    'book': 'Books & Media',
    'media': 'Books & Media',
    'reading': 'Books & Media',
  };

  // Helper function to normalize and map category names
  const normalizeCategory = (name: string): string => {
    const normalized = name.toLowerCase().trim().replace(/\s+/g, ' ');
    return categoryNameMap[normalized] || name;
  };

  // Helper function to get icon config
  const getIconConfig = (categoryName: string): IconConfig => {
    // Normalize and map the category name
    const mappedName = normalizeCategory(categoryName);
    
    // Try exact match with mapped name
    if (categoryIcons[mappedName]) {
      return categoryIcons[mappedName];
    }
    
    // Try case-insensitive match with original name
    const caseInsensitiveMatch = Object.keys(categoryIcons).find(
      key => key.toLowerCase() === categoryName.toLowerCase()
    );
    
    if (caseInsensitiveMatch) {
      return categoryIcons[caseInsensitiveMatch];
    }
    
    // Try partial matching
    const categoryLower = categoryName.toLowerCase();
    for (const [key, config] of Object.entries(categoryIcons)) {
      const keyLower = key.toLowerCase();
      
      // Check if either contains the other
      if (categoryLower.includes(keyLower) || keyLower.includes(categoryLower)) {
        return config;
      }
    }
    
    // Default fallback
    return {
      IconComponent: ShoppingBag,
      bgColor: "bg-gradient-to-br from-burgundy-800 to-burgundy-900",
      iconColor: "text-white"
    };
  };

  // Calculate shop count for each category and sort by popularity
  const categoryStats = categories.map((category: string) => {
    const shopCount = allShops.filter((shop: any) => 
      shop.categories?.includes(category)
    ).length;
    
    const iconConfig = getIconConfig(category);
    
    return {
      name: category,
      shopCount,
      ...iconConfig
    };
  })
  .filter((cat: any) => cat.shopCount > 0) // Only show categories with shops
  .sort((a: any, b: any) => b.shopCount - a.shopCount) // Sort by shop count descending
  .slice(0, 4); // Take top 4

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categoryStats.map((category: any, index: number) => {
        const Icon = category.IconComponent;
        return (
          <Link 
            href={`/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}`} 
            key={category.name}
            className="group bg-white rounded-xl p-5 shadow-sm hover:shadow-lg border border-beige-200 hover:border-burgundy-800 transition-all duration-300 animate-fade-in hover:-translate-y-1"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-center mb-4">
              <div className={`${category.bgColor} rounded-full p-3 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-7 h-7 ${category.iconColor}`} />
              </div>
            </div>
            <h3 className="text-sm font-bold text-burgundy-900 text-center line-clamp-1 mb-2 group-hover:text-burgundy-800 transition-colors">
              {category.name}
            </h3>
            <p className="text-xs text-burgundy-700 text-center font-medium">
              {category.shopCount} shop{category.shopCount !== 1 ? 's' : ''}
            </p>
          </Link>
        );
      })}
    </div>
  );
}

