'use client';

import { useState } from 'react';

export const useApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const callApi = async <T>(apiFunction: (...args: any[]) => Promise<T>, ...args: any[]): Promise<T> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(...args);
      setLoading(false);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  return {
    loading,
    error,
    callApi,
  };
};