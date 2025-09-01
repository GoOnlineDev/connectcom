import { SWRConfiguration } from 'swr';

// Global SWR configuration
export const swrConfig: SWRConfiguration = {
  // Revalidate on focus
  revalidateOnFocus: true,
  
  // Revalidate on reconnect
  revalidateOnReconnect: true,
  
  // Dedupe requests within 2 seconds
  dedupingInterval: 2000,
  
  // Keep previous data while revalidating
  keepPreviousData: true,
  
  // Error retry configuration
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  
  // Cache configuration
  focusThrottleInterval: 5000,
  
  // Default fetcher (will be overridden by Convex fetcher)
  fetcher: async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  },
};

// SWR keys for different data types
export const SWR_KEYS = {
  // User data
  CURRENT_USER: 'current-user',
  USER_PROFILE: 'user-profile',
  
  // Shop data
  SHOPS: 'shops',
  SHOP_BY_ID: (id: string) => `shop-${id}`,
  SHOPS_BY_OWNER: (ownerId: string) => `shops-owner-${ownerId}`,
  FEATURED_SHOPS: 'featured-shops',
  RECENT_SHOPS: 'recent-shops',
  SHOPS_BY_CATEGORY: (category: string) => `shops-category-${category}`,
  SEARCH_SHOPS: (params: string) => `search-shops-${params}`,
  
  // Category data
  ALL_CATEGORIES: 'all-categories',
  CATEGORY_STATS: 'category-stats',
  
  // Product data
  PRODUCTS: 'products',
  PRODUCTS_BY_SHOP: (shopId: string) => `products-shop-${shopId}`,
  PRODUCT_BY_ID: (id: string) => `product-${id}`,
  
  // Service data
  SERVICES: 'services',
  SERVICES_BY_SHOP: (shopId: string) => `services-shop-${shopId}`,
  SERVICE_BY_ID: (id: string) => `service-${id}`,
  
  // Shelf data
  SHELVES_BY_SHOP: (shopId: string) => `shelves-shop-${shopId}`,
  SHELF_BY_ID: (id: string) => `shelf-${id}`,
  
  // Cart data
  USER_CART: 'user-cart',
  CART_SUMMARY: 'cart-summary',
  
  // Wishlist data
  USER_WISHLIST: 'user-wishlist',
  WISHLIST_COUNT: 'wishlist-count',
  
  // Subscription data
  SUBSCRIPTION_PACKAGES: 'subscription-packages',
  SUBSCRIPTION_STATS: 'subscription-stats',
  USER_SUBSCRIPTION: 'user-subscription',
  
  // Admin data
  ADMIN_USERS: 'admin-users',
  ADMIN_SHOPS: 'admin-shops',
  ADMIN_PRODUCTS: 'admin-products',
  ADMIN_SERVICES: 'admin-services',
  
  // Homepage data
  HOMEPAGE_STATS: 'homepage-stats',
  TRENDING_CATEGORIES: 'trending-categories',
  
  // Analytics data
  ANALYTICS: 'analytics',
  
  // Review data
  SHOP_REVIEWS: (shopId: string) => `shop-reviews-${shopId}`,
  SHOP_REVIEW_STATS: (shopId: string) => `shop-review-stats-${shopId}`,
  USER_SHOP_REVIEW: (shopId: string) => `user-shop-review-${shopId}`,
  
  PRODUCT_REVIEWS: (productId: string) => `product-reviews-${productId}`,
  PRODUCT_REVIEW_STATS: (productId: string) => `product-review-stats-${productId}`,
  USER_PRODUCT_REVIEW: (productId: string) => `user-product-review-${productId}`,
  
  SERVICE_REVIEWS: (serviceId: string) => `service-reviews-${serviceId}`,
  SERVICE_REVIEW_STATS: (serviceId: string) => `service-review-stats-${serviceId}`,
  USER_SERVICE_REVIEW: (serviceId: string) => `user-service-review-${serviceId}`,
} as const;

// Type for SWR keys
export type SWRKey = typeof SWR_KEYS[keyof typeof SWR_KEYS] | string;
