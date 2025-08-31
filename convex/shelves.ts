import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Create a new shelf
export const createShelf = mutation({
  args: {
    shopId: v.id("shops"),
    shelfName: v.string(),
    shelfDescription: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    shelfId: v.optional(v.id("shelves")),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    // Get shop
    const shop = await ctx.db.get(args.shopId);
    if (!shop) {
      return {
        success: false,
        error: "Shop not found",
      };
    }

    // Get shop owner
    const owner = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", shop.ownerId))
      .unique();

    if (!owner) {
      return {
        success: false,
        error: "Shop owner not found",
      };
    }

    // Get package limits
    const pkg = await ctx.db
      .query("subscriptionPackages")
      .withIndex("by_packageName", (q) => q.eq("packageName", owner.subscriptionPackage))
      .first();

    if (!pkg) {
      return {
        success: false,
        error: "Subscription package not found",
      };
    }

    // Count current shelves
    const currentShelves = await ctx.db
      .query("shelves")
      .withIndex("by_shopId", (q) => q.eq("shopId", args.shopId))
      .collect();

    if (currentShelves.length >= pkg.maxShelvesPerShop) {
      return {
        success: false,
        error: `Maximum shelves limit reached (${pkg.maxShelvesPerShop} shelves allowed for ${pkg.displayName} package)`,
      };
    }

    // Create shelf
    const currentTime = Date.now();
    const nextOrder = currentShelves.length + 1;

    const shelfId = await ctx.db.insert("shelves", {
      shopId: args.shopId,
      shelfName: args.shelfName,
      shelfDescription: args.shelfDescription,
      shelfOrder: nextOrder,
      productIds: [],
      serviceIds: [],
      createdAt: currentTime,
      updatedAt: currentTime,
    });

    // Update shop with new shelf ID
    const updatedShelfIds = [...(shop.shelfIds || []), shelfId];
    await ctx.db.patch(args.shopId, {
      shelfIds: updatedShelfIds,
      updatedAt: currentTime,
    });

    return {
      success: true,
      shelfId,
    };
  },
});

// Get shelves for a shop
export const getShopShelves = query({
  args: {
    shopId: v.id("shops"),
  },
  returns: v.array(v.object({
    _id: v.id("shelves"),
    _creationTime: v.number(),
    shopId: v.id("shops"),
    shelfName: v.string(),
    shelfDescription: v.optional(v.string()),
    shelfOrder: v.number(),
    productIds: v.optional(v.array(v.id("products"))),
    serviceIds: v.optional(v.array(v.id("services"))),
    createdAt: v.number(),
    updatedAt: v.number(),
  })),
  handler: async (ctx, args) => {
    const shelves = await ctx.db
      .query("shelves")
      .withIndex("by_shopId", (q) => q.eq("shopId", args.shopId))
      .collect();

    // Sort by shelf order
    return shelves.sort((a, b) => a.shelfOrder - b.shelfOrder);
  },
});

// Get shelf with its items
export const getShelfWithItems = query({
  args: {
    shelfId: v.id("shelves"),
  },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("shelves"),
      _creationTime: v.number(),
      shopId: v.id("shops"),
      shelfName: v.string(),
      shelfDescription: v.optional(v.string()),
      shelfOrder: v.number(),
      productIds: v.optional(v.array(v.id("products"))),
      serviceIds: v.optional(v.array(v.id("services"))),
      createdAt: v.number(),
      updatedAt: v.number(),
      products: v.array(v.object({
        _id: v.id("products"),
        _creationTime: v.number(),
        shopId: v.id("shops"),
        shelfId: v.optional(v.id("shelves")),
        shelfOrder: v.optional(v.number()),
        name: v.string(),
        description: v.optional(v.string()),
        imageUrls: v.optional(v.array(v.string())),
        price: v.number(),
        quantityAvailable: v.optional(v.number()),
        tags: v.optional(v.array(v.string())),
        createdAt: v.number(),
        updatedAt: v.number(),
      })),
      services: v.array(v.object({
        _id: v.id("services"),
        _creationTime: v.number(),
        shopId: v.id("shops"),
        shelfId: v.optional(v.id("shelves")),
        shelfOrder: v.optional(v.number()),
        name: v.string(),
        description: v.optional(v.string()),
        duration: v.optional(v.any()),
        pricing: v.optional(v.any()),
        bookingInfo: v.optional(v.any()),
        createdAt: v.number(),
        updatedAt: v.number(),
      })),
    })
  ),
  handler: async (ctx, args) => {
    const shelf = await ctx.db.get(args.shelfId);
    if (!shelf) return null;

    // Get products on this shelf
    const products = await ctx.db
      .query("products")
      .withIndex("by_shelfId", (q) => q.eq("shelfId", args.shelfId))
      .collect();

    // Get services on this shelf
    const services = await ctx.db
      .query("services")
      .withIndex("by_shelfId", (q) => q.eq("shelfId", args.shelfId))
      .collect();

    // Sort by shelf order
    const sortedProducts = products.sort((a, b) => (a.shelfOrder || 0) - (b.shelfOrder || 0));
    const sortedServices = services.sort((a, b) => (a.shelfOrder || 0) - (b.shelfOrder || 0));

    return {
      ...shelf,
      products: sortedProducts,
      services: sortedServices,
    };
  },
});

