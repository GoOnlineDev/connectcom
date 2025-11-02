import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { QueryCtx, MutationCtx } from "./_generated/server";

/**
 * Middleware to check authentication
 */
const withAuth = async (ctx: QueryCtx | MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
    .unique();
  if (!user) {
    throw new Error("User not found");
  }
  return { identity, user };
};

/**
 * Create a notification
 */
export const createNotification = mutation({
  args: {
    userId: v.string(), // Clerk user ID of recipient
    type: v.string(), // "message", "shop_update", "review", "order", "system"
    title: v.string(),
    message: v.string(),
    link: v.optional(v.string()),
    relatedId: v.optional(v.string()),
    relatedType: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  returns: v.id("notifications"),
  handler: async (ctx, args) => {
    const notificationId = await ctx.db.insert("notifications", {
      userId: args.userId,
      type: args.type,
      title: args.title,
      message: args.message,
      isRead: false,
      link: args.link,
      relatedId: args.relatedId,
      relatedType: args.relatedType,
      metadata: args.metadata,
      createdAt: Date.now(),
    });
    
    return notificationId;
  },
});

/**
 * Get user's notifications
 */
export const getUserNotifications = query({
  args: {
    limit: v.optional(v.number()),
    unreadOnly: v.optional(v.boolean()),
  },
  returns: v.array(v.object({
    _id: v.id("notifications"),
    type: v.string(),
    title: v.string(),
    message: v.string(),
    isRead: v.boolean(),
    link: v.optional(v.string()),
    relatedId: v.optional(v.string()),
    relatedType: v.optional(v.string()),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  })),
  handler: async (ctx, args) => {
    const { identity } = await withAuth(ctx);
    
    const limit = args.limit || 50;
    const unreadOnly = args.unreadOnly || false;
    
    let query = ctx.db
      .query("notifications")
      .withIndex("by_userId_and_created", (q) => q.eq("userId", identity.subject))
      .order("desc");
    
    if (unreadOnly) {
      const allNotifications = await query.collect();
      const filtered = allNotifications
        .filter(n => !n.isRead)
        .slice(0, limit);
      
      // Map to explicit fields to avoid _creationTime
      return filtered.map(n => ({
        _id: n._id,
        type: n.type,
        title: n.title,
        message: n.message,
        isRead: n.isRead,
        link: n.link,
        relatedId: n.relatedId,
        relatedType: n.relatedType,
        metadata: n.metadata,
        createdAt: n.createdAt,
      }));
    }
    
    const notifications = await query.take(limit);
    
    // Map to explicit fields to avoid _creationTime
    return notifications.map(n => ({
      _id: n._id,
      type: n.type,
      title: n.title,
      message: n.message,
      isRead: n.isRead,
      link: n.link,
      relatedId: n.relatedId,
      relatedType: n.relatedType,
      metadata: n.metadata,
      createdAt: n.createdAt,
    }));
  },
});

/**
 * Get unread notification count
 */
export const getUnreadCount = query({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const { identity } = await withAuth(ctx);
    
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_userId_and_isRead", (q) => 
        q.eq("userId", identity.subject).eq("isRead", false)
      )
      .collect();
    
    return notifications.length;
  },
});

/**
 * Mark notification as read
 */
export const markAsRead = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { identity } = await withAuth(ctx);
    
    const notification = await ctx.db.get(args.notificationId);
    
    if (!notification) {
      throw new Error("Notification not found");
    }
    
    if (notification.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }
    
    await ctx.db.patch(args.notificationId, {
      isRead: true,
    });
    
    return null;
  },
});

/**
 * Mark all notifications as read
 */
export const markAllAsRead = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const { identity } = await withAuth(ctx);
    
    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_userId_and_isRead", (q) => 
        q.eq("userId", identity.subject).eq("isRead", false)
      )
      .collect();
    
    for (const notification of unreadNotifications) {
      await ctx.db.patch(notification._id, {
        isRead: true,
      });
    }
    
    return null;
  },
});

/**
 * Delete a notification
 */
export const deleteNotification = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { identity } = await withAuth(ctx);
    
    const notification = await ctx.db.get(args.notificationId);
    
    if (!notification) {
      throw new Error("Notification not found");
    }
    
    if (notification.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }
    
    await ctx.db.delete(args.notificationId);
    
    return null;
  },
});

/**
 * Clear all read notifications
 */
export const clearReadNotifications = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const { identity } = await withAuth(ctx);
    
    const readNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .collect();
    
    for (const notification of readNotifications) {
      if (notification.isRead) {
        await ctx.db.delete(notification._id);
      }
    }
    
    return null;
  },
});

