import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface ProductVariant {
  id: number;
  colorVariant: string;
  stockQuantity: number;
  images: string[];
}

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
  variants?: ProductVariant[];
}

interface CartItem extends Product {
  quantity: number;
}

interface ProductContextType {
  allFurnitureSets: Product[];
  availableProducts: Product[];
  bundles: any[];
  isLoading: boolean;
  setAllFurnitureSets: (products: Product[]) => void;
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  reloadProducts: () => Promise<void>;
  loadBundles: () => Promise<void>;
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
    inStock: true,
    supplierArticle: '',
    stockQuantity: null,
    variantGroupId: '',
    colorVariant: ''
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
    inStock: true,
    supplierArticle: '',
    stockQuantity: null,
    variantGroupId: '',
    colorVariant: ''
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
    inStock: true,
    supplierArticle: '',
    stockQuantity: null,
    variantGroupId: '',
    colorVariant: ''
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
    inStock: true,
    supplierArticle: '',
    stockQuantity: null,
    variantGroupId: '',
    colorVariant: ''
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
    inStock: true,
    supplierArticle: '',
    stockQuantity: null,
    variantGroupId: '',
    colorVariant: ''
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
    inStock: true,
    supplierArticle: '',
    stockQuantity: null,
    variantGroupId: '',
    colorVariant: ''
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
    inStock: false,
    supplierArticle: '',
    stockQuantity: null,
    variantGroupId: '',
    colorVariant: ''
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
    inStock: true,
    supplierArticle: '',
    stockQuantity: null,
    variantGroupId: '',
    colorVariant: ''
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
    inStock: true,
    supplierArticle: '',
    stockQuantity: null,
    variantGroupId: '',
    colorVariant: ''
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
    inStock: true,
    supplierArticle: '',
    stockQuantity: null,
    variantGroupId: '',
    colorVariant: ''
  }
];

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [allFurnitureSets, setAllFurnitureSets] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Загружаем товары из БД при старте
  useEffect(() => {
    const loadProducts = async () => {
      console.log('\n🚀 ЗАГРУЗКА КАТАЛОГА ИЗ БАЗЫ ДАННЫХ');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      try {
        const response = await fetch('https://functions.poehali.dev/eecf4811-c6f1-4f6c-be05-ab02dae44689');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        const products = Array.isArray(data) ? data : [];
        
        console.log('📦 Загружено товаров из БД:', products.length);
        
        if (products.length === 0) {
          console.log('⚠️ БД пуста - использую дефолтные товары');
          setAllFurnitureSets(initialProducts);
        } else {
          // Преобразуем формат БД в формат приложения
          const normalized = products.map((p: any) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            price: typeof p.price === 'number' ? `${p.price} ₽` : p.price,
            image: p.images?.[0] || '',
            images: p.images || [],
            items: p.items || [],
            style: p.style || 'Современный',
            description: p.description || '',
            colors: p.colors || [],
            inStock: p.in_stock !== false,
            supplierArticle: p.supplier_article || '',
            stockQuantity: p.stock_quantity || null,
            variantGroupId: p.variant_group_id || '',
            colorVariant: p.color_variant || '',
            variants: []
          }));
          
          // Группируем товары по variant_group_id
          const grouped = new Map<string, any>();
          const standalone: any[] = [];
          
          normalized.forEach((product: any) => {
            // Если товар имеет variant_group_id - группируем
            if (product.variantGroupId) {
              if (!grouped.has(product.variantGroupId)) {
                // Первый товар в группе становится основным
                grouped.set(product.variantGroupId, {
                  ...product,
                  variants: [{
                    id: product.id,
                    colorVariant: product.colorVariant,
                    stockQuantity: product.stockQuantity,
                    images: product.images
                  }]
                });
              } else {
                // Добавляем как вариант к существующему товару
                const mainProduct = grouped.get(product.variantGroupId);
                mainProduct.variants.push({
                  id: product.id,
                  colorVariant: product.colorVariant,
                  stockQuantity: product.stockQuantity,
                  images: product.images
                });
              }
            } else {
              // Товары без группы показываем отдельно
              standalone.push(product);
            }
          });
          
          // Объединяем: сначала сгруппированные, потом отдельные
          const finalProducts = [...Array.from(grouped.values()), ...standalone];
          
          setAllFurnitureSets(finalProducts);
          console.log('✅ Каталог готов:', finalProducts.length, 'товаров (после группировки из', normalized.length, ')');
          console.log('📊 Сгруппировано:', grouped.size, 'групп,', standalone.length, 'отдельных товаров');
        }
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      } catch (error) {
        console.error('❌ Ошибка загрузки из БД:', error);
        console.log('⚠️ Использую дефолтные товары');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        setAllFurnitureSets(initialProducts);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
    
    // Автоматическое обновление каждые 30 минут
    const intervalId = setInterval(() => {
      console.log('🔄 Автоматическое обновление каталога...');
      loadProducts();
    }, 30 * 60 * 1000); // 30 минут
    
    return () => clearInterval(intervalId);
  }, []);
  
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('larana-cart');
      if (!saved) return [];
      
      const parsed = JSON.parse(saved);
      // Проверяем, что у товаров есть все необходимые поля
      const isValid = Array.isArray(parsed) && parsed.every((item: any) => 
        item.id && item.title && item.price && item.quantity
      );
      
      if (!isValid) {
        console.warn('⚠️ Корзина содержит устаревшие данные, очищаем');
        localStorage.removeItem('larana-cart');
        return [];
      }
      
      return parsed;
    } catch (error) {
      console.error('❌ Ошибка загрузки корзины:', error);
      localStorage.removeItem('larana-cart');
      return [];
    }
  });

  // Функция для перезагрузки товаров из БД (для админки)
  const [bundles, setBundles] = useState<any[]>([]);

  const loadBundles = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/e73f89da-d34f-4de2-ab51-fc42b74e5a69');
      if (response.ok) {
        const data = await response.json();
        setBundles(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки наборов:', error);
    }
  };

  const reloadProducts = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/c69aa5c0-9a2e-48aa-a1fc-14db5d5b3503');
      if (response.ok) {
        const data = await response.json();
        const products = Array.isArray(data) ? data : [];
        
        const normalized = products.map((p: any) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          price: typeof p.price === 'number' ? `${p.price} ₽` : p.price,
          image: p.images?.[0] || '',
          images: p.images || [],
          items: p.items || [],
          style: p.style || 'Современный',
          description: p.description || '',
          colors: p.colors || [],
          inStock: p.in_stock !== false,
          supplierArticle: p.supplier_article || '',
          stockQuantity: p.stock_quantity || null,
          variantGroupId: p.variant_group_id || '',
          colorVariant: p.color_variant || ''
        }));
        
        setAllFurnitureSets(normalized);
        console.log('✅ Каталог перезагружен:', normalized.length, 'товаров');
      }
    } catch (error) {
      console.error('❌ Ошибка перезагрузки:', error);
    }
  };
  
  useEffect(() => {
    loadBundles();
  }, []);

  useEffect(() => {
    const handleReload = () => reloadProducts();
    window.addEventListener('larana-products-updated', handleReload);
    return () => window.removeEventListener('larana-products-updated', handleReload);
  }, []);

  useEffect(() => {
    localStorage.setItem('larana-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product) => {
    console.log('🛒 Добавление в корзину:', product.title, 'ID:', product.id);
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        console.log('✅ Товар уже в корзине, увеличиваем количество');
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      console.log('✅ Добавляем новый товар в корзину');
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

  const availableProducts = [...allFurnitureSets, ...bundles]
    .filter(product => {
      // Если товар сгруппирован - проверяем остатки по всем вариантам
      if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
        const totalStock = product.variants.reduce((sum: number, v: any) => {
          return sum + (v.stockQuantity || 0);
        }, 0);
        return totalStock > 0;
      }
      
      // Обычная проверка для несгруппированных товаров
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