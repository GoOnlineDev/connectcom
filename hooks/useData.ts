import { useQuery } from 'convex/react';
import useSWR, { SWRConfiguration } from 'swr';
import { api } from '@/convex/_generated/api';
import { SWR_KEYS, swrConfig } from '@/lib/swr-config';
import { convexFetchers } from '@/lib/convex-fetcher';
import { Id } from '@/convex/_generated/dataModel';

// Enhanced SWR hook with Convex integration
export const useData = <T>(
  key: string | null,
  convexQuery?: any,
  convexArgs?: any,
  swrOptions?: SWRConfiguration
) => {
  // Use Convex query if provided, otherwise use SWR
  if (convexQuery) {
    const data = useQuery(convexQuery, convexArgs);
    return {
      data,
      isLoading: data === undefined,
      error: null,
      mutate: () => {}, // Convex handles mutations differently
      isValidating: false,
    };
  }

  // Use SWR for non-Convex data
  const { data, error, mutate, isValidating } = useSWR<T>(
    key,
    null, // No fetcher for now, will be handled by components
    { ...swrConfig, ...swrOptions }
  );

  return {
    data,
    isLoading: !error && !data,
    error,
    mutate,
    isValidating,
  };
};

// User data hooks
export const useCurrentUser = () => {
  return useData(SWR_KEYS.CURRENT_USER, api.users.getCurrentUser);
};

export const useUserProfile = (userId?: string) => {
  return useData(
    userId ? `${SWR_KEYS.USER_PROFILE}-${userId}` : null,
    userId ? api.users.getUserById : null,
    userId ? { userId } : null
  );
};

// Shop data hooks
export const useShops = () => {
  return useData(SWR_KEYS.SHOPS, api.shops.getAllApprovedShops);
};

export const useShop = (shopId?: Id<"shops">) => {
  return useData(
    shopId ? SWR_KEYS.SHOP_BY_ID(shopId) : null,
    shopId ? api.shops.getShopById : null,
    shopId ? { shopId } : null
  );
};

export const useShopsByOwner = (ownerId?: string) => {
  return useData(
    ownerId ? SWR_KEYS.SHOPS_BY_OWNER(ownerId) : null,
    ownerId ? api.shops.getShopsByOwner : null,
    ownerId ? { ownerId } : null
  );
};

export const useFeaturedShops = (limit?: number) => {
  return useData(
    SWR_KEYS.FEATURED_SHOPS,
    api.shops.getFeaturedShops,
    { limit: limit || 6 }
  );
};

export const useRecentShops = (limit?: number) => {
  return useData(
    SWR_KEYS.RECENT_SHOPS,
    api.shops.getRecentShops,
    { limit: limit || 8 }
  );
};

export const useShopsByCategory = (category?: string, limit?: number) => {
  return useData(
    category ? SWR_KEYS.SHOPS_BY_CATEGORY(category) : null,
    category ? api.shops.getShopsByCategory : null,
    category ? { category, limit: limit || 50 } : null
  );
};

export const useSearchShops = (searchTerm?: string, category?: string, shopType?: string) => {
  const args = {
    searchTerm: searchTerm || undefined,
    category: category || undefined,
    shopType: shopType || undefined,
  };
  
  return useData(
    SWR_KEYS.SEARCH_SHOPS(JSON.stringify(args)),
    api.shops.searchShops,
    args
  );
};

// Category data hooks
export const useCategories = () => {
  return useData(SWR_KEYS.ALL_CATEGORIES, api.shops.getAllShopCategories);
};

export const useCategoryStats = () => {
  const categories = useCategories();
  const shops = useShops();
  
  if (!categories.data || !shops.data) {
    return {
      data: [],
      isLoading: categories.isLoading || shops.isLoading,
      error: categories.error || shops.error,
    };
  }

  const stats = categories.data.map((category: string) => {
    const shopCount = shops.data.filter((shop: any) => 
      shop.categories?.includes(category)
    ).length;
    
    return {
      name: category,
      shopCount,
      slug: category.toLowerCase().replace(/\s+/g, '-')
    };
  }).filter((cat: any) => cat.shopCount > 0);

  return {
    data: stats,
    isLoading: false,
    error: null,
  };
};

// Product data hooks
export const useProducts = () => {
  return useData(SWR_KEYS.PRODUCTS);
};

export const useProductsByShop = (shopId?: Id<"shops">) => {
  return useData(
    shopId ? SWR_KEYS.PRODUCTS_BY_SHOP(shopId) : null,
    shopId ? api.products.getProductsByShop : null,
    shopId ? { shopId } : null
  );
};

