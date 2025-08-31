"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Search, 
  UserPlus, 
  ChevronDown, 
  UserCog, 
  ShieldCheck, 
  ShoppingBag,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Doc, Id } from "@/convex/_generated/dataModel";

// Define user type
type User = Doc<"users">;

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Get all users
  const users = useQuery(api.admin.getUsers, {}) || [];
  
  // Update user role mutation
  const updateUserRole = useMutation(api.admin.updateUserRole);
  
  // Handle role change
  const handleRoleChange = async (userId: Id<"users">, newRole: string) => {
    setIsUpdating(true);
    try {
      await updateUserRole({ userId, newRole });
    } catch (error) {
      console.error("Error updating user role:", error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Filtered users based on search query and role filter
  const filteredUsers = users.filter((user: User) => {
    // Filter by search query
    const matchesSearch = searchQuery === "" || 
      (user.firstName && user.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.lastName && user.lastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.clerkId && user.clerkId.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by role
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });
  
  // Count users by role
  const userCounts = {
    all: users.length,
    admin: users.filter((user: User) => user.role === "admin").length,
    vendor: users.filter((user: User) => user.role === "vendor").length,
    customer: users.filter((user: User) => user.role === "customer").length
  };
  
  // Show loading state while data is being fetched
  if (users.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">User Management</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-48" />
        </div>
        <Skeleton className="h-12 w-full mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-burgundy">User Management</h1>
        <Link href="/admin/users/new">
          <Button className="bg-burgundy hover:bg-burgundy-dark text-white">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </Link>
      </div>
      
      {/* Search and filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={roleFilter}
          onValueChange={setRoleFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
            <SelectItem value="vendor">Vendors</SelectItem>
            <SelectItem value="customer">Customers</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full mb-6">
        <TabsList>
          <TabsTrigger value="all">All Users ({userCounts.all})</TabsTrigger>
          <TabsTrigger value="admin">Admins ({userCounts.admin})</TabsTrigger>
          <TabsTrigger value="vendor">Vendors ({userCounts.vendor})</TabsTrigger>
          <TabsTrigger value="customer">Customers ({userCounts.customer})</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Users list */}
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-lg text-burgundy">Users</CardTitle>
          <CardDescription>
            Manage user accounts and roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredUsers.length > 0 ? (
            <div className="rounded-md border">
              <div className="grid grid-cols-12 bg-gray-50 py-3 px-4 text-sm font-medium text-gray-500">
                <div className="col-span-4">User</div>
                <div className="col-span-2">Role</div>
                <div className="col-span-2">Shops</div>
                <div className="col-span-2">Joined</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
              
              <div className="divide-y">
                {filteredUsers.map((user: User) => (
                  <div key={user._id} className="grid grid-cols-12 py-3 px-4 items-center text-sm">
                    <div className="col-span-4 flex items-center">
                      <div className="w-8 h-8 bg-burgundy/10 text-burgundy rounded-full flex items-center justify-center mr-3">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-burgundy">
                          {user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}` 
                            : user.clerkId ? user.clerkId.substring(0, 12) + "..." : "Unknown User"}
                        </p>
                        <p className="text-xs text-burgundy/70">
                          ID: {user.clerkId ? user.clerkId.substring(0, 12) + "..." : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-2">
                      {user.role === "admin" && (
                        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 hover:text-purple-800">
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                      {user.role === "vendor" && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800">
                          <ShoppingBag className="h-3 w-3 mr-1" />
                          Vendor
                        </Badge>
                      )}
                      {user.role === "customer" && (
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800">
                          <Users className="h-3 w-3 mr-1" />
                          Customer
                        </Badge>
                      )}
                    </div>
                    <div className="col-span-2">
                      {user.shopIds && user.shopIds.length > 0 ? (
                        <Badge variant="outline">{user.shopIds.length} shops</Badge>
                      ) : (
                        <span className="text-xs text-gray-500">No shops</span>
                      )}
                    </div>
                    <div className="col-span-2 text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" disabled={isUpdating}>
                            Actions <ChevronDown className="ml-1 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Manage User</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/users/${user._id}`} className="flex items-center cursor-pointer">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                          <DropdownMenuItem 
                            onClick={() => handleRoleChange(user._id, "admin")}
                            disabled={user.role === "admin" || isUpdating}
                            className={`flex items-center cursor-pointer ${user.role === "admin" ? "opacity-50" : ""}`}
                          >
                            <ShieldCheck className="h-4 w-4 mr-2 text-purple-600" />
                            Make Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleRoleChange(user._id, "vendor")}
                            disabled={user.role === "vendor" || isUpdating}
                            className={`flex items-center cursor-pointer ${user.role === "vendor" ? "opacity-50" : ""}`}
                          >
                            <ShoppingBag className="h-4 w-4 mr-2 text-green-600" />
                            Make Vendor
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleRoleChange(user._id, "customer")}
                            disabled={user.role === "customer" || isUpdating}
                            className={`flex items-center cursor-pointer ${user.role === "customer" ? "opacity-50" : ""}`}
                          >
                            <Users className="h-4 w-4 mr-2 text-blue-600" />
                            Make Customer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery ? "Try adjusting your search or filter criteria" : "No users match the current filters"}
              </p>
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between">
          <p className="text-sm text-gray-500">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 