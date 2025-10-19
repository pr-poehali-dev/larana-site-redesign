import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useProductsLoader } from '@/hooks/useProductsLoader';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('statistics');
  const { toast } = useToast();
  const { isAuthenticated, handleLogin, handleLogout } = useAdminAuth();
  const { products, handleProductUpdate } = useProductsLoader();

  const onProductUpdate = (updatedProducts: typeof products) => {
    handleProductUpdate(updatedProducts);
    toast({
      title: "Товары обновлены",
      description: `Изменения сохранены (${updatedProducts.length} товаров)`
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
        <AdminHeader onLogout={handleLogout} onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        
        <AdminMobileMenu 
          isOpen={mobileMenuOpen} 
          onClose={() => setMobileMenuOpen(false)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-6">
            <Icon name="LayoutDashboard" className="text-primary" size={32} />
            <h1 className="text-3xl font-bold">Панель управления</h1>
          </div>

          <AdminStatsCards products={products} />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="hidden md:grid w-full grid-cols-5 h-auto">
              <TabsTrigger value="statistics" className="flex items-center gap-2 py-3">
                <Icon name="BarChart3" size={18} />
                <span>Статистика</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2 py-3">
                <Icon name="ShoppingCart" size={18} />
                <span>Заказы</span>
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2 py-3">
                <Icon name="Package" size={18} />
                <span>Товары</span>
              </TabsTrigger>
              <TabsTrigger value="ozon" className="flex items-center gap-2 py-3">
                <Icon name="Download" size={18} />
                <span>Импорт Ozon</span>
              </TabsTrigger>
              <TabsTrigger value="employees" className="flex items-center gap-2 py-3">
                <Icon name="Users" size={18} />
                <span>Сотрудники</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="statistics">
              <StatisticsTab products={products} />
            </TabsContent>

            <TabsContent value="orders">
              <OrdersTab />
            </TabsContent>

            <TabsContent value="products">
              <ProductsTab 
                products={products} 
                onProductsUpdate={onProductUpdate}
              />
            </TabsContent>

            <TabsContent value="ozon">
              <OzonImportTab 
                products={products}
                onProductsUpdate={onProductUpdate}
              />
            </TabsContent>

            <TabsContent value="employees">
              <EmployeesTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Admin;
