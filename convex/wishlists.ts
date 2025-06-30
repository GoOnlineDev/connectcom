import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

/**
 * Add an item to the user's wishlist
 */
export const addToWishlist = mutation({
  args: {
    itemType: v.string(), // "product" or "service"
    itemId: v.union(v.id("products"), v.id("services")),
    shopId: v.id("shops"),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
    wishlistId: v.optional(v.id("wishlists")),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        success: false,
        message: "You must be logged in to add items to your wishlist",
      };
    }

    const userId = identity.subject;

    // Check if item is already in wishlist
    const existingWishlistItem = await ctx.db
      .query("wishlists")
      .withIndex("by_userId_and_itemId", (q) => 
        q.eq("userId", userId).eq("itemId", args.itemId)
      )
      .unique();

    if (existingWishlistItem) {
      return {
        success: false,
        message: "Item is already in your wishlist",
      };
    }

    // Verify the item exists
    if (args.itemType === "product") {
      const product = await ctx.db.get(args.itemId as Id<"products">);
      if (!product) {
        return {
          success: false,
          message: "Product not found",
        };
      }
    } else if (args.itemType === "service") {
      const service = await ctx.db.get(args.itemId as Id<"services">);
      if (!service) {
        return {
          success: false,
          message: "Service not found",
        };
      }
    } else {
      return {
        success: false,
        message: "Invalid item type",
      };
    }

    // Add to wishlist
    const wishlistId = await ctx.db.insert("wishlists", {
      userId,
      itemType: args.itemType,
      itemId: args.itemId,
      shopId: args.shopId,
      createdAt: Date.now(),
    });

    return {
      success: true,
      message: "Item added to wishlist",
      wishlistId,
    };
  },
});

/**
 * Remove an item from the user's wishlist
 */
export const removeFromWishlist = mutation({
  args: {
    itemId: v.union(v.id("products"), v.id("services")),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        success: false,
        message: "You must be logged in to remove items from your wishlist",
      };
    }

    const userId = identity.subject;

    // Find the wishlist item
    const wishlistItem = await ctx.db
      .query("wishlists")
      .withIndex("by_userId_and_itemId", (q) => 
        q.eq("userId", userId).eq("itemId", args.itemId)
      )
      .unique();

    if (!wishlistItem) {
      return {
        success: false,
        message: "Item not found in your wishlist",
      };
    }

    // Remove from wishlist
    await ctx.db.delete(wishlistItem._id);

    return {
      success: true,
      message: "Item removed from wishlist",
    };
  },
});

/**
 * Get the user's wishlist with item details
 */
export const getUserWishlist = query({
  args: {
    itemType: v.optional(v.string()), // Filter by "product" or "service"
  },
  returns: v.array(v.object({
    _id: v.id("wishlists"),
    _creationTime: v.number(),
    userId: v.string(),
    itemType: v.string(),
    itemId: v.union(v.id("products"), v.id("services")),
    shopId: v.id("shops"),
    createdAt: v.number(),
    // Item details
    itemDetails: v.union(
      v.object({
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
      }),
      v.object({
        _id: v.id("services"),
        _creationTime: v.number(),
        shopId: v.id("shops"),
        name: v.string(),
        description: v.optional(v.string()),
        duration: v.optional(v.any()),
        pricing: v.optional(v.any()),
        bookingInfo: v.optional(v.any()),
        updatedAt: v.number(),
      })
    ),
    // Shop details
    shopDetails: v.object({
      _id: v.id("shops"),
      shopName: v.string(),
      shopLogoUrl: v.optional(v.string()),
      shopType: v.string(),
    }),
  })),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const userId = identity.subject;

    // Get wishlist items
    let wishlistQuery = ctx.db
      .query("wishlists")
      .withIndex("by_userId", (q) => q.eq("userId", userId));

    if (args.itemType) {
      wishlistQuery = ctx.db
        .query("wishlists")
        .withIndex("by_userId_and_itemType", (q) => 
          q.eq("userId", userId).eq("itemType", args.itemType!)
        );
    }

    const wishlistItems = await wishlistQuery.collect();

    // Fetch item and shop details for each wishlist item
    const wishlistWithDetails = await Promise.all(
      wishlistItems.map(async (item) => {
        let itemDetails;
        
        if (item.itemType === "product") {
          itemDetails = await ctx.db.get(item.itemId as Id<"products">);
        } else {
          itemDetails = await ctx.db.get(item.itemId as Id<"services">);
        }

        const shopDetails = await ctx.db.get(item.shopId);

        // Only return items where both item and shop still exist
        if (itemDetails && shopDetails) {
          return {
            ...item,
            itemDetails,
            shopDetails: {
              _id: shopDetails._id,
              shopName: shopDetails.shopName,
              shopLogoUrl: shopDetails.shopLogoUrl,
              shopType: shopDetails.shopType,
            },
          };
        }
        return null;
      })
    );

    // Filter out null entries (items that no longer exist)
    return wishlistWithDetails.filter(item => item !== null) as any[];
  },
});

/**
 * Check if an item is in the user's wishlist
 */
export const isInWishlist = query({
  args: {
    itemId: v.union(v.id("products"), v.id("services")),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return false;
    }

    const userId = identity.subject;

    const wishlistItem = await ctx.db
      .query("wishlists")
      .withIndex("by_userId_and_itemId", (q) => 
        q.eq("userId", userId).eq("itemId", args.itemId)
      )
      .unique();

    return !!wishlistItem;
  },
});

/**
 * Clear the user's entire wishlist
 */
export const clearWishlist = mutation({
  args: {},
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
    deletedCount: v.number(),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        success: false,
        message: "You must be logged in to clear your wishlist",
        deletedCount: 0,
      };
    }

    const userId = identity.subject;

    // Get all wishlist items for the user
    const wishlistItems = await ctx.db
      .query("wishlists")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    // Delete all wishlist items
    await Promise.all(
      wishlistItems.map(item => ctx.db.delete(item._id))
    );

    return {
      success: true,
      message: `Cleared ${wishlistItems.length} items from your wishlist`,
      deletedCount: wishlistItems.length,
    };
  },
});

/**
 * Get wishlist count for the user
 */
export const getWishlistCount = query({
  args: {},
  returns: v.number(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return 0;
    }

    const userId = identity.subject;

    const wishlistItems = await ctx.db
      .query("wishlists")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    return wishlistItems.length;
  },
}); 