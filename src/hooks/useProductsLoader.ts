import { useState, useEffect } from 'react';
import { Product } from '@/types/admin';
import { defaultProducts } from '@/data/defaultProducts';
import { processProducts } from '@/utils/productProcessing';

export const useProductsLoader = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const savedProducts = localStorage.getItem('adminProducts');
    if (savedProducts) {
      try {
        const loadedProducts = JSON.parse(savedProducts);
        const fixedProducts = processProducts(loadedProducts);
        
        setProducts(fixedProducts);
        
        if (JSON.stringify(fixedProducts) !== savedProducts) {
          localStorage.setItem('adminProducts', JSON.stringify(fixedProducts));
          localStorage.setItem('larana-products', JSON.stringify(fixedProducts));
          console.log('✅ Исправлено товаров с Ozon');
        } else {
          localStorage.setItem('larana-products', JSON.stringify(fixedProducts));
        }
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts(defaultProducts as Product[]);
        localStorage.setItem('adminProducts', JSON.stringify(defaultProducts));
        localStorage.setItem('larana-products', JSON.stringify(defaultProducts));
      }
    } else {
      setProducts(defaultProducts as Product[]);
      localStorage.setItem('adminProducts', JSON.stringify(defaultProducts));
      localStorage.setItem('larana-products', JSON.stringify(defaultProducts));
    }
  }, []);

  const handleProductUpdate = (updatedProducts: Product[]) => {
    console.log('💾 Сохранение товаров в localStorage');
    
    localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
    localStorage.setItem('larana-products', JSON.stringify(updatedProducts));
    
    setProducts(updatedProducts);
    
    window.dispatchEvent(new CustomEvent('larana-products-updated', {
      detail: { count: updatedProducts.length, timestamp: new Date().toISOString() }
    }));
  };

  return {
    products,
    handleProductUpdate
  };
};