// Update shelf details
export const updateShelf = mutation({
  args: {
    shelfId: v.id("shelves"),
    shelfName: v.optional(v.string()),
    shelfDescription: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const shelf = await ctx.db.get(args.shelfId);
    if (!shelf) {
      return {
        success: false,
        error: "Shelf not found",
      };
    }

    const updates: any = {
      updatedAt: Date.now(),
    };

    if (args.shelfName !== undefined) {
      updates.shelfName = args.shelfName;
    }

    if (args.shelfDescription !== undefined) {
      updates.shelfDescription = args.shelfDescription;
    }

    await ctx.db.patch(args.shelfId, updates);

    return {
      success: true,
    };
  },
});

// Delete shelf
export const deleteShelf = mutation({
  args: {
    shelfId: v.id("shelves"),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const shelf = await ctx.db.get(args.shelfId);
    if (!shelf) {
      return {
        success: false,
        error: "Shelf not found",
      };
    }

    // Check if shelf has items
    const products = await ctx.db
      .query("products")
      .withIndex("by_shelfId", (q) => q.eq("shelfId", args.shelfId))
      .collect();

    const services = await ctx.db
      .query("services")
      .withIndex("by_shelfId", (q) => q.eq("shelfId", args.shelfId))
      .collect();

    if (products.length > 0 || services.length > 0) {
      return {
        success: false,
        error: "Cannot delete shelf that contains items. Please move or delete all items first.",
      };
    }

    // Remove shelf from shop
    const shop = await ctx.db.get(shelf.shopId);
    if (shop && shop.shelfIds) {
      const updatedShelfIds = shop.shelfIds.filter(id => id !== args.shelfId);
      await ctx.db.patch(shelf.shopId, {
        shelfIds: updatedShelfIds,
        updatedAt: Date.now(),
      });
    }

    // Delete shelf
    await ctx.db.delete(args.shelfId);

    return {
      success: true,
    };
  },
});

// Reorder shelves
export const reorderShelves = mutation({
  args: {
    shopId: v.id("shops"),
    shelfOrders: v.array(v.object({
      shelfId: v.id("shelves"),
      newOrder: v.number(),
    })),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const currentTime = Date.now();

    for (const { shelfId, newOrder } of args.shelfOrders) {
      const shelf = await ctx.db.get(shelfId);
      if (!shelf || shelf.shopId !== args.shopId) {
        return {
          success: false,
          error: `Shelf ${shelfId} not found or doesn't belong to this shop`,
        };
      }

      await ctx.db.patch(shelfId, {
        shelfOrder: newOrder,
        updatedAt: currentTime,
      });
    }

    return {
      success: true,
    };
  },
});

// Get shelf by ID
export const getShelfById = query({
  args: {
    shelfId: v.id("shelves"),
  },
  returns: v.union(v.null(), v.object({
    _id: v.id("shelves"),
    _creationTime: v.number(),
    shopId: v.id("shops"),
    shelfName: v.string(),
    shelfDescription: v.optional(v.string()),
    shelfOrder: v.number(),
    productIds: v.optional(v.array(v.id("products"))),
    serviceIds: v.optional(v.array(v.id("services"))),
    createdAt: v.number(),
    updatedAt: v.number(),
  })),
  handler: async (ctx, args) => {
    const shelf = await ctx.db.get(args.shelfId);
    return shelf;
  },
}); 