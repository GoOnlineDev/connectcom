import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

/**
 * Add an item to the user's cart
 */
export const addToCart = mutation({
  args: {
    itemType: v.string(), // "product" or "service"
    itemId: v.union(v.id("products"), v.id("services")),
    shopId: v.id("shops"),
    quantity: v.number(),
    serviceDetails: v.optional(v.object({
      selectedDate: v.optional(v.string()),
      selectedTime: v.optional(v.string()),
      notes: v.optional(v.string()),
    })),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
    cartId: v.optional(v.id("carts")),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        success: false,
        message: "You must be logged in to add items to your cart",
      };
    }

    const userId = identity.subject;

    // Validate quantity
    if (args.quantity <= 0) {
      return {
        success: false,
        message: "Quantity must be greater than 0",
      };
    }

    // Verify the item exists and get details
    let itemExists = false;
    let availableQuantity: number | undefined;

    if (args.itemType === "product") {
      const product = await ctx.db.get(args.itemId as Id<"products">);
      if (product) {
        itemExists = true;
        availableQuantity = product.quantityAvailable;
      }
    } else if (args.itemType === "service") {
      const service = await ctx.db.get(args.itemId as Id<"services">);
      if (service) {
        itemExists = true;
        // Services typically don't have quantity limits
      }
    }

    if (!itemExists) {
      return {
        success: false,
        message: `${args.itemType === "product" ? "Product" : "Service"} not found`,
      };
    }

    // Check stock availability for products
    if (args.itemType === "product" && availableQuantity !== undefined) {
      if (args.quantity > availableQuantity) {
        return {
          success: false,
          message: `Only ${availableQuantity} items available in stock`,
        };
      }
    }

    // Check if item is already in cart
    const existingCartItem = await ctx.db
      .query("carts")
      .withIndex("by_userId_and_itemId", (q) => 
        q.eq("userId", userId).eq("itemId", args.itemId)
      )
      .unique();

    if (existingCartItem) {
      // Update quantity instead of creating new entry
      const newQuantity = existingCartItem.quantity + args.quantity;
      
      // Check stock for the new total quantity
      if (args.itemType === "product" && availableQuantity !== undefined) {
        if (newQuantity > availableQuantity) {
          return {
            success: false,
            message: `Cannot add ${args.quantity} more. Only ${availableQuantity} items available in stock`,
          };
        }
      }

      await ctx.db.patch(existingCartItem._id, {
        quantity: newQuantity,
        serviceDetails: args.serviceDetails,
        updatedAt: Date.now(),
      });

      return {
        success: true,
        message: "Cart updated successfully",
        cartId: existingCartItem._id,
      };
    }

    // Add new item to cart
    const cartId = await ctx.db.insert("carts", {
      userId,
      itemType: args.itemType,
      itemId: args.itemId,
      shopId: args.shopId,
      quantity: args.quantity,
      serviceDetails: args.serviceDetails,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return {
      success: true,
      message: "Item added to cart",
      cartId,
    };
  },
});

/**
 * Update cart item quantity
 */
export const updateCartQuantity = mutation({
  args: {
    cartId: v.id("carts"),
    quantity: v.number(),
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
        message: "You must be logged in to update your cart",
      };
    }

    const userId = identity.subject;

    // Validate quantity
    if (args.quantity <= 0) {
      return {
        success: false,
        message: "Quantity must be greater than 0",
      };
    }

    // Find the cart item
    const cartItem = await ctx.db.get(args.cartId);
    if (!cartItem || cartItem.userId !== userId) {
      return {
        success: false,
        message: "Cart item not found",
      };
    }

    // Check stock availability for products
    if (cartItem.itemType === "product") {
      const product = await ctx.db.get(cartItem.itemId as Id<"products">);
      if (product && product.quantityAvailable !== undefined) {
        if (args.quantity > product.quantityAvailable) {
          return {
            success: false,
            message: `Only ${product.quantityAvailable} items available in stock`,
          };
        }
      }
    }

    // Update quantity
    await ctx.db.patch(args.cartId, {
      quantity: args.quantity,
      updatedAt: Date.now(),
    });

    return {
      success: true,
      message: "Cart updated successfully",
    };
  },
});

/**
 * Remove an item from the user's cart
 */
export const removeFromCart = mutation({
  args: {
    cartId: v.id("carts"),
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
        message: "You must be logged in to remove items from your cart",
      };
    }

    const userId = identity.subject;

    // Find the cart item
    const cartItem = await ctx.db.get(args.cartId);
    if (!cartItem || cartItem.userId !== userId) {
      return {
        success: false,
        message: "Cart item not found",
      };
    }

    // Remove from cart
    await ctx.db.delete(args.cartId);

    return {
      success: true,
      message: "Item removed from cart",
    };
  },
});

/**
 * Get the user's cart with item details
 */
