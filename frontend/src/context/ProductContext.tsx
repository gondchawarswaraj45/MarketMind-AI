import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, ApiResponse } from '../types';
import apiClient from '../services/api';
import { useAuth } from './AuthContext';

interface ProductContextType {
  products: Product[];
  activeProduct: Product | null;
  isLoading: boolean;
  setActiveProduct: (product: Product | null) => void;
  fetchProducts: () => Promise<void>;
  createProduct: (data: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>('/products');
      const list = response.data.data || [];
      setProducts(list);
      
      if (list.length > 0) {
        if (!activeProduct || !list.some(p => p.id === activeProduct.id)) {
          setActiveProduct(list[0]);
        }
      } else {
        setActiveProduct(null);
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    } else {
      setProducts([]);
      setActiveProduct(null);
    }
  }, [isAuthenticated]);

  const createProduct = async (data: Partial<Product>): Promise<Product> => {
    const response = await apiClient.post<ApiResponse<Product>>('/products', data);
    const newProduct = response.data.data;
    setProducts(prev => [newProduct, ...prev]);
    setActiveProduct(newProduct);
    return newProduct;
  };

  const deleteProduct = async (id: string) => {
    await apiClient.delete(`/products/${id}`);
    setProducts(prev => prev.filter(p => p.id !== id));
    if (activeProduct?.id === id) {
      const remaining = products.filter(p => p.id !== id);
      setActiveProduct(remaining.length > 0 ? remaining[0] : null);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        activeProduct,
        isLoading,
        setActiveProduct,
        fetchProducts,
        createProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};
