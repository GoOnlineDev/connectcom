import { mutation, query, internalAction, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";

/**
 * Create a new order from cart items
 */
export const createOrder = mutation({
  args: {
    shopId: v.id("shops"),
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
    deliveryAddress: v.string(),
    deliveryCity: v.string(),
    deliveryNotes: v.optional(v.string()),
    customerNotes: v.optional(v.string()),
    paymentMethod: v.optional(v.string()),
    cartItemIds: v.array(v.id("carts")), // Array of cart item IDs to include in this order
  },
  returns: v.object({
    success: v.boolean(),
    orderId: v.optional(v.id("orders")),
    orderNumber: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        success: false,
        error: "You must be logged in to place an order",
      };
    }

    const userId = identity.subject;

    // Verify shop exists
    const shop = await ctx.db.get(args.shopId);
    if (!shop) {
      return {
        success: false,
        error: "Shop not found",
      };
    }

    // Get cart items
    const cartItems = [];
    for (const cartId of args.cartItemIds) {
      const cartItem = await ctx.db.get(cartId);
      if (!cartItem) {
        return {
          success: false,
          error: `Cart item ${cartId} not found`,
        };
      }
      if (cartItem.userId !== userId) {
        return {
          success: false,
          error: "Unauthorized: This cart item does not belong to you",
        };
      }
      if (cartItem.shopId !== args.shopId) {
        return {
          success: false,
          error: "All items in an order must be from the same shop",
        };
      }
      cartItems.push(cartItem);
    }

    if (cartItems.length === 0) {
      return {
        success: false,
        error: "No items selected for order",
      };
    }

    // Build order items and calculate totals
    const orderItems = [];
    let subtotal = 0;

    for (const cartItem of cartItems) {
      // Get item details
      let itemName = "";
      let itemPrice = 0;

      if (cartItem.itemType === "product") {
        const product = await ctx.db.get(cartItem.itemId as Id<"products">);
        if (!product) {
          return {
            success: false,
            error: `Product ${cartItem.itemId} not found`,
          };
        }
        itemName = product.name;
        itemPrice = product.price || 0;
      } else {
        const service = await ctx.db.get(cartItem.itemId as Id<"services">);
        if (!service) {
          return {
            success: false,
            error: `Service ${cartItem.itemId} not found`,
          };
        }
        itemName = service.name;
        // Services might not have a fixed price, use 0 or a default
        itemPrice = 0;
      }

      const itemTotal = itemPrice * cartItem.quantity;
      subtotal += itemTotal;

      orderItems.push({
        itemType: cartItem.itemType,
        itemId: cartItem.itemId,
        itemName,
        quantity: cartItem.quantity,
        price: itemPrice,
        total: itemTotal,
        serviceDetails: cartItem.serviceDetails,
      });
    }

    // Generate unique order number
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    const orderNumber = `ORD-${new Date(timestamp).toISOString().split("T")[0].replace(/-/g, "")}-${random}`;

    // Create the order
    const currentTime = Date.now();
    const orderId = await ctx.db.insert("orders", {
      userId,
      shopId: args.shopId,
      orderNumber,
      status: "pending",
      customerName: args.customerName,
      customerEmail: args.customerEmail,
      customerPhone: args.customerPhone,
      deliveryAddress: args.deliveryAddress,
      deliveryCity: args.deliveryCity,
      deliveryNotes: args.deliveryNotes,
      items: orderItems,
      subtotal,
      totalAmount: subtotal, // Can be extended to include shipping, taxes, etc.
      paymentMethod: args.paymentMethod || "pending",
      paymentStatus: "pending",
      customerNotes: args.customerNotes,
      createdAt: currentTime,
      updatedAt: currentTime,
    });

    // Schedule email notification to shop owner
    await ctx.scheduler.runAfter(0, internal.orders.sendOrderEmailToShopOwner, {
      orderId,
    });

    // Remove cart items after successful order creation
    for (const cartId of args.cartItemIds) {
      await ctx.db.delete(cartId);
    }

    return {
      success: true,
      orderId,
      orderNumber,
    };
  },
});

/**
 * Get all orders for the current user
 */
