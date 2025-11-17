'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { productsAPI } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsAPI.getAll({ page: '1', limit: '8' });
        setProducts(data.items);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: any) => {
    if (!isAuthenticated) {
      showToast('Please login to add items to cart', 'error');
      setTimeout(() => router.push('/auth/login'), 1500);
      return;
    }
    
    addToCart(product);
    showToast('Added to cart!');
  };

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  const handleShowMore = () => {
    router.push('/products');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Welcome to E-COMM</h1>
      
      {loading ? (
        <div className="text-center">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              <div 
                className="cursor-pointer"
                onClick={() => handleProductClick(product._id)}
              >
                <h3 className="font-semibold text-lg mb-2 hover:text-blue-600">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xl font-bold text-blue-600">₹{product.price}</span>
                  <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {product.category}
                  </span>
                  <span className="text-xs text-gray-500">SKU: {product.sku}</span>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
                className="w-full mt-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          ))}
        </div>
      )}
      
      {!loading && products.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={handleShowMore}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Show More Products
          </button>
        </div>
      )}
    </div>
  );
}
