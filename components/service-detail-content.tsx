"use client";

import React, { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { StarRating, StarRatingDisplay } from '@/components/ui/star-rating';
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Clock,
  Store,
  User,
  Plus,
  Calendar,
  MessageSquare,
  Edit3,
  Trash2,
  ExternalLink,
  DollarSign,
  BookOpen,
  Phone
} from 'lucide-react';
import Link from 'next/link';
import { useServiceWithReviews } from '@/hooks/useData';

interface ServiceDetailContentProps {
  serviceId: Id<"services">;
  shopId: Id<"shops">;
  onClose: () => void;
}

export function ServiceDetailContent({
  serviceId,
  shopId,
  onClose
}: ServiceDetailContentProps) {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewStars, setReviewStars] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<Id<"serviceReviews"> | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  
  const { user } = useUser();
  const { toast } = useToast();
  
  const serviceData = useServiceWithReviews(serviceId);
  
  const addToCart = useMutation(api.carts.addToCart);
  const addToWishlist = useMutation(api.wishlists.addToWishlist);
  const removeFromWishlist = useMutation(api.wishlists.removeFromWishlist);
  const createReview = useMutation(api.reviews.createServiceReview);
  const updateReview = useMutation(api.reviews.updateServiceReview);
  const deleteReview = useMutation(api.reviews.deleteServiceReview);
  
  const isInWishlist = serviceData.data?.isInWishlist;

  // Loading state
  if (serviceData.isLoading || !serviceData.data) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600 mx-auto"></div>
          <p className="mt-4 text-burgundy-700">Loading service details...</p>
        </div>
      </div>
    );
  }

  const service = serviceData.data;
  const reviews = service.reviews || [];
  const reviewStats = service.reviewStats;
  const userReview = service.userReview;

  const handleBookService = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to book services",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await addToCart({
        itemType: "service",
        itemId: service._id,
        shopId: service.shopId,
        quantity: 1,
        serviceDetails: {
          selectedDate,
          selectedTime,
          notes: bookingNotes.trim() || undefined,
        },
      });

      if (result.success) {
        toast({
          title: "Service booked",
          description: `${service.name} has been added to your cart`,
        });
        setSelectedDate("");
        setSelectedTime("");
        setBookingNotes("");
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to book service",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to book service",
        variant: "destructive",
      });
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to manage your wishlist",
        variant: "destructive",
      });
      return;
    }

    try {
      let result;
      if (isInWishlist) {
        result = await removeFromWishlist({
          itemId: service._id,
        });
      } else {
        result = await addToWishlist({
          itemType: "service",
          itemId: service._id,
          shopId: service.shopId,
        });
      }

      if (result.success) {
        toast({
          title: isInWishlist ? "Removed from wishlist" : "Added to wishlist",
          description: `${service.name} has been ${isInWishlist ? 'removed from' : 'added to'} your wishlist`,
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update wishlist",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      });
    }
  };

  const handleReviewSubmit = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to leave a review",
        variant: "destructive",
      });
      return;
    }

    try {
      let result;
      if (isEditingReview && editingReviewId) {
        result = await updateReview({
          reviewId: editingReviewId,
          stars: reviewStars,
          comment: reviewComment.trim() || undefined,
        });
      } else {
        result = await createReview({
          serviceId: service._id,
          stars: reviewStars,
          comment: reviewComment.trim() || undefined,
        });
      }

      if (result.success) {
        toast({
          title: "Success",
          description: `Review ${isEditingReview ? 'updated' : 'submitted'} successfully`,
        });
        setIsReviewDialogOpen(false);
        setReviewComment("");
        setReviewStars(5);
        setIsEditingReview(false);
        setEditingReviewId(null);
      } else {
        toast({
          title: "Error",
          description: result.error || `Failed to ${isEditingReview ? 'update' : 'submit'} review`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditingReview ? 'update' : 'submit'} review`,
        variant: "destructive",
      });
    }
  };

  const handleEditReview = (review: any) => {
    setIsEditingReview(true);
    setEditingReviewId(review._id);
    setReviewStars(review.stars);
    setReviewComment(review.comment || "");
    setIsReviewDialogOpen(true);
  };

  const handleDeleteReview = async (reviewId: Id<"serviceReviews">) => {
    try {
      const result = await deleteReview({ reviewId });
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Review deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete review",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: service.name,
          text: service.description || `Check out ${service.name}`,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Service link copied to clipboard",
      });
    }
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Service Image/Icon */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gradient-to-br from-beige-100 to-beige-300 rounded-lg overflow-hidden">
            <div className="flex items-center justify-center h-full">
              <Store className="w-32 h-32 text-burgundy-400" />
            </div>
          </div>
        </div>

        {/* Service Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-burgundy-900 mb-2">{service.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              {service.pricing && (
                <div className="flex items-center gap-2 text-2xl font-bold text-burgundy-700">
                  <DollarSign className="w-6 h-6" />
                  {typeof service.pricing === 'string' ? service.pricing : 'Contact for pricing'}
                </div>
              )}
              {reviewStats && reviewStats.totalReviews > 0 && (
                <StarRatingDisplay
                  rating={reviewStats.averageRating}
                  totalReviews={reviewStats.totalReviews}
                  showNumber={true}
                  size="md"
                />
              )}
            </div>
            
            {service.description && (
              <p className="text-burgundy-700 leading-relaxed">{service.description}</p>
            )}
          </div>

          {/* Service Details */}
          <div className="space-y-4">
            {service.duration && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-burgundy-600" />
                <span className="text-sm text-burgundy-700">
                  Duration: {typeof service.duration === 'string' ? service.duration : 'Varies'}
                </span>
              </div>
            )}

            {service.bookingInfo && (
              <div className="flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-burgundy-600 mt-0.5" />
                <div>
                  <span className="text-sm font-medium text-burgundy-900">Booking Information:</span>
                  <p className="text-sm text-burgundy-700">
                    {typeof service.bookingInfo === 'string' ? service.bookingInfo : 'Contact shop for booking details'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Booking Form */}
          <Card className="border-burgundy-200">
            <CardHeader>
              <CardTitle className="text-burgundy-900 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Book This Service
              </CardTitle>
              <CardDescription>
                Schedule your appointment and add to cart
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Preferred Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Preferred Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="Any special requirements or notes..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleBookService}
                  className="flex-1 bg-burgundy-600 hover:bg-burgundy-700"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Book Service
                </Button>
                <Button
                  onClick={handleToggleWishlist}
                  variant="outline"
                  className="border-burgundy-600 text-burgundy-700 hover:bg-burgundy-50"
                >
                  <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="border-burgundy-600 text-burgundy-700 hover:bg-burgundy-50"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Shop Info */}
          {shopId && (
            <Card className="border-burgundy-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Store className="w-5 h-5 text-burgundy-600" />
                  <div>
                    <Link 
                      href={`/shops/${shopId}`}
                      className="font-medium text-burgundy-900 hover:text-burgundy-700 flex items-center gap-1"
                      onClick={onClose} // Close modal on navigation
                    >
                      {service.shopName}
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                    <p className="text-sm text-burgundy-600">Visit shop for more services</p>
                  </div>
                </div>
                
                {/* For services, it's more relevant to show contact info from the shop if available */}
                {/* Assuming shopData is available via a prop or another hook, and has contactInfo */}
                {/* You might need to fetch shopData here or pass it down */} 
                {/* For now, using a placeholder for shop contact info */}
                {/* <div className="flex items-center gap-3 mt-3 pt-3 border-t border-burgundy-200">
                  <Phone className="w-4 h-4 text-burgundy-600" />
                  <div>
                    <p className="text-sm font-medium text-burgundy-900">Contact for booking:</p>
                    <p className="text-sm text-burgundy-700">{service.shopContactInfo?.phone || 'N/A'}</p>
                  </div>
                </div> */}

                {/* Temporary render of shopId for verification */}
                {/* <p className="text-xs text-burgundy-500 mt-2">Shop ID: {shopId}</p> */}

                {/* You need to fetch shop data here or pass it as prop if you want to display dynamic shop info */}
                {/* For this example, assuming `service.shopName` is part of `useServiceWithReviews` data or passed */}
                {/* The `Link` component already uses `shopId` for navigation. */}

                {/* Re-adding shop contact info if shopData has contactInfo */} 
                {serviceData.data.shopData?.contactInfo?.phone && (
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-burgundy-200">
                    <Phone className="w-4 h-4 text-burgundy-600" />
                    <div>
                      <p className="text-sm font-medium text-burgundy-900">Contact for booking:</p>
                      <p className="text-sm text-burgundy-700">{serviceData.data.shopData.contactInfo.phone}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <Card className="border-burgundy-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-burgundy-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Customer Reviews
              {reviewStats && reviewStats.totalReviews > 0 && (
                <Badge variant="outline" className="border-burgundy-300 text-burgundy-700">
                  {reviewStats.totalReviews}
                </Badge>
              )}
            </CardTitle>
            
            {user && !userReview && (
              <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Write Review
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {isEditingReview ? 'Edit Review' : 'Write a Review'}
                    </DialogTitle>
                    <DialogDescription>
                      Share your experience with {service.name}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Rating</Label>
                      <div className="flex gap-1 mt-2">
                        <StarRating interactive={true} rating={reviewStars} onRatingChange={setReviewStars} size="lg" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="reviewComment">Comment (Optional)</Label>
                      <Textarea
                        id="reviewComment"
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Tell others about your experience..."
                        rows={4}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsReviewDialogOpen(false);
                        setReviewComment("");
                        setReviewStars(5);
                        setIsEditingReview(false);
                        setEditingReviewId(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleReviewSubmit} className="bg-burgundy-600 hover:bg-burgundy-700">
                      {isEditingReview ? 'Update Review' : 'Submit Review'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {reviewStats && reviewStats.totalReviews > 0 ? (
            <div className="space-y-6">
              {/* Review Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-burgundy-700 mb-2">
                    {reviewStats.averageRating.toFixed(1)}
                  </div>
                  <div className="flex justify-center mb-2">
                    <StarRatingDisplay rating={reviewStats.averageRating} size="lg" />
                  </div>
                  <p className="text-burgundy-600">{reviewStats.totalReviews} reviews</p>
                </div>
                
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="text-sm text-burgundy-700 w-8">{stars}★</span>
                      <div className="flex-1 bg-burgundy-100 rounded-full h-2">
                        <div
                          className="bg-burgundy-600 h-2 rounded-full"
                          style={{
                            width: `${(reviewStats.ratingBreakdown[stars as keyof typeof reviewStats.ratingBreakdown] / reviewStats.totalReviews) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-sm text-burgundy-700 w-8">
                        {reviewStats.ratingBreakdown[stars as keyof typeof reviewStats.ratingBreakdown]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-burgundy-200" />

              {/* User's Review */}
              {userReview && (
                <Card className="border-burgundy-300 bg-burgundy-50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm text-burgundy-900">Your Review</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditReview(userReview)}
                          className="border-burgundy-300 text-burgundy-700"
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteReview(userReview._id)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-2">
                      <StarRatingDisplay rating={userReview.stars} size="md" />
                    </div>
                    {userReview.comment && (
                      <p className="text-burgundy-700">{userReview.comment}</p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Other Reviews */}
              <div className="space-y-4">
                {reviews
                  .filter((review: any) => review._id !== userReview?._id)
                  .map((review: any) => (
                    <Card key={review._id} className="border-burgundy-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-burgundy-600" />
                            <span className="font-medium text-burgundy-900">
                              Customer
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <StarRatingDisplay rating={review.stars} size="md" />
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-burgundy-700">{review.comment}</p>
                        )}
                        <p className="text-xs text-burgundy-500 mt-2">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-burgundy-400 mb-4" />
              <h3 className="text-lg font-medium text-burgundy-900 mb-2">No reviews yet</h3>
              <p className="text-burgundy-600 mb-4">Be the first to review this service</p>
              {user && (
                <Button 
                  onClick={() => setIsReviewDialogOpen(true)}
                  className="bg-burgundy-600 hover:bg-burgundy-700"
                >
                  Write the first review
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
