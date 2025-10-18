import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
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
        setProducts(JSON.parse(savedProducts));
      } catch (error) {
        console.error('Error loading products:', error);
      }
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
    setProducts(updatedProducts);
    localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
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