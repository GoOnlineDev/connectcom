import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Initialize default subscription packages
export const initializeSubscriptionPackages = mutation({
  args: {},
  returns: v.array(v.id("subscriptionPackages")),
  handler: async (ctx) => {
    const currentTime = Date.now();
    
    // Check if packages already exist
    const existingPackages = await ctx.db
      .query("subscriptionPackages")
      .collect();
    
    if (existingPackages.length > 0) {
      return existingPackages.map(pkg => pkg._id);
    }

    // Create default packages
    const packages = [
      {
        packageName: "free",
        displayName: "Free",
        description: "Perfect for getting started with your first shop",
        price: 0,
        currency: "USD",
        maxShops: 1,
        maxShelvesPerShop: 3,
        maxItemsPerShelf: 3,
        features: [
          "1 Shop",
          "3 Shelves per shop",
          "3 Items per shelf",
          "Basic shop customization",
          "Community support"
        ],
        isActive: true,
        createdAt: currentTime,
        updatedAt: currentTime,
      },
      {
        packageName: "pro",
        displayName: "Pro",
        description: "Ideal for growing businesses with multiple shops",
        price: 1999, // $19.99 in cents
        currency: "USD",
        maxShops: 2,
        maxShelvesPerShop: 6,
        maxItemsPerShelf: 6,
        features: [
          "2 Shops",
          "6 Shelves per shop",
          "6 Items per shelf",
          "Advanced shop customization",
          "Priority support",
          "Analytics dashboard"
        ],
        isActive: true,
        createdAt: currentTime,
        updatedAt: currentTime,
      },
      {
        packageName: "unlimited",
        displayName: "Unlimited",
        description: "For established businesses needing maximum flexibility",
        price: 4999, // $49.99 in cents
        currency: "USD",
        maxShops: 10,
        maxShelvesPerShop: 10,
        maxItemsPerShelf: 10,
        features: [
          "Up to 10 Shops",
          "Up to 10 Shelves per shop",
          "Up to 10 Items per shelf",
          "Full shop customization",
          "Premium support",
          "Advanced analytics",
          "Custom branding options"
        ],
        isActive: true,
        createdAt: currentTime,
        updatedAt: currentTime,
      }
    ];

    const packageIds = [];
    for (const pkg of packages) {
      const id = await ctx.db.insert("subscriptionPackages", pkg);
      packageIds.push(id);
    }

    return packageIds;
  },
});

// Get all active subscription packages
export const getSubscriptionPackages = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("subscriptionPackages"),
    _creationTime: v.number(),
    packageName: v.string(),
    displayName: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    currency: v.string(),
    maxShops: v.number(),
    maxShelvesPerShop: v.number(),
    maxItemsPerShelf: v.number(),
    features: v.optional(v.array(v.string())),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })),
  handler: async (ctx) => {
    const packages = await ctx.db
      .query("subscriptionPackages")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .collect();

    return packages;
  },
});

// Get package by name
export const getPackageByName = query({
  args: {
    packageName: v.string(),
  },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("subscriptionPackages"),
      _creationTime: v.number(),
      packageName: v.string(),
      displayName: v.string(),
      description: v.optional(v.string()),
      price: v.number(),
      currency: v.string(),
      maxShops: v.number(),
      maxShelvesPerShop: v.number(),
      maxItemsPerShelf: v.number(),
      features: v.optional(v.array(v.string())),
      isActive: v.boolean(),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    const pkg = await ctx.db
      .query("subscriptionPackages")
      .withIndex("by_packageName", (q) => q.eq("packageName", args.packageName))
      .first();

    return pkg;
  },
});

// Check if user can create more shops
export const canUserCreateShop = query({
  args: {
    clerkId: v.string(),
  },
  returns: v.object({
    canCreate: v.boolean(),
    currentShopCount: v.number(),
    maxShops: v.number(),
    packageName: v.string(),
  }),
  handler: async (ctx, args) => {
    // Get user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      return {
        canCreate: false,
        currentShopCount: 0,
        maxShops: 0,
        packageName: "none",
      };
    }

    // Get user's package limits
    const pkg = await ctx.db
      .query("subscriptionPackages")
      .withIndex("by_packageName", (q) => q.eq("packageName", user.subscriptionPackage))
      .first();

    if (!pkg) {
      return {
        canCreate: false,
        currentShopCount: user.shopIds?.length || 0,
        maxShops: 0,
        packageName: user.subscriptionPackage,
      };
    }

    const currentShopCount = user.shopIds?.length || 0;
    const canCreate = currentShopCount < pkg.maxShops;

    return {
      canCreate,
      currentShopCount,
      maxShops: pkg.maxShops,
      packageName: user.subscriptionPackage,
    };
  },
});