export const getUserOrders = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("orders"),
      _creationTime: v.number(),
      orderNumber: v.string(),
      status: v.string(),
      shopId: v.id("shops"),
      shopName: v.string(),
      totalAmount: v.number(),
      itemCount: v.number(),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const userId = identity.subject;

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    // Enrich with shop names
    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const shop = await ctx.db.get(order.shopId);
        return {
          _id: order._id,
          _creationTime: order._creationTime,
          orderNumber: order.orderNumber,
          status: order.status,
          shopId: order.shopId,
          shopName: shop?.shopName || "Unknown Shop",
          totalAmount: order.totalAmount,
          itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
          createdAt: order.createdAt,
        };
      })
    );

    return enrichedOrders;
  },
});

/**
 * Get order details by ID
 */
export const getOrderById = query({
  args: {
    orderId: v.id("orders"),
  },
  returns: v.union(
    v.object({
      _id: v.id("orders"),
      _creationTime: v.number(),
      orderNumber: v.string(),
      status: v.string(),
      shopId: v.id("shops"),
      shopName: v.string(),
      customerName: v.string(),
      customerEmail: v.string(),
      customerPhone: v.string(),
      deliveryAddress: v.string(),
      deliveryCity: v.string(),
      deliveryNotes: v.optional(v.string()),
      items: v.array(
        v.object({
          itemType: v.string(),
          itemId: v.union(v.id("products"), v.id("services")),
          itemName: v.string(),
          quantity: v.number(),
          price: v.number(),
          total: v.number(),
          serviceDetails: v.optional(
            v.object({
              selectedDate: v.optional(v.string()),
              selectedTime: v.optional(v.string()),
              notes: v.optional(v.string()),
            })
          ),
        })
      ),
      subtotal: v.number(),
      totalAmount: v.number(),
      paymentMethod: v.optional(v.string()),
      paymentStatus: v.optional(v.string()),
      customerNotes: v.optional(v.string()),
      shopNotes: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const order = await ctx.db.get(args.orderId);
    if (!order) {
      return null;
    }

    // Check if user is authorized (either the customer or the shop owner)
    const userId = identity.subject;
    const shop = await ctx.db.get(order.shopId);
    
    if (order.userId !== userId && shop?.ownerId !== userId) {
      return null; // Unauthorized
    }

    return {
      _id: order._id,
      _creationTime: order._creationTime,
      orderNumber: order.orderNumber,
      status: order.status,
      shopId: order.shopId,
      shopName: shop?.shopName || "Unknown Shop",
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      deliveryAddress: order.deliveryAddress,
      deliveryCity: order.deliveryCity,
      deliveryNotes: order.deliveryNotes,
      items: order.items,
      subtotal: order.subtotal,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      customerNotes: order.customerNotes,
      shopNotes: order.shopNotes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  },
});

/**
 * Get all orders for a shop (for shop owners)
 */
export const getShopOrders = query({
  args: {
    shopId: v.id("shops"),
  },
  returns: v.array(
    v.object({
      _id: v.id("orders"),
      _creationTime: v.number(),
      orderNumber: v.string(),
      status: v.string(),
      customerName: v.string(),
      customerEmail: v.string(),
      customerPhone: v.string(),
      totalAmount: v.number(),
      itemCount: v.number(),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const userId = identity.subject;

    // Verify user owns the shop
    const shop = await ctx.db.get(args.shopId);
    if (!shop || shop.ownerId !== userId) {
      return [];
    }

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_shopId", (q) => q.eq("shopId", args.shopId))
      .order("desc")
      .collect();

    return orders.map((order) => ({
      _id: order._id,
      _creationTime: order._creationTime,
      orderNumber: order.orderNumber,
      status: order.status,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      totalAmount: order.totalAmount,
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
      createdAt: order.createdAt,
    }));
  },
});

/**
 * Get all orders for all shops owned by the current user
 */
export const getAllVendorOrders = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("orders"),
      _creationTime: v.number(),
      orderNumber: v.string(),
      status: v.string(),
      shopId: v.id("shops"),
      shopName: v.string(),
      customerName: v.string(),
      customerEmail: v.string(),
      customerPhone: v.string(),
      totalAmount: v.number(),
      itemCount: v.number(),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const userId = identity.subject;

    // Get all shops owned by the user
    const shops = await ctx.db
      .query("shops")
      .withIndex("by_ownerId", (q) => q.eq("ownerId", userId))
      .collect();

    if (shops.length === 0) {
      return [];
    }

    // Get all orders for all shops
    const allOrders = [];
    for (const shop of shops) {
      const orders = await ctx.db
        .query("orders")
        .withIndex("by_shopId", (q) => q.eq("shopId", shop._id))
        .order("desc")
        .collect();

      for (const order of orders) {
        allOrders.push({
          _id: order._id,
          _creationTime: order._creationTime,
          orderNumber: order.orderNumber,
          status: order.status,
          shopId: shop._id,
          shopName: shop.shopName,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone,
          totalAmount: order.totalAmount,
          itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
          createdAt: order.createdAt,
        });
      }
    }

    // Sort by creation time descending
    return allOrders.sort((a, b) => b.createdAt - a.createdAt);
  },
});

/**
 * Update order status (for shop owners)
 */
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.string(),
    shopNotes: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        success: false,
        error: "You must be logged in to update order status",
      };
    }

    const userId = identity.subject;

    const order = await ctx.db.get(args.orderId);
    if (!order) {
      return {
        success: false,
        error: "Order not found",
      };
    }

    // Verify user owns the shop
    const shop = await ctx.db.get(order.shopId);
    if (!shop || shop.ownerId !== userId) {
      return {
        success: false,
        error: "Unauthorized: You do not own this shop",
      };
    }

    const update: any = {
      status: args.status,
      updatedAt: Date.now(),
    };

    if (args.shopNotes !== undefined) {
      update.shopNotes = args.shopNotes;
    }

    await ctx.db.patch(args.orderId, update);

    return {
      success: true,
    };
  },
});