export const useProduct = (productId?: Id<"products">) => {
  return useData(
    productId ? SWR_KEYS.PRODUCT_BY_ID(productId) : null,
    productId ? api.products.getProductById : null,
    productId ? { productId } : null
  );
};

// Service data hooks
export const useServices = () => {
  return useData(SWR_KEYS.SERVICES);
};

export const useServicesByShop = (shopId?: Id<"shops">) => {
  return useData(
    shopId ? SWR_KEYS.SERVICES_BY_SHOP(shopId) : null,
    shopId ? api.services.getServicesByShop : null,
    shopId ? { shopId } : null
  );
};

export const useService = (serviceId?: Id<"services">) => {
  return useData(
    serviceId ? SWR_KEYS.SERVICE_BY_ID(serviceId) : null,
    serviceId ? api.services.getServiceById : null,
    serviceId ? { serviceId } : null
  );
};

// Shelf data hooks
export const useShelvesByShop = (shopId?: Id<"shops">) => {
  return useData(
    shopId ? SWR_KEYS.SHELVES_BY_SHOP(shopId) : null,
    shopId ? api.shelves.getShopShelves : null,
    shopId ? { shopId } : null
  );
};

export const useShelf = (shelfId?: Id<"shelves">) => {
  return useData(
    shelfId ? SWR_KEYS.SHELF_BY_ID(shelfId) : null,
    shelfId ? api.shelves.getShelfById : null,
    shelfId ? { shelfId } : null
  );
};

// Cart data hooks
export const useCart = () => {
  return useData(SWR_KEYS.USER_CART, api.carts.getUserCart);
};

export const useCartSummary = () => {
  return useData(SWR_KEYS.CART_SUMMARY, api.carts.getCartSummary);
};

// Wishlist data hooks
export const useWishlist = () => {
  return useData(SWR_KEYS.USER_WISHLIST, api.wishlists.getUserWishlist);
};

export const useWishlistCount = () => {
  return useData(SWR_KEYS.WISHLIST_COUNT, api.wishlists.getWishlistCount);
};

// Subscription data hooks
export const useSubscriptionPackages = () => {
  return useData(SWR_KEYS.SUBSCRIPTION_PACKAGES, api.subscriptions.getSubscriptionPackages);
};

export const useSubscriptionStats = () => {
  return useData(SWR_KEYS.SUBSCRIPTION_STATS, api.subscriptions.getSubscriptionStatistics);
};

// Admin data hooks
export const useAdminUsers = () => {
  return useData(SWR_KEYS.ADMIN_USERS, api.admin.getUsers);
};

export const useAdminShops = () => {
  return useData(SWR_KEYS.ADMIN_SHOPS, api.admin.getShops);
};

export const useAdminProducts = () => {
  return useData(SWR_KEYS.ADMIN_PRODUCTS, api.admin.getProducts);
};

export const useAdminServices = () => {
  return useData(SWR_KEYS.ADMIN_SERVICES, api.admin.getServices);
};

// Homepage data hooks
export const useHomepageStats = () => {
  return useData(SWR_KEYS.HOMEPAGE_STATS, api.shops.getHomepageStats);
};

export const useTrendingCategories = () => {
  const categories = useCategories();
  const shops = useShops();
  
  if (!categories.data || !shops.data) {
    return {
      data: [],
      isLoading: categories.isLoading || shops.isLoading,
      error: categories.error || shops.error,
    };
  }

  const trending = categories.data.map((category: string) => {
    const shopCount = shops.data.filter((shop: any) => 
      shop.categories?.includes(category)
    ).length;
    
    return {
      name: category,
      shopCount,
      slug: category.toLowerCase().replace(/\s+/g, '-')
    };
  })
  .filter((cat: any) => cat.shopCount > 0)
  .sort((a: any, b: any) => b.shopCount - a.shopCount)
  .slice(0, 4);

  return {
    data: trending,
    isLoading: false,
    error: null,
  };
};

// Analytics data hook
export const useAnalytics = () => {
  return useData(SWR_KEYS.ANALYTICS);
};

// Review data hooks - Shop Reviews
export const useShopReviews = (shopId?: Id<"shops">, limit?: number) => {
  return useData(
    shopId ? SWR_KEYS.SHOP_REVIEWS(shopId) : null,
    shopId ? api.reviews.getShopReviews : null,
    shopId ? { shopId, limit } : null
  );
};

