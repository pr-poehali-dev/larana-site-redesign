import { useState, useEffect } from 'react';
import { getAllProducts, createProduct, updateProduct, deleteProduct, Product } from '@/api/products';
import { useToast } from './use-toast';

export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const loadedProducts = await getAllProducts();
      setProducts(loadedProducts);
      localStorage.setItem('adminProducts', JSON.stringify(loadedProducts));
      localStorage.setItem('larana-products', JSON.stringify(loadedProducts));
      localStorage.setItem('larana-products-version', Date.now().toString());
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить товары из базы данных",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleProductUpdate = async (updatedProducts: Product[]) => {
    const currentProducts = products;
    
    for (const updatedProduct of updatedProducts) {
      const existing = currentProducts.find(p => p.id === updatedProduct.id);
      
      try {
        if (!existing) {
          const created = await createProduct(updatedProduct);
          if (created) {
            console.log('✅ Товар создан:', created.title);
          }
        } else {
          const updated = await updateProduct(updatedProduct.id, updatedProduct);
          if (updated) {
            console.log('✅ Товар обновлён:', updated.title);
          }
        }
      } catch (error) {
        console.error('Ошибка сохранения товара:', error);
        toast({
          title: "Ошибка сохранения",
          description: `Не удалось сохранить товар: ${updatedProduct.title}`,
          variant: "destructive"
        });
      }
    }

    const idsToKeep = new Set(updatedProducts.map(p => p.id));
    for (const currentProduct of currentProducts) {
      if (currentProduct.id && !idsToKeep.has(currentProduct.id)) {
        try {
          await deleteProduct(currentProduct.id);
          console.log('🗑️ Товар удалён:', currentProduct.title);
        } catch (error) {
          console.error('Ошибка удаления товара:', error);
        }
      }
    }

    await loadProducts();
    
    window.dispatchEvent(new CustomEvent('larana-products-updated', {
      detail: { count: updatedProducts.length, timestamp: new Date().toISOString() }
    }));
    
    toast({
      title: "Товары обновлены",
      description: `Изменения сохранены в базе данных`
    });
  };

  return {
    products,
    isLoading,
    handleProductUpdate,
    reloadProducts: loadProducts
  };
}
