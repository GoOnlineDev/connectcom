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
 * Send a message from current user to another user
 */
export const sendMessage = mutation({
  args: {
    recipientId: v.string(), // Clerk user ID
    content: v.string(),
  },
  returns: v.id("messages"),
  handler: async (ctx, args) => {
    const { identity, user } = await withAuth(ctx);
    
    // Validate recipient exists
    const recipient = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.recipientId))
      .unique();
    
    if (!recipient) {
      throw new Error("Recipient not found");
    }
    
    if (args.content.trim().length === 0) {
      throw new Error("Message content cannot be empty");
    }
    
    const messageId = await ctx.db.insert("messages", {
      senderId: identity.subject,
      recipientId: args.recipientId,
      content: args.content.trim(),
      isRead: false,
      createdAt: Date.now(),
    });
    
    // Create notification for recipient
    const senderName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email;
    
    // Determine the correct messages link based on recipient's role
    let messagesLink = "/customer/messages"; // default
    if (recipient.role === "admin") {
      messagesLink = "/admin/messages";
    } else if (recipient.role === "vendor") {
      messagesLink = "/vendor/messages";
    }
    
    await ctx.db.insert("notifications", {
      userId: args.recipientId,
      type: "message",
      title: "New Message",
      message: `${senderName} sent you a message`,
      isRead: false,
      link: messagesLink,
      relatedId: messageId,
      relatedType: "message",
      metadata: {
        senderId: identity.subject,
        senderName: senderName,
      },
      createdAt: Date.now(),
    });
    
    return messageId;
  },
});

/**
 * Get all conversations for the current user
 */
export const getConversations = query({
  args: {},
  returns: v.array(v.object({
    userId: v.string(),
    userName: v.string(),
    userEmail: v.string(),
    userImage: v.optional(v.string()),
    lastMessage: v.optional(v.string()),
    lastMessageTime: v.optional(v.number()),
    unreadCount: v.number(),
    role: v.string(),
  })),
  handler: async (ctx) => {
    const { identity } = await withAuth(ctx);
    
    // Get all messages where user is sender or recipient
    const sentMessages = await ctx.db
      .query("messages")
      .withIndex("by_sender", (q) => q.eq("senderId", identity.subject))
      .collect();
    
    const receivedMessages = await ctx.db
      .query("messages")
      .withIndex("by_recipient", (q) => q.eq("recipientId", identity.subject))
      .collect();
    
    // Get unique conversation partners
    const conversationPartners = new Set<string>();
    sentMessages.forEach(msg => conversationPartners.add(msg.recipientId));
    receivedMessages.forEach(msg => conversationPartners.add(msg.senderId));
    
    // Build conversation list
    const conversations = [];
    for (const partnerId of conversationPartners) {
      const partner = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", partnerId))
        .unique();
      
      if (!partner) continue;
      
      // Get all messages in this conversation
      const conversationMessages = [
        ...sentMessages.filter(m => m.recipientId === partnerId),
        ...receivedMessages.filter(m => m.senderId === partnerId),
      ].sort((a, b) => b.createdAt - a.createdAt);
      
      const lastMessage = conversationMessages[0];
      const unreadCount = receivedMessages.filter(
        m => m.senderId === partnerId && !m.isRead
      ).length;
      
      conversations.push({
        userId: partnerId,
        userName: `${partner.firstName || ""} ${partner.lastName || ""}`.trim() || partner.email,
        userEmail: partner.email,
        userImage: partner.imageUrl,
        lastMessage: lastMessage?.content,
        lastMessageTime: lastMessage?.createdAt,
        unreadCount,
        role: partner.role,
      });
    }
    
    // Sort by last message time
    conversations.sort((a, b) => {
      const timeA = a.lastMessageTime || 0;
      const timeB = b.lastMessageTime || 0;
      return timeB - timeA;
    });
    
    return conversations;
  },
});

/**
 * Get messages between current user and another user
 */
