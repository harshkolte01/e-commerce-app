'use client';

import { useState, useEffect, useCallback } from 'react';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilter from '@/components/product/ProductFilter';
import Pagination from '@/components/Pagination';
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

interface ProductsResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 12;

  // Filter 
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  // Debouncing for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); 

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedCategory, debouncedSearchTerm, sortBy]);

  const fetchCategories = async () => {
    try {
      // Fetch all products to get unique categories
      const data = await productsAPI.getAll({ page: '1', limit: '1000' });
      const productsArray = Array.isArray(data?.items) ? data.items : [];
      const uniqueCategories = [...new Set(productsArray.map((p: Product) => p.category))] as string[];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const params: Record<string, string> = {
        page: currentPage.toString(),
        limit: pageSize.toString(),
      };

      if (selectedCategory) {
        params.category = selectedCategory;
      }

      if (debouncedSearchTerm) {
        params.q = debouncedSearchTerm;
      }

      if (sortBy) {
        params.sort = sortBy;
      }

      const data: ProductsResponse = await productsAPI.getAll(params);
      
      const productsArray = Array.isArray(data?.items) ? data.items : [];
      setProducts(productsArray);
      setTotalProducts(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / pageSize));
      
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
      setProducts([]); 
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); 
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1); 
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Products</h1>
      
      <ProductFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />

      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          Showing {products.length} of {totalProducts} products
        </p>
        <p className="text-gray-600">
          Page {currentPage} of {totalPages}
        </p>
      </div>

      <ProductGrid products={products} />

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}