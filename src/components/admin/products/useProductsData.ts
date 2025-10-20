import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import func2url from '@/../backend/func2url.json';

export const useProductsData = (onProductUpdate: (products: any[]) => void) => {
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadProductsFromDB();
  }, []);

  const loadProductsFromDB = async (forceRefresh = false) => {
    const CACHE_KEY = 'admin_products_cache';
    const CACHE_TIMESTAMP_KEY = 'admin_products_cache_timestamp';
    const CACHE_DURATION = 5 * 60 * 1000;

    if (!forceRefresh) {
      try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
        
        if (cachedData && cachedTimestamp) {
          const age = Date.now() - parseInt(cachedTimestamp);
          
          if (age < CACHE_DURATION) {
            const formattedProducts = JSON.parse(cachedData);
            setDbProducts(formattedProducts);
            onProductUpdate(formattedProducts);
            setLastSync(new Date(parseInt(cachedTimestamp)));
            setLoadingProducts(false);
            
            console.log(`📦 Загружено из кэша: ${formattedProducts.length} товаров (кэш свежий ${Math.round(age / 1000)}с)`);
            
            toast({
              title: "Товары загружены из кэша",
              description: `${formattedProducts.length} товаров (обновлено ${Math.round(age / 1000)}с назад)`,
              duration: 2000
            });
            
            return;
          } else {
            console.log('🕐 Кэш устарел, загружаю свежие данные из БД');
          }
        }
      } catch (error) {
        console.warn('Ошибка чтения кэша:', error);
      }
    }

    setLoadingProducts(true);
    try {
      const response = await fetch(func2url['products'], {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const formattedProducts = data.map((p: any) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          description: p.description,
          price: typeof p.price === 'number' ? `${p.price} ₽` : p.price,
          discountPrice: p.discount_price ? (typeof p.discount_price === 'number' ? `${p.discount_price} ₽` : p.discount_price) : null,
          category: p.category,
          style: p.style,
          colors: Array.isArray(p.colors) ? p.colors : (typeof p.colors === 'string' ? JSON.parse(p.colors) : []),
          images: Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images) : []),
          image: Array.isArray(p.images) ? p.images[0] : (typeof p.images === 'string' ? JSON.parse(p.images)[0] : p.images),
          items: Array.isArray(p.items) ? p.items : (typeof p.items === 'string' ? JSON.parse(p.items) : []),
          inStock: p.in_stock,
          isNew: p.is_new,
          supplierArticle: p.supplier_article,
          stockQuantity: p.stock_quantity,
          variantGroupId: p.variant_group_id,
          colorVariant: p.color_variant
        }));
        
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(formattedProducts));
          localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
        } catch (error) {
          console.warn('Не удалось сохранить в кэш:', error);
        }
        
        setDbProducts(formattedProducts);
        onProductUpdate(formattedProducts);
        setLastSync(new Date());
        
        console.log(`✅ Загружено товаров из БД: ${formattedProducts.length}`);
        
        toast({
          title: forceRefresh ? "Каталог обновлён" : "Товары загружены",
          description: `Загружено ${formattedProducts.length} товаров из базы данных`
        });
      }
    } catch (error) {
      console.error('Ошибка загрузки товаров из БД:', error);
      toast({
        title: 'Предупреждение',
        description: 'Не удалось загрузить товары из БД, используются локальные данные',
        variant: 'default'
      });
    } finally {
      setLoadingProducts(false);
    }
  };

  return {
    dbProducts,
    loadingProducts,
    lastSync,
    loadProductsFromDB
  };
};
