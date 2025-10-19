import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useAdminProducts } from '@/hooks/useAdminProducts';
import OrdersTab from '@/components/admin/OrdersTab';
import ProductsTab from '@/components/admin/ProductsTab';
import EmployeesTab from '@/components/admin/EmployeesTab';
import StatisticsTab from '@/components/admin/StatisticsTab';
import OzonImportTab from '@/components/admin/OzonImportTab';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminMobileMenu from '@/components/admin/AdminMobileMenu';
import AdminStatsCards from '@/components/admin/AdminStatsCards';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('statistics');
  const { products, isLoading, handleProductUpdate } = useAdminProducts();
  const { toast } = useToast();

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const savedProducts = localStorage.getItem('adminProducts');
    if (savedProducts && false) {
      try {
        const loadedProducts = JSON.parse(savedProducts);
        
        // Список товаров для удаления
        const productsToDelete = [
          'Товар Ц0084746',
          'Товар Ц0084980',
          'Товар Ц0064609',
          'Товар Ц0081949',
          'Товар Ц0084981',
          'Товар Ц0065338',
          'Товар Ц0084961',
          'Товар Ц0063649',
          'Товар Ц0063627',
          'Товар Ц0084979',
          'Товар Ц0084978',
          'Товар Ц0084972',
          'Товар Ц0050205',
          'Товар Ц0067418',
          'Товар Ц0081444',
          'Товар Ц0063873',
          'Товар Ц0075504',
          'Товар Ц0083200',
          'Товар Ц0063628',
          'Товар Ц0077915',
          'Товар Ц0084722',
          'Товар Ц0050203',
          'Товар Ц0075505',
          'Товар Ц0084927',
          'Товар Ц0050216',
          'Товар Ц0069392',
          'Товар Ц0050220',
          'Товар Ц0083692',
          'Товар Ц0084000',
          'Товар Ц0076594',
          'Товар Ц0064606',
          'Товар Ц0050207',
          'Товар Ц0081610',
          'Товар Ц0083202',
          'Товар Ц0067414',
          'Товар Ц0082327',
          'Товар Ц0067416',
          'Товар Ц0084445',
          'Товар Ц0084984',
          'Товар Ц0063875',
          'Товар Ц0064222',
          'Товар Ц0084977',
          'Товар Ц0050217',
          'Товар Ц0067420',
          'Товар Ц0082326',
          'Товар Ц0084975',
          'Товар Ц0065348',
          'Товар Ц0065347',
          'Товар Ц0064231',
          'Товар Ц0064227',
          'Товар PR-0018.1544',
          'Товар Ц0064237',
          'Товар Ц0075135',
          'Товар Ц0064225',
          'Товар Ц0064219',
          'Товар Ц0064238',
          'Товар Ц0081428',
          'Товар Ц0064228',
          'Товар Ц0065333',
          'Товар Ц0064263',
          'Товар Ц0064218',
          'Товар KM-0216.0133',
          'Товар NKL02S1.2.1623',
          'Товар KM-0216.1747',
          'Товар Ц0064239',
          'Товар Ц0084974',
          'Товар Ц0065344',
          'Товар SPV-1.05.1544',
          'Товар KM-0216.2120',
          'Товар Ц0084848',
          'Товар Ц0067523',
          'Товар TM-001.2.2173',
          'Товар Ц0064223',
          'Товар LMN-02.2342',
          'Товар P-014.1544',
          'Товар Ц0064347',
          'Товар Ц0064226',
          'Товар Ц0083414',
          'Товар Ц0066543',
          'Товар Ц0075137',
          'Товар KM-0216.1544',
          'Товар Ц0064229',
          'Товар Ц0075141',
          'Товар Ц0064232',
          'Товар KM-0216.0144',
          'Товар Ц0064230',
          'Товар Ц0074620',
          'Товар Ц0064235',
          'Товар TM-001.2.2172',
          'Товар Ц0064220',
          'Товар PR-0018.0739',
          'Товар PR-0018.0144',
          'Товар Ц0064217',
          'Товар LMN-02.1797',
          'Товар Ц0084847',
          'Товар Ц0075132'
        ];
        
        // Удаляем указанные товары
        const filteredProducts = loadedProducts.filter((product: any) => 
          !productsToDelete.includes(product.title)
        );
        
        console.log(`🗑️ Удалено товаров: ${loadedProducts.length - filteredProducts.length}`);
        
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
        const fixedProducts = filteredProducts.map((product: any) => {
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
          
          // Очищаем ссылки на изображения от символа ₽/Р и других валют
          const cleanImageUrl = (url: string) => {
            if (!url) return url;
            
            // Удаляем последний символ "Р" и "₽" если он есть
            let cleaned = url.trim();
            
            // Удаляем "Р" в конце (русская буква, не валюта)
            if (cleaned.endsWith('Р') || cleaned.endsWith('р')) {
              cleaned = cleaned.slice(0, -1).trim();
            }
            
            // Удаляем символ валюты и всё что после него
            cleaned = cleaned
              .replace(/\s*[₽₸₴€$£¥]\s*.*$/, '') // Удаляем валюты с пробелами
              .replace(/\s+₽.*$/, '') // Удаляем ₽ с любыми пробелами
              .replace(/₽.*$/, '') // Удаляем просто ₽
              .split(' ')[0] // Берем только первую часть до пробела
              .trim();
            
            // Проверяем что это валидная ссылка
            return cleaned.startsWith('http') ? cleaned : url;
          };
          
          const cleanedImage = cleanImageUrl(fixed.image || '');
          const cleanedImages = (fixed.images || []).map(cleanImageUrl).filter(url => url.startsWith('http'));
          
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