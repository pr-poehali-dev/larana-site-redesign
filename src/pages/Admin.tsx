import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/contexts/ProductContext';
import OrdersTab from '@/components/admin/OrdersTab';
import ProductsTab from '@/components/admin/ProductsTab';
import EmployeesTab from '@/components/admin/EmployeesTab';
import StatisticsTab from '@/components/admin/StatisticsTab';
import OzonImportTab from '@/components/admin/OzonImportTab';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminMobileMenu from '@/components/admin/AdminMobileMenu';
import AdminStatsCards from '@/components/admin/AdminStatsCards';
import { defaultProducts } from '@/data/defaultProducts';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('statistics');
  const { allFurnitureSets, setAllFurnitureSets } = useProducts();
  const [products, setProducts] = useState(defaultProducts);
  const { toast } = useToast();

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const savedProducts = localStorage.getItem('adminProducts');
    if (savedProducts) {
      try {
        const loadedProducts = JSON.parse(savedProducts);
        
        // Нормализация категорий к единственному числу
        const normalizeCategory = (category: string) => {
          const categoryMap: Record<string, string> = {
            'Гостиные': 'Гостиная',
            'Спальни': 'Спальня',
            'Кухни': 'Кухня',
            'Прихожие': 'Прихожая'
          };
          return categoryMap[category] || category;
        };
        
        // Исправляем товары импортированные с Ozon (у них есть supplierArticle)
        const fixedProducts = loadedProducts.map((product: any) => {
          let fixed = product;
          
          if (product.supplierArticle && product.price && product.price.startsWith('http')) {
            // Это битый товар с Ozon - цена содержит ссылку на фото
            console.log('Исправляю товар с Ozon:', product.title);
            
            fixed = {
              ...product,
              price: '0 ₽', // Сбрасываем цену
              image: product.images?.[0] || product.price, // Берём первое фото из images или из price
              images: product.images || [product.price] // Сохраняем все фото
            };
          }
          
          // Очищаем ссылки на изображения от символа ₽ и других валют
          const cleanImageUrl = (url: string) => {
            if (!url) return url;
            // Удаляем символ валюты и всё что после него (включая русское Р и английское P с пробелами)
            const cleaned = url
              .replace(/\s*[₽₸₴€$£¥Р]\s*.*$/, '') // Удаляем валюты с пробелами
              .replace(/\s+₽.*$/, '') // Удаляем ₽ с любыми пробелами
              .replace(/₽.*$/, '') // Удаляем просто ₽
              .split(' ')[0] // Берем только первую часть до пробела
              .trim();
            
            // Проверяем что это валидная ссылка
            return cleaned.startsWith('http') ? cleaned : url;
          };
          
          const cleanedImage = cleanImageUrl(fixed.image || '');
          const cleanedImages = (fixed.images || []).map(cleanImageUrl);
          
          // Очищаем описание от фразы "Товар импортирован из Ozon."
          const cleanedDescription = (fixed.description || fixed.title || '')
            .replace(/\.\s*Товар импортирован из Ozon\./g, '')
            .replace(/Товар импортирован из Ozon\.\s*/g, '')
            .trim();
          
          // Округляем цену до целого числа
          const roundPrice = (price: string) => {
            if (!price) return '0 ₽';
            const numericValue = price.replace(/[^\d.,]/g, '').replace(',', '.');
            const rounded = Math.round(parseFloat(numericValue) || 0);
            return `${rounded} ₽`;
          };
          
          // Добавляем обязательные поля для каталога
          return {
            ...fixed,
            category: normalizeCategory(fixed.category || 'Гостиная'),
            price: roundPrice(fixed.price || '0 ₽'),
            image: cleanedImage,
            images: cleanedImages.length > 0 ? cleanedImages : [cleanedImage],
            items: fixed.items || [],
            style: fixed.style || 'Современный',
            description: cleanedDescription || fixed.title || '',
            colors: fixed.colors || ['Базовый']
          };
        });
        
        setProducts(fixedProducts);
        
        // Сохраняем исправленные данные
        if (JSON.stringify(fixedProducts) !== savedProducts) {
          localStorage.setItem('adminProducts', JSON.stringify(fixedProducts));
          localStorage.setItem('larana-products', JSON.stringify(fixedProducts));
          console.log('✅ Исправлено товаров с Ozon');
        } else {
          // Даже если не было исправлений, синхронизируем с каталогом
          localStorage.setItem('larana-products', JSON.stringify(fixedProducts));
        }
      } catch (error) {
        console.error('Error loading products:', error);
      }
    } else {
      // Если нет сохранённых товаров, синхронизируем дефолтные с каталогом
      localStorage.setItem('adminProducts', JSON.stringify(defaultProducts));
      localStorage.setItem('larana-products', JSON.stringify(defaultProducts));
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    toast({
      title: "Выход выполнен",
      description: "Вы вышли из админ-панели"
    });
  };

  const handleProductUpdate = (updatedProducts: any[]) => {
    // Нормализация категорий к единственному числу
    const normalizeCategory = (category: string) => {
      const categoryMap: Record<string, string> = {
        'Гостиные': 'Гостиная',
        'Спальни': 'Спальня',
        'Кухни': 'Кухня',
        'Прихожие': 'Прихожая'
      };
      return categoryMap[category] || category;
    };
    
    // Очищаем ссылки на изображения от символа ₽
    const cleanImageUrl = (url: string) => {
      if (!url) return url;
      const cleaned = url
        .replace(/\s*[₽₸₴€$£¥Р]\s*.*$/, '')
        .replace(/\s+₽.*$/, '')
        .replace(/₽.*$/, '')
        .split(' ')[0]
        .trim();
      return cleaned.startsWith('http') ? cleaned : url;
    };
    
    // Округляем цену до целого числа
    const roundPrice = (price: string) => {
      if (!price) return '0 ₽';
      const numericValue = price.replace(/[^\d.,]/g, '').replace(',', '.');
      const rounded = Math.round(parseFloat(numericValue) || 0);
      return `${rounded} ₽`;
    };
    
    // Добавляем обязательные поля для товаров, если их нет
    const normalizedProducts = updatedProducts.map(product => ({
      ...product,
      category: normalizeCategory(product.category || 'Гостиная'),
      price: roundPrice(product.price || '0 ₽'),
      image: cleanImageUrl(product.image || ''),
      images: (product.images || [product.image]).map(cleanImageUrl),
      items: product.items || [],
      style: product.style || 'Современный',
      description: product.description || product.title || '',
      colors: product.colors || ['Базовый']
    }));
    
    console.log('🔄 Обновление товаров:', normalizedProducts.length);
    console.log('📦 Пример товара:', normalizedProducts[0]);
    
    setProducts(normalizedProducts);
    setAllFurnitureSets(normalizedProducts); // Обновляем глобальный контекст
    localStorage.setItem('adminProducts', JSON.stringify(normalizedProducts));
    localStorage.setItem('larana-products', JSON.stringify(normalizedProducts)); // Синхронизируем с каталогом
    
    console.log('✅ Товары обновлены в контексте и localStorage');
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <>
      <Helmet>
        <title>Админ-панель | LARANA</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <AdminHeader onLogout={handleLogout} />

        <main className="container mx-auto px-3 md:px-4 py-4 md:py-8">
          <AdminStatsCards productsCount={products.length} />
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <AdminMobileMenu
              open={mobileMenuOpen}
              onOpenChange={setMobileMenuOpen}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            <TabsList className="hidden md:grid w-full grid-cols-3 md:grid-cols-5 gap-1">
              <TabsTrigger value="statistics" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                <Icon name="BarChart3" size={14} className="md:w-4 md:h-4" />
                <span className="hidden sm:inline">Статистика</span>
                <span className="sm:hidden">Стат</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                <Icon name="ShoppingBag" size={14} className="md:w-4 md:h-4" />
                <span className="hidden sm:inline">Заказы</span>
                <span className="sm:hidden">Зак</span>
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                <Icon name="Package" size={14} className="md:w-4 md:h-4" />
                <span className="hidden sm:inline">Товары</span>
                <span className="sm:hidden">Тов</span>
              </TabsTrigger>
              <TabsTrigger value="ozon" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                <Icon name="Download" size={14} className="md:w-4 md:h-4" />
                Ozon
              </TabsTrigger>
              <TabsTrigger value="employees" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                <Icon name="Users" size={14} className="md:w-4 md:h-4" />
                <span className="hidden sm:inline">Сотрудники</span>
                <span className="sm:hidden">Сотр</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="statistics" className="space-y-4">
              <StatisticsTab />
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Управление заказами</CardTitle>
                  <CardDescription>
                    Просматривайте и обновляйте статусы заказов
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OrdersTab />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Управление товарами</CardTitle>
                  <CardDescription>
                    Добавляйте, редактируйте и удаляйте товары
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProductsTab 
                    products={products}
                    onProductUpdate={handleProductUpdate}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ozon" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Интеграция с Ozon</CardTitle>
                  <CardDescription>
                    Загружайте товары из вашего магазина на Ozon
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OzonImportTab 
                    products={products}
                    onProductsUpdate={handleProductUpdate}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="employees" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Управление сотрудниками</CardTitle>
                  <CardDescription>
                    Добавляйте и управляйте доступом сотрудников
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EmployeesTab />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
};

export default Admin;