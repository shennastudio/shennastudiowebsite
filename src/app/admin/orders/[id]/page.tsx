'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  FileText,
  ShoppingBag
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import type { OrderDetail } from '@/types';

interface TimelineEvent {
  type: string;
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  user?: string;
}

interface OrderNote {
  id: string;
  content: string;
  createdAt: string;
  user?: {
    name: string;
  } | null;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [notes, setNotes] = useState<OrderNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchOrderDetails = useCallback(async () => {

    setLoading(true);
    try {
      const [timelineRes, notesRes] = await Promise.all([
        fetch(`/api/admin/orders/${params.id}/timeline`),
        fetch(`/api/admin/orders/${params.id}/notes`),
      ]);

      if (timelineRes.ok) {
        const data = await timelineRes.json();
        setOrder(data.order);
        setTimeline(data.timeline);
      }

      if (notesRes.ok) {
        const data = await notesRes.json();
        setNotes(data.notes);
      }
    } catch (error) {
      console.error('Fetch order details error:', error);
      toast.error('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!newNote.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/admin/orders/${params.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote }),
      });

      if (response.ok) {
        toast.success('Note added successfully');
        setNewNote('');
        fetchOrderDetails();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to add note');
      }
    } catch (error) {
      console.error('Add note error:', error);
      toast.error('Failed to add note');
    } finally {
      setSubmitting(false);
    }
  }

  function getIcon(iconName: string) {
    const icons: Record<string, React.ComponentType> = {
      'shopping-bag': ShoppingBag,
      'clock': Clock,
      'truck': Truck,
      'check-circle': CheckCircle,
      'x-circle': XCircle,
      'message-square': MessageSquare,
      'package': Package,
    };
    return icons[iconName] || MessageSquare;
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-700';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-700';
      case 'DELIVERED':
        return 'bg-green-100 text-green-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-600 mb-4">Order not found</p>
        <Button onClick={() => router.push('/admin/orders')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <Button onClick={() => router.push('/admin/orders')} variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
          <p className="text-gray-600 mt-1">{order.customerName} • {order.customerEmail}</p>
        </div>
        <div className="flex gap-2">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
          <Link href={`/admin/orders/${params.id}/invoice`}>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              View Invoice
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                {/* Timeline events */}
                <div className="space-y-6">
                  {timeline.map((event, index) => {
                    const IconComponent = getIcon(event.icon);
                    return (
                      <div key={index} className="relative flex gap-4">
                        {/* Icon */}
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center z-10">
                          <IconComponent className="h-5 w-5 text-blue-600" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-1">
                          <h3 className="font-semibold text-gray-900">{event.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">{event.description}</p>
                          {event.user && (
                            <p className="text-gray-500 text-xs mt-1">by {event.user}</p>
                          )}
                          <p className="text-gray-400 text-xs mt-1">
                            {new Date(event.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notes */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add note form */}
              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                  rows={3}
                />
                <Button type="submit" size="sm" disabled={submitting || !newNote.trim()}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {submitting ? 'Adding...' : 'Add Note'}
                </Button>
              </form>

              {/* Notes list */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notes.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">No notes yet</p>
                ) : (
                  notes.map((note) => (
                    <div key={note.id} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">{note.content}</p>
                      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                        <span>{note.user.name}</span>
                        <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total</span>
                  <span className="font-semibold">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
