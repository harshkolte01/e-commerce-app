'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
      } else if (user.role !== 'admin') {
        router.push('/');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Admin Panel</h1>
          <p className="text-gray-600 mt-2">Hello, {user.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Products Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Products</h2>
            <p className="text-gray-600 mb-4">Manage your product catalog</p>
            <div className="space-y-2">
              <Link
                href="/admin/products"
                className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700"
              >
                View All Products
              </Link>
              <Link
                href="/admin/products/new"
                className="block w-full bg-green-600 text-white text-center py-2 px-4 rounded-md hover:bg-green-700"
              >
                Add New Product
              </Link>
            </div>
          </div>

          {/* Reports */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Reports</h2>
            <p className="text-gray-600 mb-4">View sales and analytics</p>
            <Link
              href="/admin/reports"
              className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700"
            >
              View Reports
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}