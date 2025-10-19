import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Product {
  id: number;
  title: string;
  category: string;
  price: string;
  image: string;
  images?: string[];
  items: string[];
  style: string;
  description: string;
  colors: string[];
  inStock: boolean;
  supplierArticle?: string;
  stockQuantity?: number | null;
  variantGroupId?: string;
  colorVariant?: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface ProductContextType {
  allFurnitureSets: Product[];
  availableProducts: Product[];
  setAllFurnitureSets: (products: Product[]) => void;
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const initialProducts: Product[] = [
  {
    id: 1,
    title: 'Спальня "Сканди Мини"',
    category: 'Спальня',
    price: '38900 ₽',
    image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/d6e0d2f2-8f4d-41f4-b563-ea53d8e436e4.jpg',
    images: ['https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/d6e0d2f2-8f4d-41f4-b563-ea53d8e436e4.jpg'],
    items: ['Кровать 160', 'Шкаф 2Д', 'Тумбы'],
    style: 'Скандинавский',
    description: 'Кровать, 2 тумбы, шкаф, всё в скандинавском стиле. Идеально для молодых пар.',
    colors: ['Белый/дуб', 'серый/дуб'],
    inStock: true
  }
];

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [allFurnitureSets, setAllFurnitureSets] = useState<Product[]>(() => {
    const saved = localStorage.getItem('larana-products') || localStorage.getItem('adminProducts');
    if (saved) {
      try {
        const products = JSON.parse(saved);
        console.log('📦 Загружено товаров из localStorage:', products.length);
        return products;
      } catch (e) {
        console.error('Ошибка загрузки из localStorage');
      }
    }
    return initialProducts;
  });
  
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('larana-cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('larana-products', JSON.stringify(allFurnitureSets));
    localStorage.setItem('larana-products-version', Date.now().toString());
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'larana-products',
      newValue: JSON.stringify(allFurnitureSets)
    }));
  }, [allFurnitureSets]);

  useEffect(() => {
    localStorage.setItem('larana-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent | CustomEvent) => {
      if ('key' in e && e.key === 'larana-products' && e.newValue) {
        try {
          const updatedProducts = JSON.parse(e.newValue);
          setAllFurnitureSets(updatedProducts);
        } catch (error) {
          console.error('Error parsing storage update');
        }
      } else if (e.type === 'larana-products-updated') {
        const saved = localStorage.getItem('larana-products');
        if (saved) {
          try {
            const updatedProducts = JSON.parse(saved);
            setAllFurnitureSets(updatedProducts);
          } catch (error) {
            console.error('Error parsing custom event');
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange as EventListener);
    window.addEventListener('larana-products-updated', handleStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange as EventListener);
      window.removeEventListener('larana-products-updated', handleStorageChange as EventListener);
    };
  }, []);

  const availableProducts = allFurnitureSets.filter(product => product.inStock !== false);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <ProductContext.Provider
      value={{
        allFurnitureSets,
        availableProducts,
        setAllFurnitureSets,
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
      }}
    >
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