export const getUserCart = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("carts"),
    _creationTime: v.number(),
    userId: v.string(),
    itemType: v.string(),
    itemId: v.union(v.id("products"), v.id("services")),
    shopId: v.id("shops"),
    quantity: v.number(),
    serviceDetails: v.optional(v.object({
      selectedDate: v.optional(v.string()),
      selectedTime: v.optional(v.string()),
      notes: v.optional(v.string()),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
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
    // Calculated fields
    itemTotal: v.number(), // For products: price * quantity, for services: 0 (contact for pricing)
  })),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const userId = identity.subject;

    // Get cart items
    const cartItems = await ctx.db
      .query("carts")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    // Fetch item and shop details for each cart item
    const cartWithDetails = await Promise.all(
      cartItems.map(async (item) => {
        let itemDetails;
        let itemTotal = 0;
        
        if (item.itemType === "product") {
          itemDetails = await ctx.db.get(item.itemId as Id<"products">);
          if (itemDetails) {
            itemTotal = itemDetails.price * item.quantity;
          }
        } else {
          itemDetails = await ctx.db.get(item.itemId as Id<"services">);
          // Services typically require contact for pricing
          itemTotal = 0;
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
            itemTotal,
          };
        }
        return null;
      })
    );

    // Filter out null entries (items that no longer exist)
    return cartWithDetails.filter(item => item !== null) as any[];
  },
});

/**
 * Get cart summary (totals, count, etc.)
 */
export const getCartSummary = query({
  args: {},
  returns: v.object({
    totalItems: v.number(),
    totalProducts: v.number(),
    totalServices: v.number(),
    totalAmount: v.number(), // Total for products only (services require contact)
    shopCount: v.number(), // Number of different shops in cart
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        totalItems: 0,
        totalProducts: 0,
        totalServices: 0,
        totalAmount: 0,
        shopCount: 0,
      };
    }

    const userId = identity.subject;

    // Get cart items
    const cartItems = await ctx.db
      .query("carts")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    let totalItems = 0;
    let totalProducts = 0;
    let totalServices = 0;
    let totalAmount = 0;
    const uniqueShops = new Set<string>();

    // Calculate totals
    for (const item of cartItems) {
      totalItems += item.quantity;
      uniqueShops.add(item.shopId);

      if (item.itemType === "product") {
        totalProducts += item.quantity;
        
        // Get product details to calculate total
        const product = await ctx.db.get(item.itemId as Id<"products">);
        if (product) {
          totalAmount += product.price * item.quantity;
        }
      } else {
        totalServices += item.quantity;
      }
    }

    return {
      totalItems,
      totalProducts,
      totalServices,
      totalAmount,
      shopCount: uniqueShops.size,
    };
  },
});

/**
 * Clear the user's entire cart
 */
export const clearCart = mutation({
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
        message: "You must be logged in to clear your cart",
        deletedCount: 0,
      };
    }

    const userId = identity.subject;

    // Get all cart items for the user
    const cartItems = await ctx.db
      .query("carts")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    // Delete all cart items
    await Promise.all(
      cartItems.map(item => ctx.db.delete(item._id))
    );

    return {
      success: true,
      message: `Cleared ${cartItems.length} items from your cart`,
      deletedCount: cartItems.length,
    };
  },
});

/**
 * Get cart count for the user
 */
export const getCartCount = query({
  args: {},
  returns: v.number(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return 0;
    }

    const userId = identity.subject;

    const cartItems = await ctx.db
      .query("carts")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    // Return total quantity of all items
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  },
});

/**
 * Move item from cart to wishlist
 */
export const moveToWishlist = mutation({
  args: {
    cartId: v.id("carts"),
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
        message: "You must be logged in to move items to wishlist",
      };
    }

    const userId = identity.subject;

    // Find the cart item
    const cartItem = await ctx.db.get(args.cartId);
    if (!cartItem || cartItem.userId !== userId) {
      return {
        success: false,
        message: "Cart item not found",
      };
    }

    // Check if item is already in wishlist
    const existingWishlistItem = await ctx.db
      .query("wishlists")
      .withIndex("by_userId_and_itemId", (q) => 
        q.eq("userId", userId).eq("itemId", cartItem.itemId)
      )
      .unique();

    if (existingWishlistItem) {
      // Just remove from cart since it's already in wishlist
      await ctx.db.delete(args.cartId);
      return {
        success: true,
        message: "Item removed from cart (already in wishlist)",
      };
    }

    // Add to wishlist
    await ctx.db.insert("wishlists", {
      userId,
      itemType: cartItem.itemType,
      itemId: cartItem.itemId,
      shopId: cartItem.shopId,
      createdAt: Date.now(),
    });

    // Remove from cart
    await ctx.db.delete(args.cartId);

    return {
      success: true,
      message: "Item moved to wishlist",
    };
  },
}); 