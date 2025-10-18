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
    category: 'Спальни',
    price: '38900 ₽',
    image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/d6e0d2f2-8f4d-41f4-b563-ea53d8e436e4.jpg',
    images: ['https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/d6e0d2f2-8f4d-41f4-b563-ea53d8e436e4.jpg'],
    items: ['Кровать 160', 'Шкаф 2Д', 'Тумбы'],
    style: 'Скандинавский',
    description: 'Кровать, 2 тумбы, шкаф, всё в скандинавском стиле. Идеально для молодых пар.',
    colors: ['Белый/дуб', 'серый/дуб'],
    inStock: true
  },
  {
    id: 2,
    title: 'Спальня "Комфорт Люкс"',
    category: 'Спальни',
    price: '57900 ₽',
    image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/10717cc5-40db-4449-abd5-71b9d8b6c269.jpg',
    images: ['https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/10717cc5-40db-4449-abd5-71b9d8b6c269.jpg'],
    items: ['Кровать 180', 'Шкаф-купе', 'Комод', 'Зеркало'],
    style: 'Современный',
    description: 'Расширенный комплект: кровать, шкаф-купе, комод, зеркало. Цвет — дуб сонома.',
    colors: ['Дуб сонома', 'венге'],
    inStock: true
  },
  {
    id: 3,
    title: 'Кухня "Лара 180"',
    category: 'Кухни',
    price: '25900 ₽',
    image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/28dd2d42-f20f-4093-a79c-3581f1162a03.jpg',
    images: ['https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/28dd2d42-f20f-4093-a79c-3581f1162a03.jpg'],
    items: ['Фасады', 'Столешница', 'Фурнитура'],
    style: 'Современный',
    description: 'Базовая кухня 180 см, верх + низ, фасады белый глянец. Подходит для арендаторов.',
    colors: ['Белый глянец'],
    inStock: true
  },
  {
    id: 4,
    title: 'Кухня "Милан 240"',
    category: 'Кухни',
    price: '37900 ₽',
    image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/0ce710ad-5197-4e39-accf-50b5f8ffe640.jpg',
    images: ['https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/0ce710ad-5197-4e39-accf-50b5f8ffe640.jpg'],
    items: ['Фасады', 'Ручки', 'Фурнитура', 'Мойка'],
    style: 'Современный',
    description: '240 см, угловая, встроенная мойка и духовой шкаф. Белая глянцевая с серыми акцентами.',
    colors: ['Белый/серый'],
    inStock: true
  },
  {
    id: 5,
    title: 'Гостиная "Фиеста"',
    category: 'Гостиные',
    price: '42900 ₽',
    image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/3df816ee-8a95-4339-bf44-cda7f25d59a7.jpg',
    images: ['https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/3df816ee-8a95-4339-bf44-cda7f25d59a7.jpg'],
    items: ['Диван 3-местный', 'Журнальный стол', 'Тумба ТВ'],
    style: 'Современный',
    description: 'Современная гостиная: диван, столик, ТВ-тумба. Диван — механизм еврокнижка.',
    colors: ['Серый'],
    inStock: true
  },
  {
    id: 6,
    title: 'Гостиная "Модерн"',
    category: 'Гостиные',
    price: '52900 ₽',
    image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/5bcce75e-8fd6-45ae-bdac-3aade8786678.jpg',
    images: ['https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/5bcce75e-8fd6-45ae-bdac-3aade8786678.jpg'],
    items: ['Угловой диван', 'Стенка', 'Журнальный стол'],
    style: 'Современный',
    description: 'Угловой диван с механизмом дельфин + стенка + стол. Для просторной гостиной.',
    colors: ['Бежевый', 'коричневый'],
    inStock: true
  },
  {
    id: 7,
    title: 'Гостиная "Классика Плюс"',
    category: 'Гостиные',
    price: '64900 ₽',
    image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/c58a6ff8-f6db-4de5-8785-0293ccb4ea98.jpg',
    images: ['https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/c58a6ff8-f6db-4de5-8785-0293ccb4ea98.jpg'],
    items: ['Угловой диван', 'Кресло', 'Стенка', 'Стол'],
    style: 'Классика',
    description: 'Полная комплектация классической гостиной: диван, кресло, стенка, столик.',
    colors: ['Бежевый'],
    inStock: false
  },
  {
    id: 8,
    title: 'Шкаф-купе "Комфорт 180"',
    category: 'Шкафы',
    price: '29900 ₽',
    image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/d50db947-51b9-44ed-9994-f0075c68c626.jpg',
    images: ['https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/d50db947-51b9-44ed-9994-f0075c68c626.jpg'],
    items: ['Шкаф 180см'],
    style: 'Современный',
    description: 'Шкаф-купе 180 см, 2 двери с зеркалами. Глубина 60 см, высота 220 см.',
    colors: ['Венге', 'дуб'],
    inStock: true
  },
  {
    id: 9,
    title: 'Шкаф-купе "Макси 240"',
    category: 'Шкафы',
    price: '39900 ₽',
    image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/289830eb-e60b-426f-9f3c-8e92e8eef16a.jpg',
    images: ['https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/289830eb-e60b-426f-9f3c-8e92e8eef16a.jpg'],
    items: ['Шкаф 240см'],
    style: 'Современный',
    description: 'Большой шкаф 240 см, 3 двери. С антресолью и зеркальными вставками.',
    colors: ['Белый', 'венге'],
    inStock: true
  },
  {
    id: 10,
    title: 'Прихожая "Лайт"',
    category: 'Прихожие',
    price: '19900 ₽',
    image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/d673daa8-2d56-408f-84f4-d906def95350.jpg',
    images: ['https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/d673daa8-2d56-408f-84f4-d906def95350.jpg'],
    items: ['Шкаф', 'Зеркало', 'Полка обувная'],
    style: 'Скандинавский',
    description: 'Компактная прихожая: шкаф, зеркало, обувница. Для небольших квартир.',
    colors: ['Белый'],
    inStock: true
  }
];

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [allFurnitureSets, setAllFurnitureSets] = useState<Product[]>(() => {
    const saved = localStorage.getItem('larana-products');
    if (saved) {
      try {
        const products = JSON.parse(saved);
        // Нормализуем товары - добавляем обязательные поля если их нет
        return products.map((p: any) => ({
          ...p,
          items: p.items || [],
          style: p.style || 'Современный',
          description: p.description || p.title || '',
          colors: p.colors || ['Базовый'],
          images: p.images || [p.image]
        }));
      } catch (e) {
        console.error('Error parsing products:', e);
        return initialProducts;
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
  }, [allFurnitureSets]);

  // Слушаем изменения в localStorage (когда админка обновляет товары)
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('larana-products');
      if (saved) {
        try {
          const products = JSON.parse(saved);
          console.log('🔄 Обновление товаров из localStorage:', products.length);
          setAllFurnitureSets(products.map((p: any) => ({
            ...p,
            items: p.items || [],
            style: p.style || 'Современный',
            description: p.description || p.title || '',
            colors: p.colors || ['Базовый'],
            images: p.images || [p.image]
          })));
        } catch (e) {
          console.error('Error parsing products:', e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('larana-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
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
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Фильтруем только товары в наличии для отображения на сайте
  const availableProducts = allFurnitureSets.filter(product => product.inStock !== false);

  return (
    <ProductContext.Provider value={{ 
      allFurnitureSets, 
      availableProducts,
      setAllFurnitureSets,
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
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