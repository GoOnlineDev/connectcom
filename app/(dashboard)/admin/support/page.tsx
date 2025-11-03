"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { 
  MessageSquare, 
  Search, 
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  User,
  Mail,
  Calendar,
  Filter
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AdminSupportPage() {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  // Get all tickets
  const allTickets = useQuery(api.support.getAllTickets, {});
  
  // Update ticket status mutation
  const updateTicketStatus = useMutation(api.support.updateTicketStatus);
  
  // Filter tickets
  const filteredTickets = allTickets?.filter((ticket: any) => {
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter;
    const matchesSearch = searchQuery === "" || 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesCategory && matchesSearch;
  }) || [];
  
  // Count tickets by status
  const ticketCounts = {
    all: allTickets?.length || 0,
    open: allTickets?.filter((t: any) => t.status === "open").length || 0,
    in_progress: allTickets?.filter((t: any) => t.status === "in_progress").length || 0,
    resolved: allTickets?.filter((t: any) => t.status === "resolved").length || 0,
    closed: allTickets?.filter((t: any) => t.status === "closed").length || 0,
  };
  
  const handleStatusUpdate = async (ticketId: any, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      await updateTicketStatus({
        ticketId,
        status: newStatus,
        adminNotes: adminNotes.trim() || undefined,
      });
      
      toast({
        title: "Ticket updated",
        description: `Ticket status has been updated to ${newStatus}.`,
      });
      
      setIsDialogOpen(false);
      setSelectedTicket(null);
      setAdminNotes("");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update ticket.",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" /> Open</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800"><Clock className="w-3 h-3 mr-1" /> In Progress</Badge>;
      case "resolved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Resolved</Badge>;
      case "closed":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800"><CheckCircle className="w-3 h-3 mr-1" /> Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null;
    switch (priority) {
      case "urgent":
        return <Badge className="bg-red-100 text-red-800 text-xs">Urgent</Badge>;
      case "high":
        return <Badge className="bg-orange-100 text-orange-800 text-xs">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Medium</Badge>;
      case "low":
        return <Badge className="bg-blue-100 text-blue-800 text-xs">Low</Badge>;
      default:
        return null;
    }
  };
  
  const getCategoryBadge = (category: string) => {
    const categoryColors: Record<string, string> = {
      general: "bg-gray-100 text-gray-800",
      technical: "bg-purple-100 text-purple-800",
      billing: "bg-indigo-100 text-indigo-800",
      feature_request: "bg-green-100 text-green-800",
      bug_report: "bg-red-100 text-red-800",
    };
    
    return (
      <Badge className={`${categoryColors[category] || "bg-gray-100 text-gray-800"} text-xs`}>
        {category.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    );
  };
  
  if (allTickets === undefined) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-burgundy-900">Support Tickets</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-burgundy-900">Support Tickets</h1>
          <p className="text-burgundy/70 mt-1">
            Manage and respond to user support requests
          </p>
        </div>
        <Badge className="bg-burgundy-600 text-white hover:bg-burgundy-700">
          {ticketCounts.all} Total Tickets
        </Badge>
      </div>
      
      {/* Filters */}
      <Card className="mb-6 bg-white border-burgundy-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-burgundy/60" />
              <Input
                placeholder="Search tickets..."
                className="pl-10 border-burgundy-300 focus:border-burgundy-500 focus:ring-burgundy-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-burgundy-300 focus:border-burgundy-500 focus:ring-burgundy-500">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses ({ticketCounts.all})</SelectItem>
                <SelectItem value="open">Open ({ticketCounts.open})</SelectItem>
                <SelectItem value="in_progress">In Progress ({ticketCounts.in_progress})</SelectItem>
                <SelectItem value="resolved">Resolved ({ticketCounts.resolved})</SelectItem>
                <SelectItem value="closed">Closed ({ticketCounts.closed})</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="border-burgundy-300 focus:border-burgundy-500 focus:ring-burgundy-500">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="feature_request">Feature Request</SelectItem>
                <SelectItem value="bug_report">Bug Report</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Tickets List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-5 w-fit mb-6">
          <TabsTrigger value="all">All ({ticketCounts.all})</TabsTrigger>
          <TabsTrigger value="open">Open ({ticketCounts.open})</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress ({ticketCounts.in_progress})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({ticketCounts.resolved})</TabsTrigger>
          <TabsTrigger value="closed">Closed ({ticketCounts.closed})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket: any) => (
              <TicketCard
                key={ticket._id}
                ticket={ticket}
                onSelect={() => {
                  setSelectedTicket(ticket);
                  setAdminNotes(ticket.adminNotes || "");
                  setIsDialogOpen(true);
                }}
                getStatusBadge={getStatusBadge}
                getPriorityBadge={getPriorityBadge}
                getCategoryBadge={getCategoryBadge}
              />
            ))
          ) : (
            <Card className="bg-white border-burgundy-200">
              <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center text-center">
                <MessageSquare className="h-12 w-12 text-burgundy/40 mb-3" />
                <h3 className="text-lg font-medium text-burgundy-900 mb-1">No Tickets Found</h3>
                <p className="text-burgundy/70">
                  {searchQuery || statusFilter !== "all" || categoryFilter !== "all"
                    ? "Try adjusting your filters or search query"
                    : "No support tickets have been submitted yet."}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="open" className="space-y-4">
          {filteredTickets.filter((t: any) => t.status === "open").length > 0 ? (
            filteredTickets
              .filter((t: any) => t.status === "open")
              .map((ticket: any) => (
                <TicketCard
                  key={ticket._id}
                  ticket={ticket}
                  onSelect={() => {
                    setSelectedTicket(ticket);
                    setAdminNotes(ticket.adminNotes || "");
                    setIsDialogOpen(true);
                  }}
                  getStatusBadge={getStatusBadge}
                  getPriorityBadge={getPriorityBadge}
                  getCategoryBadge={getCategoryBadge}
                />
              ))
          ) : (
            <Card className="bg-white border-burgundy-200">
              <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
                <p className="text-burgundy/70">No open tickets</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="in_progress" className="space-y-4">
          {filteredTickets.filter((t: any) => t.status === "in_progress").length > 0 ? (
            filteredTickets
              .filter((t: any) => t.status === "in_progress")
              .map((ticket: any) => (
                <TicketCard
                  key={ticket._id}
                  ticket={ticket}
                  onSelect={() => {
                    setSelectedTicket(ticket);
                    setAdminNotes(ticket.adminNotes || "");
                    setIsDialogOpen(true);
                  }}
                  getStatusBadge={getStatusBadge}
                  getPriorityBadge={getPriorityBadge}
                  getCategoryBadge={getCategoryBadge}
                />
              ))
          ) : (
            <Card className="bg-white border-burgundy-200">
              <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center text-center">
                <Clock className="h-12 w-12 text-burgundy/40 mb-3" />
                <p className="text-burgundy/70">No tickets in progress</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="resolved" className="space-y-4">
          {filteredTickets.filter((t: any) => t.status === "resolved").length > 0 ? (
            filteredTickets
              .filter((t: any) => t.status === "resolved")
              .map((ticket: any) => (
                <TicketCard
                  key={ticket._id}
                  ticket={ticket}
                  onSelect={() => {
                    setSelectedTicket(ticket);
                    setAdminNotes(ticket.adminNotes || "");
                    setIsDialogOpen(true);
                  }}
                  getStatusBadge={getStatusBadge}
                  getPriorityBadge={getPriorityBadge}
                  getCategoryBadge={getCategoryBadge}
                />
              ))
          ) : (
            <Card className="bg-white border-burgundy-200">
              <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
                <p className="text-burgundy/70">No resolved tickets</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="closed" className="space-y-4">
          {filteredTickets.filter((t: any) => t.status === "closed").length > 0 ? (
            filteredTickets
              .filter((t: any) => t.status === "closed")
              .map((ticket: any) => (
                <TicketCard
                  key={ticket._id}
                  ticket={ticket}
                  onSelect={() => {
                    setSelectedTicket(ticket);
                    setAdminNotes(ticket.adminNotes || "");
                    setIsDialogOpen(true);
                  }}
                  getStatusBadge={getStatusBadge}
                  getPriorityBadge={getPriorityBadge}
                  getCategoryBadge={getCategoryBadge}
                />
              ))
          ) : (
            <Card className="bg-white border-burgundy-200">
              <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center text-center">
                <FileText className="h-12 w-12 text-burgundy/40 mb-3" />
                <p className="text-burgundy/70">No closed tickets</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Ticket Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-burgundy-900">Ticket Details</DialogTitle>
            <DialogDescription className="text-burgundy/70">
              Review and update support ticket
            </DialogDescription>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="space-y-6">
              {/* Ticket Info */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-burgundy-900 mb-2">
                      {selectedTicket.subject}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {getStatusBadge(selectedTicket.status)}
                      {getPriorityBadge(selectedTicket.priority)}
                      {getCategoryBadge(selectedTicket.category)}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-burgundy-900 font-medium">User</Label>
                    <p className="text-burgundy/80 flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {selectedTicket.userName}
                    </p>
                  </div>
                  <div>
                    <Label className="text-burgundy-900 font-medium">Email</Label>
                    <p className="text-burgundy/80 flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {selectedTicket.userEmail}
                    </p>
                  </div>
                  <div>
                    <Label className="text-burgundy-900 font-medium">Created</Label>
                    <p className="text-burgundy/80 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(selectedTicket.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {selectedTicket.resolvedAt && (
                    <div>
                      <Label className="text-burgundy-900 font-medium">Resolved</Label>
                      <p className="text-burgundy/80 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        {new Date(selectedTicket.resolvedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Message */}
              <div>
                <Label className="text-burgundy-900 font-medium mb-2 block">Message</Label>
                <div className="bg-beige/30 border border-burgundy-200 rounded-lg p-4">
                  <p className="text-burgundy/80 whitespace-pre-wrap">{selectedTicket.message}</p>
                </div>
              </div>
              
              {/* Admin Notes */}
              <div>
                <Label htmlFor="adminNotes" className="text-burgundy-900 font-medium mb-2 block">
                  Admin Notes
                </Label>
                <Textarea
                  id="adminNotes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this ticket..."
                  rows={4}
                  className="border-burgundy-300 focus:border-burgundy-500 focus:ring-burgundy-500"
                />
              </div>
              
              {/* Existing Admin Notes */}
              {selectedTicket.adminNotes && (
                <div>
                  <Label className="text-burgundy-900 font-medium mb-2 block">Previous Notes</Label>
                  <div className="bg-burgundy/5 border border-burgundy-200 rounded-lg p-3">
                    <p className="text-sm text-burgundy/80">{selectedTicket.adminNotes}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <div className="flex gap-2 w-full sm:w-auto">
              <Select
                value={selectedTicket?.status || "open"}
                onValueChange={(newStatus) => {
                  if (selectedTicket) {
                    handleStatusUpdate(selectedTicket._id, newStatus);
                  }
                }}
                disabled={updatingStatus}
              >
                <SelectTrigger className="flex-1 sm:w-[180px] border-burgundy-300 focus:border-burgundy-500 focus:ring-burgundy-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1 sm:w-auto text-burgundy border-burgundy hover:bg-burgundy/10"
              >
                Close
              </Button>
              {selectedTicket && (
                <Button
                  onClick={() => {
                    if (selectedTicket.status === "open") {
                      handleStatusUpdate(selectedTicket._id, "in_progress");
                    } else if (selectedTicket.status === "in_progress") {
                      handleStatusUpdate(selectedTicket._id, "resolved");
                    }
                  }}
                  disabled={updatingStatus || (selectedTicket.status !== "open" && selectedTicket.status !== "in_progress")}
                  className="flex-1 sm:w-auto bg-burgundy-600 text-white hover:bg-burgundy-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {selectedTicket.status === "open" ? "Mark In Progress" : "Mark Resolved"}
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Ticket Card Component
function TicketCard({ 
  ticket, 
  onSelect, 
  getStatusBadge, 
  getPriorityBadge, 
  getCategoryBadge 
}: { 
  ticket: any; 
  onSelect: () => void;
  getStatusBadge: (status: string) => React.ReactElement;
  getPriorityBadge: (priority?: string) => React.ReactElement | null;
  getCategoryBadge: (category: string) => React.ReactElement;
}) {
  return (
    <Card 
      className="bg-white border-burgundy-200 hover:border-burgundy-300 transition-colors cursor-pointer"
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg text-burgundy-900 line-clamp-1 mb-2">
              {ticket.subject}
            </CardTitle>
            <CardDescription className="text-burgundy/70 line-clamp-2 mb-3">
              {ticket.message}
            </CardDescription>
            <div className="flex flex-wrap gap-2">
              {getStatusBadge(ticket.status)}
              {getPriorityBadge(ticket.priority)}
              {getCategoryBadge(ticket.category)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-burgundy/70">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {ticket.userName}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(ticket.createdAt).toLocaleDateString()}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-burgundy-300 text-burgundy hover:bg-burgundy-50"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

