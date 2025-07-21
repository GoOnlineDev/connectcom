import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

export const createShop = mutation({
  args: {
    ownerId: v.string(), // Clerk User ID of the owner
    shopName: v.string(),
    shopType: v.string(), // "product_shop" or "service_shop"
    shopLogoUrl: v.optional(v.string()),
    shopImageUrl: v.optional(v.string()),
    contactInfo: v.optional(v.object({
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      website: v.optional(v.string()),
    })),
    operatingHours: v.optional(v.any()),
    physicalLocation: v.optional(v.any()),
    description: v.optional(v.string()),
    categories: v.optional(v.array(v.string())),
    status: v.string(), // Initial status, e.g., "pending_approval"
    shopLayoutConfig: v.optional(v.any()),
  },
  returns: v.id("shops"),
  handler: async (ctx, args) => {
    const currentTime = Date.now();
    
    // Create the shop
    const shopId = await ctx.db.insert("shops", {
      ownerId: args.ownerId,
      shopName: args.shopName,
      shopType: args.shopType,
      shopLogoUrl: args.shopLogoUrl,
      shopImageUrl: args.shopImageUrl,
      contactInfo: args.contactInfo,
      operatingHours: args.operatingHours,
      physicalLocation: args.physicalLocation,
      description: args.description,
      categories: args.categories,
      status: args.status,
      shopLayoutConfig: args.shopLayoutConfig,
      createdAt: currentTime,
      updatedAt: currentTime,
    });

    // Find the user by clerkUserId
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.ownerId))
      .unique();

    if (user) {
      // Update the user with the new shopId and set role to "vendor" if not already
      const shopIds = user.shopIds || [];
      await ctx.db.patch(user._id, { 
        shopIds: [...shopIds, shopId],
        role: "vendor", // Set role to vendor
        updatedAt: currentTime,
      });
    }

    return shopId;
  },
});

export const getShopById = query({
  args: {
    shopId: v.id("shops"),
  },
  returns: v.union(v.null(), v.object({
    _id: v.id("shops"),
    _creationTime: v.number(),
    ownerId: v.string(),
    shopName: v.string(),
    shopImageUrl: v.optional(v.string()),
    shopLogoUrl: v.optional(v.string()),
    contactInfo: v.optional(v.object({
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      website: v.optional(v.string()),
    })),
    operatingHours: v.optional(v.any()),
    physicalLocation: v.optional(v.any()),
    description: v.optional(v.string()),
    shopType: v.string(),
    categories: v.optional(v.array(v.string())),
    productIds: v.optional(v.array(v.id("products"))),
    serviceIds: v.optional(v.array(v.id("services"))),
    shelfIds: v.optional(v.array(v.id("shelves"))),
    status: v.string(),
    adminNotes: v.optional(v.string()),
    reviewedAt: v.optional(v.number()),
    shopLayoutConfig: v.optional(v.any()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })),
  handler: async (ctx, args) => {
    const shop = await ctx.db.get(args.shopId);
    return shop;
  },
});

export const getShopsByOwner = query({
  args: {
    ownerId: v.string(), // Clerk User ID of the owner
  },
  returns: v.array(v.object({
    _id: v.id("shops"),
    _creationTime: v.number(),
    ownerId: v.string(),
    shopName: v.string(),
    shopImageUrl: v.optional(v.string()),
    shopLogoUrl: v.optional(v.string()),
    contactInfo: v.optional(v.object({
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      website: v.optional(v.string()),
    })),
    operatingHours: v.optional(v.any()),
    physicalLocation: v.optional(v.any()),
    description: v.optional(v.string()),
    shopType: v.string(),
    categories: v.optional(v.array(v.string())),
    productIds: v.optional(v.array(v.id("products"))),
    serviceIds: v.optional(v.array(v.id("services"))),
    shelfIds: v.optional(v.array(v.id("shelves"))),
    status: v.string(),
    adminNotes: v.optional(v.string()),
    reviewedAt: v.optional(v.number()),
    shopLayoutConfig: v.optional(v.any()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })),
  handler: async (ctx, args) => {
    const shops = await ctx.db
      .query("shops")
      .withIndex("by_ownerId", (q) => q.eq("ownerId", args.ownerId))
      .collect();

    return shops;
  },
});

// Get all approved shops
export const getAllApprovedShops = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("shops"),
    _creationTime: v.number(),
    ownerId: v.string(),
    shopName: v.string(),
    shopImageUrl: v.optional(v.string()),
    shopLogoUrl: v.optional(v.string()),
    contactInfo: v.optional(v.object({
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      website: v.optional(v.string()),
    })),
    operatingHours: v.optional(v.any()),
    physicalLocation: v.optional(v.any()),
    description: v.optional(v.string()),
    shopType: v.string(),
    categories: v.optional(v.array(v.string())),
    productIds: v.optional(v.array(v.id("products"))),
    serviceIds: v.optional(v.array(v.id("services"))),
    shelfIds: v.optional(v.array(v.id("shelves"))),
    status: v.string(),
    adminNotes: v.optional(v.string()),
    reviewedAt: v.optional(v.number()),
    shopLayoutConfig: v.optional(v.any()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })),
  handler: async (ctx) => {
    const approvedShops = await ctx.db
      .query("shops")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    return approvedShops;
  },
});

