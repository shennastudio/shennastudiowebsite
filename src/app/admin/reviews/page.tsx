'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MessageSquare, CheckCircle, XCircle, Trash2, Eye } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface Review {
  id: string;
  rating: number;
  title?: string | null;
  body: string;
  createdAt: string;
  isApproved: boolean;
  isRejected: boolean;
  moderatedAt?: string | null;
  moderatedBy?: string | null;
  product: {
    id: string;
    name: string;
    slug: string;
    images: Array<{
      url: string;
      alt: string | null;
    }>;
  };
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface ReviewSummary {
  totalReviews: number;
  pendingReviews: number;
  approvedReviews: number;
  averageRating: number;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary>({
    totalReviews: 0,
    pendingReviews: 0,
    approvedReviews: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');

  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);

  async function fetchReviews() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);

      const response = await fetch(`/api/admin/reviews?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setReviews(data.reviews);
        setSummary(data.summary);
      } else {
        toast.error(data.error || 'Failed to fetch reviews');
      }
    } catch (error) {
      console.error('Fetch reviews error:', error);
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  }

  async function handleReviewAction(reviewId: string, action: 'approve' | 'reject' | 'delete') {
    const confirmMessage =
      action === 'delete'
        ? 'Are you sure you want to delete this review? This action cannot be undone.'
        : `Are you sure you want to ${action} this review?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, action }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || `Review ${action}d successfully`);
        fetchReviews();
      } else {
        toast.error(data.error || `Failed to ${action} review`);
      }
    } catch (error) {
      console.error('Review action error:', error);
      toast.error(`Failed to ${action} review`);
    }
  }

  function renderStars(rating: number) {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  }

  const statusCounts = {
    all: summary.totalReviews,
    pending: summary.pendingReviews,
    approved: summary.approvedReviews,
    rejected: summary.totalReviews - summary.pendingReviews - summary.approvedReviews,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Review Moderation</h1>
        <p className="text-gray-600 mt-1">Approve, reject, or delete product reviews</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalReviews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Eye className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.pendingReviews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.approvedReviews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.averageRating.toFixed(1)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-gray-500">Loading reviews...</div>
            </CardContent>
          </Card>
        ) : reviews.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                No {statusFilter !== 'all' ? statusFilter : ''} reviews found
              </div>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  {/* Product Image */}
                  {review.product.images[0]?.url && (
                    <div className="flex-shrink-0">
                      <Image
                        src={review.product.images[0].url}
                        alt={review.product.images[0].alt || review.product.name}
                        width={100}
                        height={100}
                        className="rounded-lg object-cover"
                      />
                    </div>
                  )}

                  {/* Review Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{review.product.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-600">
                            {review.rating.toFixed(1)} / 5.0
                          </span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div>
                        {review.isApproved && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                            <CheckCircle className="h-3 w-3" />
                            Approved
                          </span>
                        )}
                        {review.isRejected && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                            <XCircle className="h-3 w-3" />
                            Rejected
                          </span>
                        )}
                        {!review.isApproved && !review.isRejected && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                            <Eye className="h-3 w-3" />
                            Pending
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-700 mb-4 whitespace-pre-wrap">{review.body}</p>

                    {/* User & Date Info */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div>
                        <span className="font-medium">{review.user.name}</span>
                        <span className="mx-2">•</span>
                        <span>{review.user.email}</span>
                      </div>
                      <div>{new Date(review.createdAt).toLocaleDateString()}</div>
                    </div>

                    {/* Moderation Info */}
                    {review.moderatedAt && (
                      <div className="text-xs text-gray-500 mb-4">
                        Moderated on {new Date(review.moderatedAt).toLocaleDateString()}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {!review.isApproved && (
                        <Button
                          onClick={() => handleReviewAction(review.id, 'approve')}
                          size="sm"
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </Button>
                      )}
                      {!review.isRejected && (
                        <Button
                          onClick={() => handleReviewAction(review.id, 'reject')}
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-2 border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </Button>
                      )}
                      <Button
                        onClick={() => handleReviewAction(review.id, 'delete')}
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-2 border-gray-300 text-gray-600 hover:bg-gray-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
