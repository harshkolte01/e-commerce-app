const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
};

// Auth API
export const authAPI = {
  register: (userData: { name: string; email: string; password: string }) => 
    apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials: { email: string; password: string }) => 
    apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  me: () => apiRequest('/api/auth/me'),
};

// Products API
export const productsAPI = {
  getAll: (params: Record<string, string> = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/api/products${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: string) => apiRequest(`/api/products/${id}`),

  create: (productData: any) => 
    apiRequest('/api/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),

  update: (id: string, productData: any) => 
    apiRequest(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    }),

  delete: (id: string) => 
    apiRequest(`/api/products/${id}`, {
      method: 'DELETE',
    }),
};

// Orders API
export const ordersAPI = {
  getAll: (params: Record<string, string> = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/api/orders${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: string) => apiRequest(`/api/orders/${id}`),
};

// Checkout API
export const checkoutAPI = {
  createOrder: (items: { productId: string; quantity: number }[]) => 
    apiRequest('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ items }),
    }),
};