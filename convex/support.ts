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
 * Create a support ticket
 */
export const createSupportTicket = mutation({
  args: {
    subject: v.string(),
    message: v.string(),
    category: v.string(),
    priority: v.optional(v.string()),
  },
  returns: v.id("supportTickets"),
  handler: async (ctx, args) => {
    const { identity } = await withAuth(ctx);
    
    if (!args.subject.trim() || !args.message.trim()) {
      throw new Error("Subject and message are required");
    }
    
    const validCategories = ["general", "technical", "billing", "feature_request", "bug_report"];
    if (!validCategories.includes(args.category)) {
      throw new Error(`Invalid category. Must be one of: ${validCategories.join(", ")}`);
    }
    
    const currentTime = Date.now();
    const ticketId = await ctx.db.insert("supportTickets", {
      userId: identity.subject,
      subject: args.subject.trim(),
      message: args.message.trim(),
      category: args.category,
      status: "open",
      priority: args.priority || "medium",
      createdAt: currentTime,
      updatedAt: currentTime,
    });
    
    return ticketId;
  },
});

/**
 * Get user's support tickets
 */
export const getUserTickets = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("supportTickets"),
    subject: v.string(),
    message: v.string(),
    category: v.string(),
    status: v.string(),
    priority: v.optional(v.string()),
    adminNotes: v.optional(v.string()),
    resolvedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })),
  handler: async (ctx) => {
    const { identity } = await withAuth(ctx);
    
    const tickets = await ctx.db
      .query("supportTickets")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();
    
    return tickets;
  },
});

/**
 * Get all support tickets (admin only)
 */
export const getAllTickets = query({
  args: {
    status: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  returns: v.array(v.object({
    _id: v.id("supportTickets"),
    userId: v.string(),
    userName: v.string(),
    userEmail: v.string(),
    subject: v.string(),
    message: v.string(),
    category: v.string(),
    status: v.string(),
    priority: v.optional(v.string()),
    adminNotes: v.optional(v.string()),
    resolvedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })),
  handler: async (ctx, args) => {
    const { user } = await withAuth(ctx);
    
    if (user.role !== "admin") {
      throw new Error("Only admins can view all tickets");
    }
    
    let tickets = await ctx.db.query("supportTickets").collect();
    
    // Filter by status if provided
    if (args.status) {
      tickets = tickets.filter(t => t.status === args.status);
    }
    
    // Filter by category if provided
    if (args.category) {
      tickets = tickets.filter(t => t.category === args.category);
    }
    
    // Sort by creation time (newest first)
    tickets.sort((a, b) => b.createdAt - a.createdAt);
    
    // Enrich with user information
    const enrichedTickets = [];
    for (const ticket of tickets) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", ticket.userId))
        .unique();
      
      enrichedTickets.push({
        ...ticket,
        userName: user 
          ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email
          : ticket.userId.substring(0, 12) + "...",
        userEmail: user?.email || ticket.userId,
      });
    }
    
    return enrichedTickets;
  },
});

/**
 * Update support ticket status (admin only)
 */
export const updateTicketStatus = mutation({
  args: {
    ticketId: v.id("supportTickets"),
    status: v.string(),
    adminNotes: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    ticketId: v.id("supportTickets"),
  }),
  handler: async (ctx, args) => {
    const { user } = await withAuth(ctx);
    
    if (user.role !== "admin") {
      throw new Error("Only admins can update ticket status");
    }
    
    const validStatuses = ["open", "in_progress", "resolved", "closed"];
    if (!validStatuses.includes(args.status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
    }
    
    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    
    const currentTime = Date.now();
    const updates: any = {
      status: args.status,
      updatedAt: currentTime,
    };
    
    if (args.adminNotes !== undefined) {
      updates.adminNotes = args.adminNotes;
    }
    
    if (args.status === "resolved" || args.status === "closed") {
      updates.resolvedAt = currentTime;
    }
    
    await ctx.db.patch(args.ticketId, updates);
    
    return {
      success: true,
      ticketId: args.ticketId,
    };
  },
});
