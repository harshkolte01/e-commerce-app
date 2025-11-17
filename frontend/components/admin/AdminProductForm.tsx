'use client';

import { useState, useEffect } from 'react';

interface Product {
  _id?: string;
  sku: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
}

interface AdminProductFormProps {
  product?: Product;
  onSubmit: (product: Omit<Product, '_id'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function AdminProductForm({ product, onSubmit, onCancel, isLoading }: AdminProductFormProps) {
  const [formData, setFormData] = useState({
    sku: product?.sku || '',
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    category: product?.category || '',
    stock: product?.stock || 0
  });

  // Auto-generate SKU for new products
  useEffect(() => {
    if (!product) {
      generateSKU(formData.category);
    }
  }, [product]);

  // Regenerate SKU when category changes (for new products only)
  useEffect(() => {
    if (!product && formData.category) {
      generateSKU(formData.category);
    }
  }, [formData.category, product]);

  const generateSKU = (category: string) => {
    if (!category) return;
    
    const categoryPrefixes: { [key: string]: string } = {
      'electronics': 'ELEC',
      'apparel': 'APP',
      'gaming': 'GAM'
    };
    
    const prefix = categoryPrefixes[category] || 'PROD';
    const randomNum = Math.floor(Math.random() * 900) + 100; // 3-digit number (100-999)
    const generatedSKU = `${prefix}-${randomNum.toString().padStart(3, '0')}`;
    
    setFormData(prev => ({ ...prev, sku: generatedSKU }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
          SKU *
        </label>
        <input
          type="text"
          id="sku"
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          required
          readOnly
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-100"
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price *
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select Category</option>
          <option value="electronics">Electronics</option>
          <option value="apparel">Apparel</option>
          <option value="gaming">Gaming</option>
        </select>
      </div>

      <div>
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
          Stock
        </label>
        <input
          type="number"
          id="stock"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}