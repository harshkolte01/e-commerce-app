'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProductDetails from '@/components/product/ProductDetails';
import { productsAPI } from '@/lib/api';

interface Product {
  _id: string;
  sku: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  updatedAt: string;
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
    }
  }, [params.id]);

  const fetchProduct = async (id: string) => {
    try {
      setLoading(true);
      const data = await productsAPI.getById(id);
      setProduct(data);
    } catch (err) {
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Product not found'}</p>
          <button
            onClick={() => router.push('/products')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => router.push('/products')}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          ← Back to Products
        </button>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <ProductDetails product={product} />
      </div>
    </div>
  );
}