// Check if shop can create more shelves
export const canShopCreateShelf = query({
  args: {
    shopId: v.id("shops"),
  },
  returns: v.object({
    canCreate: v.boolean(),
    currentShelfCount: v.number(),
    maxShelves: v.number(),
    packageName: v.string(),
  }),
  handler: async (ctx, args) => {
    // Get shop
    const shop = await ctx.db.get(args.shopId);
    if (!shop) {
      return {
        canCreate: false,
        currentShelfCount: 0,
        maxShelves: 0,
        packageName: "none",
      };
    }

    // Get shop owner
    const owner = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", shop.ownerId))
      .unique();

    if (!owner) {
      return {
        canCreate: false,
        currentShelfCount: 0,
        maxShelves: 0,
        packageName: "none",
      };
    }

    // Get package limits
    const pkg = await ctx.db
      .query("subscriptionPackages")
      .withIndex("by_packageName", (q) => q.eq("packageName", owner.subscriptionPackage))
      .first();

    if (!pkg) {
      return {
        canCreate: false,
        currentShelfCount: 0,
        maxShelves: 0,
        packageName: owner.subscriptionPackage,
      };
    }

    // Count current shelves
    const shelves = await ctx.db
      .query("shelves")
      .withIndex("by_shopId", (q) => q.eq("shopId", args.shopId))
      .collect();

    const currentShelfCount = shelves.length;
    const canCreate = currentShelfCount < pkg.maxShelvesPerShop;

    return {
      canCreate,
      currentShelfCount,
      maxShelves: pkg.maxShelvesPerShop,
      packageName: owner.subscriptionPackage,
    };
  },
});

// Check if shelf can add more items
export const canShelfAddItem = query({
  args: {
    shelfId: v.id("shelves"),
  },
  returns: v.object({
    canAdd: v.boolean(),
    currentItemCount: v.number(),
    maxItems: v.number(),
    packageName: v.string(),
  }),
  handler: async (ctx, args) => {
    // Get shelf
    const shelf = await ctx.db.get(args.shelfId);
    if (!shelf) {
      return {
        canAdd: false,
        currentItemCount: 0,
        maxItems: 0,
        packageName: "none",
      };
    }

    // Get shop
    const shop = await ctx.db.get(shelf.shopId);
    if (!shop) {
      return {
        canAdd: false,
        currentItemCount: 0,
        maxItems: 0,
        packageName: "none",
      };
    }

    // Get shop owner
    const owner = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", shop.ownerId))
      .unique();

    if (!owner) {
      return {
        canAdd: false,
        currentItemCount: 0,
        maxItems: 0,
        packageName: "none",
      };
    }

    // Get package limits
    const pkg = await ctx.db
      .query("subscriptionPackages")
      .withIndex("by_packageName", (q) => q.eq("packageName", owner.subscriptionPackage))
      .first();

    if (!pkg) {
      return {
        canAdd: false,
        currentItemCount: 0,
        maxItems: 0,
        packageName: owner.subscriptionPackage,
      };
    }

    // Count current items on shelf
    const productCount = shelf.productIds?.length || 0;
    const serviceCount = shelf.serviceIds?.length || 0;
    const currentItemCount = productCount + serviceCount;
    
    const canAdd = currentItemCount < pkg.maxItemsPerShelf;

    return {
      canAdd,
      currentItemCount,
      maxItems: pkg.maxItemsPerShelf,
      packageName: owner.subscriptionPackage,
    };
  },
});

