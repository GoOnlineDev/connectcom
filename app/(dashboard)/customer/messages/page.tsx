"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare, Send, UserCircle } from "lucide-react";
import Image from "next/image";

export default function CustomerMessagesPage() {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  const conversations = useQuery(api.messages.getConversations);
  const messages = useQuery(
    api.messages.getMessages,
    selectedUser ? { otherUserId: selectedUser } : "skip"
  );
  
  const sendMessage = useMutation(api.messages.sendMessage);
  const markAsRead = useMutation(api.messages.markMessagesAsRead);

  const handleUserSelect = async (userId: string) => {
    setSelectedUser(userId);
    // Mark messages as read when opening conversation
    try {
      await markAsRead({ senderId: userId });
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedUser || !messageContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSending(true);
    try {
      await sendMessage({
        recipientId: selectedUser,
        content: messageContent.trim(),
      });
      
      setMessageContent("");
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const selectedUserData = conversations?.find(c => c.userId === selectedUser);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-burgundy">Messages</h1>
        <Badge variant="outline" className="border-burgundy text-burgundy bg-burgundy/10">
          Customer
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card className="bg-white border-burgundy/10">
            <CardHeader>
              <CardTitle className="text-lg text-burgundy">Conversations</CardTitle>
              <CardDescription className="text-burgundy/70">
                Messages with vendors and admins
              </CardDescription>
            </CardHeader>
            <CardContent>
              {conversations === undefined ? (
                <Skeleton className="h-20 w-full mb-2" />
              ) : conversations.length === 0 ? (
                <p className="text-sm text-burgundy/60 text-center py-4">
                  No conversations yet
                </p>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {conversations.map((conv) => (
                    <button
                      key={conv.userId}
                      onClick={() => handleUserSelect(conv.userId)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedUser === conv.userId
                          ? "border-burgundy bg-burgundy/10"
                          : "border-burgundy/20 hover:border-burgundy/40 hover:bg-burgundy/5"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {conv.userImage ? (
                          <Image
                            src={conv.userImage}
                            alt={conv.userName}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-burgundy/20 flex items-center justify-center">
                            <UserCircle className="h-5 w-5 text-burgundy" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-burgundy truncate">{conv.userName}</p>
                            {conv.unreadCount > 0 && (
                              <Badge className="bg-burgundy-600 text-white text-xs">
                                {conv.unreadCount}
                              </Badge>
                            )}
                          </div>
                          {conv.lastMessage && (
                            <p className="text-xs text-burgundy/60 truncate mt-1">
                              {conv.lastMessage}
                            </p>
                          )}
                          <Badge variant="secondary" className="mt-1 text-xs bg-burgundy/20 text-burgundy">
                            {conv.role}
                          </Badge>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Message View */}
        <div className="lg:col-span-2">
          {selectedUser ? (
            <Card className="bg-white border-burgundy/10 h-[600px] flex flex-col">
              <CardHeader className="border-b border-burgundy/20">
                <div className="flex items-center space-x-3">
                  {selectedUserData?.userImage ? (
                    <Image
                      src={selectedUserData.userImage}
                      alt={selectedUserData.userName}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-burgundy/20 flex items-center justify-center">
                      <UserCircle className="h-5 w-5 text-burgundy" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-lg text-burgundy">
                      {selectedUserData?.userName || "User"}
                    </CardTitle>
                    <CardDescription className="text-burgundy/70">
                      {selectedUserData?.userEmail || ""}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages === undefined ? (
                    <Skeleton className="h-20 w-full mb-2" />
                  ) : messages.length === 0 ? (
                    <div className="text-center text-burgundy/60 py-8">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-burgundy/40" />
                      <p>No messages yet. Start a conversation!</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg._id}
                        className={`flex ${msg.isFromCurrentUser ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            msg.isFromCurrentUser
                              ? "bg-burgundy-600 text-white"
                              : "bg-burgundy/10 text-burgundy"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${msg.isFromCurrentUser ? "text-white/70" : "text-burgundy/60"}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <div className="border-t border-burgundy/20 p-4">
                  <div className="flex space-x-2">
                    <Textarea
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      placeholder="Type your message..."
                      rows={3}
                      className="flex-1 border-burgundy-300 focus:border-burgundy-500 focus:ring-burgundy-500 resize-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isSending || !messageContent.trim()}
                      className="bg-burgundy-600 text-white hover:bg-burgundy-700 disabled:opacity-50 disabled:cursor-not-allowed self-end"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white border-burgundy/10 h-[600px] flex items-center justify-center">
              <CardContent className="text-center">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-burgundy/40" />
                <h3 className="text-xl font-semibold text-burgundy mb-2">Select a conversation</h3>
                <p className="text-burgundy/70">
                  Choose a conversation from the list to view messages
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