export const useShopReviewStats = (shopId?: Id<"shops">) => {
  return useData(
    shopId ? SWR_KEYS.SHOP_REVIEW_STATS(shopId) : null,
    shopId ? api.reviews.getShopReviewStats : null,
    shopId ? { shopId } : null
  );
};

export const useUserShopReview = (shopId?: Id<"shops">) => {
  return useData(
    shopId ? SWR_KEYS.USER_SHOP_REVIEW(shopId) : null,
    shopId ? api.reviews.getUserShopReview : null,
    shopId ? { shopId } : null
  );
};

// Review data hooks - Product Reviews
export const useProductReviews = (productId?: Id<"products">, limit?: number) => {
  return useData(
    productId ? SWR_KEYS.PRODUCT_REVIEWS(productId) : null,
    productId ? api.reviews.getProductReviews : null,
    productId ? { productId, limit } : null
  );
};

export const useProductReviewStats = (productId?: Id<"products">) => {
  return useData(
    productId ? SWR_KEYS.PRODUCT_REVIEW_STATS(productId) : null,
    productId ? api.reviews.getProductReviewStats : null,
    productId ? { productId } : null
  );
};

export const useUserProductReview = (productId?: Id<"products">) => {
  return useData(
    productId ? SWR_KEYS.USER_PRODUCT_REVIEW(productId) : null,
    productId ? api.reviews.getUserProductReview : null,
    productId ? { productId } : null
  );
};

// Review data hooks - Service Reviews
export const useServiceReviews = (serviceId?: Id<"services">, limit?: number) => {
  return useData(
    serviceId ? SWR_KEYS.SERVICE_REVIEWS(serviceId) : null,
    serviceId ? api.reviews.getServiceReviews : null,
    serviceId ? { serviceId, limit } : null
  );
};

export const useServiceReviewStats = (serviceId?: Id<"services">) => {
  return useData(
    serviceId ? SWR_KEYS.SERVICE_REVIEW_STATS(serviceId) : null,
    serviceId ? api.reviews.getServiceReviewStats : null,
    serviceId ? { serviceId } : null
  );
};

export const useUserServiceReview = (serviceId?: Id<"services">) => {
  return useData(
    serviceId ? SWR_KEYS.USER_SERVICE_REVIEW(serviceId) : null,
    serviceId ? api.reviews.getUserServiceReview : null,
    serviceId ? { serviceId } : null
  );
};

// Custom hook for shop with items (products/services)
export const useShopWithItems = (shopId?: Id<"shops">) => {
  const shop = useShop(shopId);
  const products = useProductsByShop(shopId);
  const services = useServicesByShop(shopId);
  
  if (!shop.data) {
    return {
      data: null,
      isLoading: shop.isLoading,
      error: shop.error,
    };
  }

  return {
    data: {
      ...shop.data,
      products: products.data || [],
      services: services.data || [],
    },
    isLoading: shop.isLoading || products.isLoading || services.isLoading,
    error: shop.error || products.error || services.error,
  };
};

// Custom hook for product with reviews
export const useProductWithReviews = (productId?: Id<"products">) => {
  const product = useProduct(productId);
  const reviews = useProductReviews(productId, 10);
  const reviewStats = useProductReviewStats(productId);
  const userReview = useUserProductReview(productId);
  
  if (!product.data) {
    return {
      data: null,
      isLoading: product.isLoading,
      error: product.error,
    };
  }

  return {
    data: {
      ...product.data,
      reviews: reviews.data || [],
      reviewStats: reviewStats.data,
      userReview: userReview.data,
    },
    isLoading: product.isLoading || reviews.isLoading || reviewStats.isLoading,
    error: product.error || reviews.error || reviewStats.error,
  };
};

// Custom hook for service with reviews
export const useServiceWithReviews = (serviceId?: Id<"services">) => {
  const service = useService(serviceId);
  const reviews = useServiceReviews(serviceId, 10);
  const reviewStats = useServiceReviewStats(serviceId);
  const userReview = useUserServiceReview(serviceId);
  
  if (!service.data) {
    return {
      data: null,
      isLoading: service.isLoading,
      error: service.error,
    };
  }

  return {
    data: {
      ...service.data,
      reviews: reviews.data || [],
      reviewStats: reviewStats.data,
      userReview: userReview.data,
    },
    isLoading: service.isLoading || reviews.isLoading || reviewStats.isLoading,
    error: service.error || reviews.error || reviewStats.error,
  };
};