// Create a new subscription package
export const createSubscriptionPackage = mutation({
  args: {
    packageName: v.string(),
    displayName: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    currency: v.string(),
    maxShops: v.number(),
    maxShelvesPerShop: v.number(),
    maxItemsPerShelf: v.number(),
    features: v.optional(v.array(v.string())),
    isActive: v.boolean(),
  },
  returns: v.object({
    success: v.boolean(),
    packageId: v.optional(v.id("subscriptionPackages")),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    // Check if package name already exists
    const existingPackage = await ctx.db
      .query("subscriptionPackages")
      .withIndex("by_packageName", (q) => q.eq("packageName", args.packageName))
      .first();

    if (existingPackage) {
      return {
        success: false,
        error: `Package with name "${args.packageName}" already exists`,
      };
    }

    const currentTime = Date.now();

    const packageId = await ctx.db.insert("subscriptionPackages", {
      packageName: args.packageName,
      displayName: args.displayName,
      description: args.description,
      price: args.price,
      currency: args.currency,
      maxShops: args.maxShops,
      maxShelvesPerShop: args.maxShelvesPerShop,
      maxItemsPerShelf: args.maxItemsPerShelf,
      features: args.features,
      isActive: args.isActive,
      createdAt: currentTime,
      updatedAt: currentTime,
    });

    return {
      success: true,
      packageId,
    };
  },
});

// Update an existing subscription package
export const updateSubscriptionPackage = mutation({
  args: {
    packageId: v.id("subscriptionPackages"),
    displayName: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    currency: v.optional(v.string()),
    maxShops: v.optional(v.number()),
    maxShelvesPerShop: v.optional(v.number()),
    maxItemsPerShelf: v.optional(v.number()),
    features: v.optional(v.array(v.string())),
    isActive: v.optional(v.boolean()),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const pkg = await ctx.db.get(args.packageId);
    if (!pkg) {
      return {
        success: false,
        error: "Package not found",
      };
    }

    const updates: any = {
      updatedAt: Date.now(),
    };

    if (args.displayName !== undefined) updates.displayName = args.displayName;
    if (args.description !== undefined) updates.description = args.description;
    if (args.price !== undefined) updates.price = args.price;
    if (args.currency !== undefined) updates.currency = args.currency;
    if (args.maxShops !== undefined) updates.maxShops = args.maxShops;
    if (args.maxShelvesPerShop !== undefined) updates.maxShelvesPerShop = args.maxShelvesPerShop;
    if (args.maxItemsPerShelf !== undefined) updates.maxItemsPerShelf = args.maxItemsPerShelf;
    if (args.features !== undefined) updates.features = args.features;
    if (args.isActive !== undefined) updates.isActive = args.isActive;

    await ctx.db.patch(args.packageId, updates);

    return {
      success: true,
    };
  },
});

// Get subscription statistics
export const getSubscriptionStatistics = query({
  args: {},
  returns: v.object({
    totalUsers: v.number(),
    freeUsers: v.number(),
    proUsers: v.number(),
    unlimitedUsers: v.number(),
    totalRevenue: v.number(),
    packageDistribution: v.array(v.object({
      packageName: v.string(),
      count: v.number(),
      percentage: v.number(),
    })),
  }),
  handler: async (ctx) => {
    // Get all users
    const allUsers = await ctx.db.query("users").collect();
    
    const totalUsers = allUsers.length;
    const freeUsers = allUsers.filter(u => u.subscriptionPackage === "free").length;
    const proUsers = allUsers.filter(u => u.subscriptionPackage === "pro").length;
    const unlimitedUsers = allUsers.filter(u => u.subscriptionPackage === "unlimited").length;

    // Get packages for revenue calculation
    const packages = await ctx.db.query("subscriptionPackages").collect();
    const packagePrices = packages.reduce((acc, pkg) => {
      acc[pkg.packageName] = pkg.price;
      return acc;
    }, {} as Record<string, number>);

    // Calculate total revenue (monthly)
    const totalRevenue = allUsers.reduce((sum, user) => {
      const price = packagePrices[user.subscriptionPackage] || 0;
      return sum + price;
    }, 0);

    // Package distribution
    const packageCounts = allUsers.reduce((acc, user) => {
      acc[user.subscriptionPackage] = (acc[user.subscriptionPackage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const packageDistribution = Object.entries(packageCounts).map(([packageName, count]) => ({
      packageName,
      count,
      percentage: totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0,
    }));

    return {
      totalUsers,
      freeUsers,
      proUsers,
      unlimitedUsers,
      totalRevenue,
      packageDistribution,
    };
  },
});