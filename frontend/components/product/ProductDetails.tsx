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
  updatedAt: string;
}

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      showToast('Please login to add items to cart', 'error');
      setTimeout(() => router.push('/auth/login'), 1500);
      return;
    }
    
    addToCart(product);
    showToast('Added to cart!');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
        <p className="text-gray-600 text-sm">SKU: {product.sku}</p>
      </div>

      <div className="mb-6">
        <span className="text-3xl font-bold text-blue-600">₹{product.price}</span>
      </div>

      {product.description && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <span className="text-sm font-medium text-gray-500">Category</span>
          <p className="text-gray-900">{product.category}</p>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-500">Stock</span>
          <p className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <span className="text-sm font-medium text-gray-500">Last Updated</span>
        <p className="text-gray-700">
          {new Date(product.updatedAt).toLocaleDateString()}
        </p>
      </div>

      <button
        onClick={handleAddToCart}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={product.stock === 0}
      >
        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
}