export const getMessages = query({
  args: {
    otherUserId: v.string(), // Clerk user ID
  },
  returns: v.array(v.object({
    _id: v.id("messages"),
    senderId: v.string(),
    recipientId: v.string(),
    content: v.string(),
    isRead: v.boolean(),
    createdAt: v.number(),
    isFromCurrentUser: v.boolean(),
  })),
  handler: async (ctx, args) => {
    const { identity } = await withAuth(ctx);
    
    const messages = await ctx.db
      .query("messages")
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field("senderId"), identity.subject),
            q.eq(q.field("recipientId"), args.otherUserId)
          ),
          q.and(
            q.eq(q.field("senderId"), args.otherUserId),
            q.eq(q.field("recipientId"), identity.subject)
          )
        )
      )
      .order("desc")
      .take(50);
    
    // Mark unread messages as read
    const unreadMessages = messages.filter(
      m => m.recipientId === identity.subject && !m.isRead
    );
    
    if (unreadMessages.length > 0) {
      // Mark as read in a separate mutation
      // We'll return the updated status in the response
    }
    
    return messages.reverse().map(msg => ({
      _id: msg._id,
      senderId: msg.senderId,
      recipientId: msg.recipientId,
      content: msg.content,
      isRead: msg.isRead,
      createdAt: msg.createdAt,
      isFromCurrentUser: msg.senderId === identity.subject,
    }));
  },
});

/**
 * Mark messages as read
 */
export const markMessagesAsRead = mutation({
  args: {
    senderId: v.string(), // Clerk user ID of sender
  },
  returns: v.number(), // Count of messages marked as read
  handler: async (ctx, args) => {
    const { identity } = await withAuth(ctx);
    
    const unreadMessages = await ctx.db
      .query("messages")
      .withIndex("by_recipient", (q) => q.eq("recipientId", identity.subject))
      .filter((q) => 
        q.and(
          q.eq(q.field("senderId"), args.senderId),
          q.eq(q.field("isRead"), false)
        )
      )
      .collect();
    
    let count = 0;
    for (const msg of unreadMessages) {
      await ctx.db.patch(msg._id, { isRead: true });
      count++;
    }
    
    return count;
  },
});

/**
 * Search users (for admin messaging any user)
 */
export const searchUsers = query({
  args: {
    searchQuery: v.string(),
    limit: v.optional(v.number()),
  },
  returns: v.array(v.object({
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    role: v.string(),
    name: v.string(),
  })),
  handler: async (ctx, args) => {
    const { user } = await withAuth(ctx);
    
    // Only admins can search all users
    if (user.role !== "admin") {
      throw new Error("Only admins can search users");
    }
    
    const limit = args.limit || 20;
    const query = args.searchQuery.toLowerCase().trim();
    
    if (query.length === 0) {
      return [];
    }
    
    // Get all users and filter by search query
    const allUsers = await ctx.db.query("users").collect();
    
    const matchingUsers = allUsers
      .filter(user => {
        const email = user.email.toLowerCase();
        const firstName = (user.firstName || "").toLowerCase();
        const lastName = (user.lastName || "").toLowerCase();
        const fullName = `${firstName} ${lastName}`.trim().toLowerCase();
        
        return email.includes(query) || 
               firstName.includes(query) || 
               lastName.includes(query) ||
               fullName.includes(query);
      })
      .slice(0, limit)
      .map(user => ({
        clerkId: user.clerkId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        role: user.role,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
      }));
    
    return matchingUsers;
  },
});

/**
 * Get unread message count for current user
 */
export const getUnreadCount = query({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const { identity } = await withAuth(ctx);
    
    const unreadMessages = await ctx.db
      .query("messages")
      .withIndex("by_recipient", (q) => q.eq("recipientId", identity.subject))
      .filter((q) => q.eq(q.field("isRead"), false))
      .collect();
    
    return unreadMessages.length;
  },
});