// Get shop with products/services
export const getShopWithItems = query({
  args: {
    shopId: v.id("shops"),
  },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("shops"),
      _creationTime: v.number(),
      ownerId: v.string(),
      shopName: v.string(),
      shopImageUrl: v.optional(v.string()),
      shopLogoUrl: v.optional(v.string()),
      contactInfo: v.optional(v.object({
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        website: v.optional(v.string()),
      })),
      operatingHours: v.optional(v.any()),
      physicalLocation: v.optional(v.any()),
      description: v.optional(v.string()),
      shopType: v.string(),
      categories: v.optional(v.array(v.string())),
      productIds: v.optional(v.array(v.id("products"))),
      serviceIds: v.optional(v.array(v.id("services"))),
      shelfIds: v.optional(v.array(v.id("shelves"))),
      status: v.string(),
      adminNotes: v.optional(v.string()),
      reviewedAt: v.optional(v.number()),
      shopLayoutConfig: v.optional(v.any()),
      createdAt: v.number(),
      updatedAt: v.number(),
      products: v.array(v.object({
        _id: v.id("products"),
        _creationTime: v.number(),
        shopId: v.id("shops"),
        name: v.string(),
        description: v.optional(v.string()),
        imageUrls: v.optional(v.array(v.string())),
        price: v.number(),
        quantityAvailable: v.optional(v.number()),
        tags: v.optional(v.array(v.string())),
        updatedAt: v.number(),
      })),
      services: v.array(v.object({
        _id: v.id("services"),
        _creationTime: v.number(),
        shopId: v.id("shops"),
        name: v.string(),
        description: v.optional(v.string()),
        duration: v.optional(v.any()),
        pricing: v.optional(v.any()),
        bookingInfo: v.optional(v.any()),
        updatedAt: v.number(),
      })),
    })
  ),
  handler: async (ctx, args) => {
    const shop = await ctx.db.get(args.shopId);
    if (!shop) return null;

    const products: Array<{
      _id: Id<"products">;
      _creationTime: number;
      shopId: Id<"shops">;
      name: string;
      description?: string;
      imageUrls?: string[];
      price: number;
      quantityAvailable?: number;
      tags?: string[];
      updatedAt: number;
    }> = [];
    
    const services: Array<{
      _id: Id<"services">;
      _creationTime: number;
      shopId: Id<"shops">;
      name: string;
      description?: string;
      duration?: any;
      pricing?: any;
      bookingInfo?: any;
      updatedAt: number;
    }> = [];

    if (shop.shopType === "product_shop") {
      const fetchedProducts = await ctx.db
        .query("products")
        .withIndex("by_shopId", (q) => q.eq("shopId", args.shopId))
        .collect();
      products.push(...fetchedProducts);
    } else if (shop.shopType === "service_shop") {
      const fetchedServices = await ctx.db
        .query("services")
        .withIndex("by_shopId", (q) => q.eq("shopId", args.shopId))
        .collect();
      services.push(...fetchedServices);
    }

    return {
      ...shop,
      products,
      services,
    };
  },
});

// Search shops by name or category
export const searchShops = query({
  args: {
    searchTerm: v.optional(v.string()),
    category: v.optional(v.string()),
    shopType: v.optional(v.string()),
  },
  returns: v.array(v.object({
    _id: v.id("shops"),
    _creationTime: v.number(),
    ownerId: v.string(),
    shopName: v.string(),
    shopImageUrl: v.optional(v.string()),
    shopLogoUrl: v.optional(v.string()),
    contactInfo: v.optional(v.object({
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      website: v.optional(v.string()),
    })),
    operatingHours: v.optional(v.any()),
    physicalLocation: v.optional(v.any()),
    description: v.optional(v.string()),
    shopType: v.string(),
    categories: v.optional(v.array(v.string())),
    productIds: v.optional(v.array(v.id("products"))),
    serviceIds: v.optional(v.array(v.id("services"))),
    shelfIds: v.optional(v.array(v.id("shelves"))),
    status: v.string(),
    adminNotes: v.optional(v.string()),
    reviewedAt: v.optional(v.number()),
    shopLayoutConfig: v.optional(v.any()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })),
  handler: async (ctx, args) => {
    let shops = await ctx.db
      .query("shops")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    // Filter by search term
    if (args.searchTerm) {
      const searchLower = args.searchTerm.toLowerCase();
      shops = shops.filter(shop => 
        shop.shopName.toLowerCase().includes(searchLower) ||
        (shop.description && shop.description.toLowerCase().includes(searchLower))
      );
    }

    // Filter by category
    if (args.category) {
      shops = shops.filter(shop => 
        shop.categories?.includes(args.category!)
      );
    }

    // Filter by shop type
    if (args.shopType) {
      shops = shops.filter(shop => shop.shopType === args.shopType);
    }

    return shops;
  },
});

// Get featured shops (e.g., newest or most popular)
export const getFeaturedShops = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(v.object({
    _id: v.id("shops"),
    _creationTime: v.number(),
    ownerId: v.string(),
    shopName: v.string(),
    shopImageUrl: v.optional(v.string()),
    shopLogoUrl: v.optional(v.string()),
    contactInfo: v.optional(v.object({
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      website: v.optional(v.string()),
    })),
    operatingHours: v.optional(v.any()),
    physicalLocation: v.optional(v.any()),
    description: v.optional(v.string()),
    shopType: v.string(),
    categories: v.optional(v.array(v.string())),
    productIds: v.optional(v.array(v.id("products"))),
    serviceIds: v.optional(v.array(v.id("services"))),
    shelfIds: v.optional(v.array(v.id("shelves"))),
    status: v.string(),
    adminNotes: v.optional(v.string()),
    reviewedAt: v.optional(v.number()),
    shopLayoutConfig: v.optional(v.any()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })),
  handler: async (ctx, args) => {
    const limit = args.limit || 6;
    
    const featuredShops = await ctx.db
      .query("shops")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .order("desc")
      .take(limit);

    return featuredShops;
  },
}); 