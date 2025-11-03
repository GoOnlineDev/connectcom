"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ShoppingBag, 
  Package, 
  Store, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  User,
  FileText,
  CheckCircle2,
  XCircle,
  Clock as ClockIcon,
  Truck,
  Search,
  Filter,
  Eye,
  Edit
} from "lucide-react";

export default function VendorOrdersPage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { toast } = useToast();
  const [clerkId, setClerkId] = useState<string | null>(null);
  const [selectedShopId, setSelectedShopId] = useState<Id<"shops"> | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedOrderId, setSelectedOrderId] = useState<Id<"orders"> | null>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({
    status: "",
    shopNotes: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Set Clerk ID when user is loaded
  useEffect(() => {
    if (isUserLoaded && user) {
      setClerkId(user.id);
    }
  }, [isUserLoaded, user]);

  // Get shops owned by the user
  const shops = useQuery(
    api.shops.getShopsByOwner,
    clerkId ? { ownerId: clerkId } : "skip"
  );

  // Get orders for selected shop
  const orders = useQuery(
    api.orders.getShopOrders,
    selectedShopId !== "all" && selectedShopId ? { shopId: selectedShopId } : "skip"
  );

  // Get all orders for all shops
  const allVendorOrders = useQuery(api.orders.getAllVendorOrders);

  // Get order details
  const orderDetails = useQuery(
    api.orders.getOrderById,
    selectedOrderId ? { orderId: selectedOrderId } : "skip"
  );

  const updateOrderStatus = useMutation(api.orders.updateOrderStatus);

  // Format price
  const formatPrice = (price: number) => {
    return `UG ${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      confirmed: { label: "Confirmed", className: "bg-blue-100 text-blue-800 border-blue-200" },
      processing: { label: "Processing", className: "bg-purple-100 text-purple-800 border-purple-200" },
      shipped: { label: "Shipped", className: "bg-indigo-100 text-indigo-800 border-indigo-200" },
      delivered: { label: "Delivered", className: "bg-green-100 text-green-800 border-green-200" },
      cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800 border-red-200" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  // Filter orders based on selected shop
  const filteredOrders = selectedShopId === "all" 
    ? allVendorOrders || []
    : orders || [];

  // Apply status and search filters
  const displayOrders = filteredOrders.filter((order: any) => {
    if (selectedStatus !== "all" && order.status !== selectedStatus) return false;
    if (searchTerm && !order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleViewOrder = (orderId: Id<"orders">) => {
    setSelectedOrderId(orderId);
    setIsOrderDialogOpen(true);
  };

  const handleUpdateStatus = (orderId: Id<"orders">) => {
    setSelectedOrderId(orderId);
    // Find the order from the list to get current status
    const currentOrder = displayOrders.find((o: any) => o._id === orderId);
    if (currentOrder) {
      setStatusUpdate({
        status: currentOrder.status,
        shopNotes: "",
      });
    } else if (orderDetails && orderDetails._id === orderId) {
      setStatusUpdate({
        status: orderDetails.status,
        shopNotes: orderDetails.shopNotes || "",
      });
    } else {
      setStatusUpdate({
        status: "",
        shopNotes: "",
      });
    }
    setIsStatusDialogOpen(true);
  };

  const handleStatusSubmit = async () => {
    if (!selectedOrderId) return;

    try {
      const result = await updateOrderStatus({
        orderId: selectedOrderId,
        status: statusUpdate.status,
        shopNotes: statusUpdate.shopNotes || undefined,
      });

      if (result.success) {
        toast({
          title: "Success",
          description: "Order status updated successfully",
        });
        setIsStatusDialogOpen(false);
        setStatusUpdate({ status: "", shopNotes: "" });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update order status",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  // Loading state
  if (!shops || (selectedShopId === "all" ? allVendorOrders === undefined : orders === undefined)) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Empty shops state
  if (shops.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-burgundy-900">Orders & Bookings</h1>
        </div>
        <Card className="bg-white border-burgundy-200">
          <CardContent className="flex flex-col items-center justify-center text-center py-12">
            <Store className="h-16 w-16 text-burgundy-400 mb-4" />
            <h3 className="text-xl font-semibold text-burgundy-900 mb-2">No Shops Found</h3>
            <p className="text-burgundy-700 mb-6 max-w-md">
              You need to create a shop first before you can receive orders.
            </p>
            <Button asChild className="bg-burgundy-600 hover:bg-burgundy-700 text-white">
              <a href="/onboarding/shop">Create Your First Shop</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-burgundy-900">Orders & Bookings</h1>
        <div className="flex items-center gap-2">
          <Badge className="bg-burgundy-600 text-white">
            {displayOrders.length} {displayOrders.length === 1 ? 'Order' : 'Orders'}
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white border-burgundy-200 mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Shop Filter */}
            <div>
              <Label htmlFor="shop-filter" className="text-burgundy-900 mb-2 block">
                Filter by Shop
              </Label>
              <Select
                value={selectedShopId === "all" ? "all" : selectedShopId}
                onValueChange={(value) => setSelectedShopId(value === "all" ? "all" : value as Id<"shops">)}
              >
                <SelectTrigger className="border-burgundy-300 focus:border-burgundy-500 focus:ring-burgundy-500">
                  <SelectValue placeholder="All Shops" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Shops</SelectItem>
                  {shops.map((shop) => (
                    <SelectItem key={shop._id} value={shop._id}>
                      {shop.shopName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <Label htmlFor="status-filter" className="text-burgundy-900 mb-2 block">
                Filter by Status
              </Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="border-burgundy-300 focus:border-burgundy-500 focus:ring-burgundy-500">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div>
              <Label htmlFor="search" className="text-burgundy-900 mb-2 block">
                Search Orders
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-burgundy-600 w-4 h-4" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Search by order number, customer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-burgundy-300 focus:border-burgundy-500 focus:ring-burgundy-500"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {displayOrders.length === 0 ? (
        <Card className="bg-white border-burgundy-200">
          <CardContent className="flex flex-col items-center justify-center text-center py-12">
            <ShoppingBag className="h-16 w-16 text-burgundy-400 mb-4" />
            <h3 className="text-xl font-semibold text-burgundy-900 mb-2">No Orders Found</h3>
            <p className="text-burgundy-700 mb-6 max-w-md">
              {selectedStatus !== "all" || selectedShopId !== "all" || searchTerm
                ? "No orders match your filters. Try adjusting your search criteria."
                : "You haven't received any orders yet. Orders will appear here once customers place them."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {displayOrders.map((order: any) => (
            <Card key={order._id} className="bg-white border-burgundy-200 hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-bold text-burgundy-900">{order.orderNumber}</h3>
                      {getStatusBadge(order.status)}
                      {selectedShopId === "all" && order.shopName && (
                        <Badge variant="outline" className="border-burgundy-300 text-burgundy-700">
                          <Store className="w-3 h-3 mr-1" />
                          {order.shopName}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-burgundy-700">
                      <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4" />
                        <span>{order.customerName}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4" />
                        <span className="truncate max-w-[200px]">{order.customerEmail}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Package className="w-4 h-4" />
                        <span>{order.itemCount || order.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0} items</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-end gap-2">
                    <div className="text-right">
                      <div className="text-xs text-burgundy-600 mb-1">Total Amount</div>
                      <div className="text-xl font-bold text-burgundy-900">
                        {formatPrice(order.totalAmount)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewOrder(order._id)}
                        className="border-burgundy-300 text-burgundy-700 hover:bg-burgundy-50"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(order._id)}
                        className="border-burgundy-300 text-burgundy-700 hover:bg-burgundy-50"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Update Status
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Order Details Dialog */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white border-burgundy-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-burgundy-900">
              Order Details - {orderDetails?.orderNumber}
            </DialogTitle>
            <DialogDescription className="text-burgundy-700">
              View complete order information and customer details
            </DialogDescription>
            {orderDetails && (
              <div className="mt-2">
                {getStatusBadge(orderDetails.status)}
              </div>
            )}
          </DialogHeader>

          {orderDetails && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold text-burgundy-900 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Information
                </h3>
                <div className="bg-burgundy-50 border border-burgundy-200 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-burgundy-900 w-24">Name:</span>
                    <span className="text-burgundy-700">{orderDetails.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-burgundy-600" />
                    <span className="font-medium text-burgundy-900 w-24">Email:</span>
                    <a href={`mailto:${orderDetails.customerEmail}`} className="text-burgundy-700 hover:text-burgundy-900 underline">
                      {orderDetails.customerEmail}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-burgundy-600" />
                    <span className="font-medium text-burgundy-900 w-24">Phone:</span>
                    <a href={`tel:${orderDetails.customerPhone}`} className="text-burgundy-700 hover:text-burgundy-900 underline">
                      {orderDetails.customerPhone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div>
                <h3 className="text-lg font-semibold text-burgundy-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Delivery Information
                </h3>
                <div className="bg-burgundy-50 border border-burgundy-200 rounded-lg p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="font-medium text-burgundy-900 w-24">Address:</span>
                    <span className="text-burgundy-700 flex-1">{orderDetails.deliveryAddress}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-burgundy-900 w-24">City:</span>
                    <span className="text-burgundy-700">{orderDetails.deliveryCity}</span>
                  </div>
                  {orderDetails.deliveryNotes && (
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-burgundy-900 w-24">Notes:</span>
                      <span className="text-burgundy-700 flex-1">{orderDetails.deliveryNotes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold text-burgundy-900 mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Items
                </h3>
                <div className="border border-burgundy-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-burgundy-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-burgundy-900">Item</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-burgundy-900">Quantity</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-burgundy-900">Price</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-burgundy-900">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-burgundy-100">
                      {orderDetails.items.map((item: any, index: number) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <div className="font-medium text-burgundy-900">{item.itemName}</div>
                            <Badge variant="outline" className="border-burgundy-300 text-burgundy-700 text-xs mt-1">
                              {item.itemType === "product" ? "Product" : "Service"}
                            </Badge>
                            {item.itemType === "service" && item.serviceDetails && (
                              <div className="mt-2 space-y-1 text-xs text-burgundy-600">
                                {item.serviceDetails.selectedDate && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>Date: {item.serviceDetails.selectedDate}</span>
                                  </div>
                                )}
                                {item.serviceDetails.selectedTime && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>Time: {item.serviceDetails.selectedTime}</span>
                                  </div>
                                )}
                                {item.serviceDetails.notes && (
                                  <div className="flex items-start gap-1">
                                    <FileText className="w-3 h-3 mt-0.5" />
                                    <span>Notes: {item.serviceDetails.notes}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center text-burgundy-700">{item.quantity}</td>
                          <td className="px-4 py-3 text-right text-burgundy-700">
                            {formatPrice(item.price)}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-burgundy-900">
                            {formatPrice(item.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-burgundy-50">
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-right font-semibold text-burgundy-900">
                          Subtotal:
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-burgundy-900">
                          {formatPrice(orderDetails.subtotal)}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-right font-bold text-lg text-burgundy-900">
                          Total Amount:
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-lg text-burgundy-900">
                          {formatPrice(orderDetails.totalAmount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="text-lg font-semibold text-burgundy-900 mb-3">Payment Information</h3>
                <div className="bg-burgundy-50 border border-burgundy-200 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-burgundy-900 w-32">Payment Method:</span>
                    <span className="text-burgundy-700 capitalize">{orderDetails.paymentMethod || "Pending"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-burgundy-900 w-32">Payment Status:</span>
                    <Badge variant="outline" className={orderDetails.paymentStatus === "paid" ? "bg-green-100 text-green-800 border-green-200" : "bg-yellow-100 text-yellow-800 border-yellow-200"}>
                      {orderDetails.paymentStatus || "Pending"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {(orderDetails.customerNotes || orderDetails.shopNotes) && (
                <div>
                  <h3 className="text-lg font-semibold text-burgundy-900 mb-3">Notes</h3>
                  <div className="space-y-3">
                    {orderDetails.customerNotes && (
                      <div className="bg-burgundy-50 border border-burgundy-200 rounded-lg p-4">
                        <div className="font-medium text-burgundy-900 mb-2">Customer Notes:</div>
                        <p className="text-burgundy-700 whitespace-pre-wrap">{orderDetails.customerNotes}</p>
                      </div>
                    )}
                    {orderDetails.shopNotes && (
                      <div className="bg-beige-50 border border-beige-200 rounded-lg p-4">
                        <div className="font-medium text-burgundy-900 mb-2">Your Notes:</div>
                        <p className="text-burgundy-700 whitespace-pre-wrap">{orderDetails.shopNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Order Timeline */}
              <div>
                <h3 className="text-lg font-semibold text-burgundy-900 mb-3">Order Timeline</h3>
                <div className="bg-burgundy-50 border border-burgundy-200 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-burgundy-700">
                    <Calendar className="w-4 h-4" />
                    <span>Order placed: {new Date(orderDetails.createdAt).toLocaleString()}</span>
                  </div>
                  {orderDetails.updatedAt !== orderDetails.createdAt && (
                    <div className="flex items-center gap-2 text-sm text-burgundy-700">
                      <Clock className="w-4 h-4" />
                      <span>Last updated: {new Date(orderDetails.updatedAt).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOrderDialogOpen(false)}
              className="border-burgundy-300 text-burgundy-700 hover:bg-burgundy-50"
            >
              Close
            </Button>
            {orderDetails && (
              <Button
                onClick={() => {
                  setIsOrderDialogOpen(false);
                  handleUpdateStatus(orderDetails._id);
                }}
                className="bg-burgundy-600 hover:bg-burgundy-700 text-white"
              >
                Update Status
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="bg-white border-burgundy-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-burgundy-900">Update Order Status</DialogTitle>
            <DialogDescription className="text-burgundy-700">
              Update the status and add notes for this order
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="status" className="text-burgundy-900 mb-2 block">
                Order Status
              </Label>
              <Select
                value={statusUpdate.status}
                onValueChange={(value) => setStatusUpdate(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="border-burgundy-300 focus:border-burgundy-500 focus:ring-burgundy-500">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="shopNotes" className="text-burgundy-900 mb-2 block">
                Internal Notes (Optional)
              </Label>
              <Textarea
                id="shopNotes"
                value={statusUpdate.shopNotes}
                onChange={(e) => setStatusUpdate(prev => ({ ...prev, shopNotes: e.target.value }))}
                rows={4}
                className="border-burgundy-300 focus:border-burgundy-500 focus:ring-burgundy-500"
                placeholder="Add internal notes about this order..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsStatusDialogOpen(false);
                setStatusUpdate({ status: "", shopNotes: "" });
              }}
              className="border-burgundy-300 text-burgundy-700 hover:bg-burgundy-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusSubmit}
              disabled={!statusUpdate.status}
              className="bg-burgundy-600 hover:bg-burgundy-700 text-white disabled:opacity-50"
            >
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
