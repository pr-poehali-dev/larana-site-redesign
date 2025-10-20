import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, CartItem, ProductContextType } from './product/types';
import { initialProducts } from './product/initialProducts';
import { loadProductsFromDB, loadBundlesFromDB } from './product/productLoaders';
import { 
  loadCartFromStorage, 
  saveCartToStorage, 
  addProductToCart, 
  removeProductFromCart, 
  updateProductQuantity 
} from './product/cartUtils';

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [allFurnitureSets, setAllFurnitureSets] = useState<Product[]>([]);
  const [bundles, setBundles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>(loadCartFromStorage);

  const reloadProducts = async () => {
    try {
      const products = await loadProductsFromDB();
      setAllFurnitureSets(products);
    } catch (error) {
      console.error('Ошибка перезагрузки товаров:', error);
      setAllFurnitureSets(initialProducts);
    }
  };

  const loadBundles = async () => {
    try {
      const loadedBundles = await loadBundlesFromDB();
      setBundles(loadedBundles);
    } catch (error) {
      console.error('Ошибка загрузки наборов:', error);
      setBundles([]);
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await loadProductsFromDB();
        setAllFurnitureSets(products);
      } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
        setAllFurnitureSets(initialProducts);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
    
    const intervalId = setInterval(() => {
      console.log('🔄 Автоматическое обновление каталога...');
      loadProducts();
    }, 30 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    loadBundles();
  }, []);

  useEffect(() => {
    const handleReload = () => reloadProducts();
    window.addEventListener('larana-products-updated', handleReload);
    return () => window.removeEventListener('larana-products-updated', handleReload);
  }, []);

  useEffect(() => {
    saveCartToStorage(cartItems);
  }, [cartItems]);

  const addToCart = (product: Product) => {
    setCartItems(prev => addProductToCart(prev, product));
  };

  const removeFromCart = (id: number) => {
    setCartItems(prev => removeProductFromCart(prev, id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCartItems(prev => updateProductQuantity(prev, id, quantity));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const availableProducts = [...allFurnitureSets, ...bundles]
    .filter(product => {
      if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
        const totalStock = product.variants.reduce((sum: number, v: any) => {
          return sum + (v.stockQuantity || 0);
        }, 0);
        return totalStock > 0;
      }
      
      if (product.stockQuantity !== null && product.stockQuantity !== undefined) {
        return product.stockQuantity > 0;
      }
      return product.inStock !== false;
    })
    .sort((a, b) => {
      const aHasImage = a.image && a.image.startsWith('http');
      const bHasImage = b.image && b.image.startsWith('http');
      
      if (aHasImage && !bHasImage) return -1;
      if (!aHasImage && bHasImage) return 1;
      
      return 0;
    });

  return (
    <ProductContext.Provider value={{ 
      allFurnitureSets, 
      availableProducts,
      bundles,
      isLoading,
      setAllFurnitureSets,
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      reloadProducts,
      loadBundles
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
};
