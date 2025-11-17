import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';

interface Product {
  _id: string;
  sku: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      showToast('Please login to add items to cart', 'error');
      setTimeout(() => router.push('/auth/login'), 1500);
      return;
    }
    
    addToCart(product);
    showToast('Added to cart!');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <Link href={`/products/${product._id}`}>
        <div className="cursor-pointer">
          <h3 className="font-semibold text-lg mb-2 text-gray-900 hover:text-blue-600">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xl font-bold text-blue-600">₹{product.price}</span>
            <span className="text-sm text-gray-500">Stock: {product.stock}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              {product.category}
            </span>
            <span className="text-xs text-gray-500">SKU: {product.sku}</span>
          </div>
        </div>
      </Link>
      <button
        onClick={handleAddToCart}
        className="w-full mt-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={product.stock === 0}
      >
        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
}