'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ordersAPI } from '@/lib/api';

interface OrderItem {
  id: number;
  productId: string;
  productName: string;
  quantity: number;
  priceAtPurchase: number;
}

interface Order {
  id: number;
  userId: number;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return; 
    
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (params.id) {
      fetchOrder(params.id as string);
    }
  }, [isAuthenticated, authLoading, params.id, router]);

  const fetchOrder = async (id: string) => {
    try {
      setLoading(true);
      const data = await ordersAPI.getById(id);
      setOrder(data);
    } catch (err) {
      setError('Order not found');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || (!isAuthenticated && loading)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">Please login to view order details</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Order not found'}</p>
          <button
            onClick={() => router.push('/orders')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => router.push('/orders')}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          ← Back to Orders
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order #{order.id}</h1>
          <p className="text-gray-600">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-500">Product ID: {item.productId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{Number(item.priceAtPurchase).toFixed(2)} each</p>
                    <p className="text-lg font-bold text-blue-600">
                      ₹{(Number(item.priceAtPurchase) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-blue-600">₹{Number(order.total).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}