/**
 * Internal action to send order email to shop owner
 */
export const sendOrderEmailToShopOwner = internalAction({
  args: {
    orderId: v.id("orders"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const order = await ctx.runQuery(internal.orders.getOrderForEmail, {
      orderId: args.orderId,
    });

    if (!order) {
      console.error(`Order ${args.orderId} not found for email`);
      return null;
    }

    // Call the API route to send email
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/send-email/order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderNumber: order.orderNumber,
            shopName: order.shopName,
            shopOwnerEmail: order.shopOwnerEmail,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            customerPhone: order.customerPhone,
            deliveryAddress: order.deliveryAddress,
            deliveryCity: order.deliveryCity,
            deliveryNotes: order.deliveryNotes,
            items: order.items,
            subtotal: order.subtotal,
            totalAmount: order.totalAmount,
            paymentMethod: order.paymentMethod,
            customerNotes: order.customerNotes,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.error("Failed to send order email:", error);
      } else {
        console.log(`Order email sent to shop owner for order ${order.orderNumber}`);
      }
    } catch (error) {
      console.error("Error calling order email API:", error);
    }

    return null;
  },
});

/**
 * Internal query to get order data for email
 */
export const getOrderForEmail = internalQuery({
  args: {
    orderId: v.id("orders"),
  },
  returns: v.union(
    v.object({
      orderNumber: v.string(),
      shopName: v.string(),
      shopOwnerEmail: v.string(),
      customerName: v.string(),
      customerEmail: v.string(),
      customerPhone: v.string(),
      deliveryAddress: v.string(),
      deliveryCity: v.string(),
      deliveryNotes: v.optional(v.string()),
      items: v.array(
        v.object({
          itemType: v.string(),
          itemName: v.string(),
          quantity: v.number(),
          price: v.number(),
          total: v.number(),
          serviceDetails: v.optional(
            v.object({
              selectedDate: v.optional(v.string()),
              selectedTime: v.optional(v.string()),
              notes: v.optional(v.string()),
            })
          ),
        })
      ),
      subtotal: v.number(),
      totalAmount: v.number(),
      paymentMethod: v.optional(v.string()),
      customerNotes: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) {
      return null;
    }

    const shop = await ctx.db.get(order.shopId);
    if (!shop) {
      return null;
    }

    // Get shop owner email
    const owner = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", shop.ownerId))
      .unique();

    if (!owner) {
      return null;
    }

    return {
      orderNumber: order.orderNumber,
      shopName: shop.shopName,
      shopOwnerEmail: owner.email,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      deliveryAddress: order.deliveryAddress,
      deliveryCity: order.deliveryCity,
      deliveryNotes: order.deliveryNotes,
      items: order.items.map((item) => ({
        itemType: item.itemType,
        itemName: item.itemName,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
        serviceDetails: item.serviceDetails,
      })),
      subtotal: order.subtotal,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      customerNotes: order.customerNotes,
    };
  },
});

