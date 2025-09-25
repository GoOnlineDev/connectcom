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
  Package,
  Store,
  User,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Edit3,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useProductWithReviews } from '@/hooks/useData';

interface ProductDetailContentProps {
  productId: Id<"products">;
  shopId: Id<"shops">; // Pass shopId for navigation back to shop
  onClose: () => void; // Function to close the modal
}

export function ProductDetailContent({
  productId,
  shopId,
  onClose
}: ProductDetailContentProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewStars, setReviewStars] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<Id<"productReviews"> | null>(null);
  
  const { user } = useUser();
  const { toast } = useToast();
  
  const productData = useProductWithReviews(productId);
  
  const addToCart = useMutation(api.carts.addToCart);
  const addToWishlist = useMutation(api.wishlists.addToWishlist);
  const removeFromWishlist = useMutation(api.wishlists.removeFromWishlist);
  const createReview = useMutation(api.reviews.createProductReview);
  const updateReview = useMutation(api.reviews.updateProductReview);
  const deleteReview = useMutation(api.reviews.deleteProductReview);
  
  const isInWishlist = productData.data?.isInWishlist;

  // Loading state
  if (productData.isLoading || !productData.data) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600 mx-auto"></div>
          <p className="mt-4 text-burgundy-700">Loading product details...</p>
        </div>
      </div>
    );
  }

  const product = productData.data;
  const reviews = product.reviews || [];
  const reviewStats = product.reviewStats;
  const userReview = product.userReview;

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await addToCart({
        itemType: "product",
        itemId: product._id,
        shopId: product.shopId,
        quantity: quantity,
      });

      if (result.success) {
        toast({
          title: "Added to cart",
          description: `${product.name} has been added to your cart`,
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to add to cart",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to cart",
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
          itemId: product._id,
        });
      } else {
        result = await addToWishlist({
          itemType: "product",
          itemId: product._id,
          shopId: product.shopId,
        });
      }

      if (result.success) {
        toast({
          title: isInWishlist ? "Removed from wishlist" : "Added to wishlist",
          description: `${product.name} has been ${isInWishlist ? 'removed from' : 'added to'} your wishlist`,
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
          productId: product._id,
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

  const handleDeleteReview = async (reviewId: Id<"productReviews">) => {
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
          title: product.name,
          text: product.description || `Check out ${product.name}`,
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
        description: "Product link copied to clipboard",
      });
    }
  };

  const images = product.imageUrls || [];
  const hasImages = images.length > 0;

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gradient-to-br from-beige-100 to-beige-300 rounded-lg overflow-hidden">
            {hasImages ? (
              <>
                <img
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <Package className="w-24 h-24 text-burgundy-400" />
              </div>
            )}
          </div>
          
          {/* Image Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImageIndex === index ? 'border-burgundy-600' : 'border-burgundy-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-burgundy-900 mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-3xl font-bold text-burgundy-700">
                {`UGX ${product.price.toLocaleString()}`}
              </div>
              {reviewStats && reviewStats.totalReviews > 0 && (
                <StarRatingDisplay 
                  rating={reviewStats.averageRating}
                  totalReviews={reviewStats.totalReviews}
                  showNumber={true}
                  size="md"
                />
              )}
            </div>
            
            {product.description && (
              <p className="text-burgundy-700 leading-relaxed">{product.description}</p>
            )}
          </div>

          {/* Stock Info */}
          {product.quantityAvailable !== undefined && (
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-burgundy-600" />
              <span className="text-sm text-burgundy-700">
                {product.quantityAvailable > 0 
                  ? `${product.quantityAvailable} in stock` 
                  : 'Out of stock'
                }
              </span>
            </div>
          )}

          {/* Quantity Selector & Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="quantity" className="text-burgundy-900">Quantity:</Label>
              <div className="flex items-center border border-burgundy-300 rounded-md">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="p-2 hover:bg-burgundy-50 text-burgundy-700"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center border-0 focus:ring-0 text-burgundy-900"
                />
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="p-2 hover:bg-burgundy-50 text-burgundy-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-burgundy-600 hover:bg-burgundy-700"
                disabled={product.quantityAvailable === 0}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
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
          </div>

          {/* Shop Info */}
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
                    {product.shopName}
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                  <p className="text-sm text-burgundy-600">Visit shop for more products</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
                      Share your experience with {product.name}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-white">Rating</Label>
                      <div className="flex gap-1 mt-2">
                        <StarRating interactive={true} rating={reviewStars} onRatingChange={setReviewStars} size="lg" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="reviewComment" className="text-white">Comment (Optional)</Label>
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
              <p className="text-burgundy-600 mb-4">Be the first to review this product</p>
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
