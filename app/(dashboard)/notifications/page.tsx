"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { 
  Bell, 
  MessageSquare, 
  Store, 
  Star, 
  ShoppingCart, 
  Info,
  Check,
  Trash2,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "message":
      return <MessageSquare className="h-5 w-5 text-burgundy" />;
    case "shop_update":
      return <Store className="h-5 w-5 text-burgundy" />;
    case "review":
      return <Star className="h-5 w-5 text-burgundy" />;
    case "order":
      return <ShoppingCart className="h-5 w-5 text-burgundy" />;
    case "system":
      return <Info className="h-5 w-5 text-burgundy" />;
    default:
      return <Bell className="h-5 w-5 text-burgundy" />;
  }
};

export default function NotificationsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  
  const notifications = useQuery(
    api.notifications.getUserNotifications,
    { limit: 50, unreadOnly: showUnreadOnly }
  );
  const unreadCount = useQuery(api.notifications.getUnreadCount);
  
  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);
  const deleteNotification = useMutation(api.notifications.deleteNotification);
  const clearReadNotifications = useMutation(api.notifications.clearReadNotifications);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead({ notificationId: notificationId as any });
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead({});
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to mark all as read",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await deleteNotification({ notificationId: notificationId as any });
      toast({
        title: "Success",
        description: "Notification deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete notification",
        variant: "destructive",
      });
    }
  };

  const handleClearRead = async () => {
    try {
      await clearReadNotifications({});
      toast({
        title: "Success",
        description: "All read notifications cleared",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to clear notifications",
        variant: "destructive",
      });
    }
  };

  const handleNotificationClick = async (notification: any) => {
    // Mark as read
    if (!notification.isRead) {
      await handleMarkAsRead(notification._id);
    }
    
    // Navigate if there's a link
    if (notification.link) {
      router.push(notification.link);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-burgundy">Notifications</h1>
          {unreadCount !== undefined && unreadCount > 0 && (
            <p className="text-sm text-burgundy/70 mt-1">
              You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            className="border-burgundy text-burgundy hover:bg-burgundy/10"
          >
            {showUnreadOnly ? "Show All" : "Show Unread Only"}
          </Button>
          {unreadCount !== undefined && unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="border-burgundy text-burgundy hover:bg-burgundy/10"
            >
              <Check className="h-4 w-4 mr-1" />
              Mark All Read
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearRead}
            className="border-burgundy text-burgundy hover:bg-burgundy/10"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear Read
          </Button>
        </div>
      </div>

      <Card className="bg-white border-burgundy/10">
        <CardContent className="p-0">
          {notifications === undefined ? (
            <div className="space-y-2 p-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-16 w-16 mx-auto mb-4 text-burgundy/40" />
              <h3 className="text-xl font-semibold text-burgundy mb-2">
                {showUnreadOnly ? "No unread notifications" : "No notifications"}
              </h3>
              <p className="text-burgundy/70">
                {showUnreadOnly 
                  ? "You're all caught up!" 
                  : "You'll see notifications here when you have them"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-burgundy/10">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 transition-colors cursor-pointer hover:bg-burgundy/5 ${
                    !notification.isRead ? "bg-burgundy/5" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-burgundy">
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <Badge className="bg-burgundy text-white text-xs">New</Badge>
                            )}
                          </div>
                          <p className="text-sm text-burgundy/70 mb-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-burgundy/60">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification._id);
                              }}
                              className="h-8 w-8 p-0 text-burgundy hover:bg-burgundy/10"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notification._id);
                            }}
                            className="h-8 w-8 p-0 text-burgundy hover:bg-burgundy/10"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

