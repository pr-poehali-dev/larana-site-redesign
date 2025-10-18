import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useProducts } from '@/contexts/ProductContext';

interface Stats {
  totalOrders: number;
  totalOrdersSum: number;
  newOrders: number;
  newOrdersSum: number;
  processingOrders: number;
  processingOrdersSum: number;
  deliveryOrders: number;
  deliveryOrdersSum: number;
  completedOrders: number;
  completedOrdersSum: number;
  cancelledOrders: number;
  cancelledOrdersSum: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalProducts: number;
}

const StatisticsTab = () => {
  const { allFurnitureSets } = useProducts();
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalOrdersSum: 0,
    newOrders: 0,
    newOrdersSum: 0,
    processingOrders: 0,
    processingOrdersSum: 0,
    deliveryOrders: 0,
    deliveryOrdersSum: 0,
    completedOrders: 0,
    completedOrdersSum: 0,
    cancelledOrders: 0,
    cancelledOrdersSum: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    totalProducts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, [allFurnitureSets]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/f363b242-7b94-4530-a6e9-e75c166d29e0?admin=true');
      
      if (response.ok) {
        const data = await response.json();
        const orders = data.orders || [];
        
        const newOrdersArr = orders.filter((o: any) => o.status === 'new');
        const processingOrdersArr = orders.filter((o: any) => o.status === 'in_processing');
        const deliveryOrdersArr = orders.filter((o: any) => o.status === 'in_delivery');
        const completedOrdersArr = orders.filter((o: any) => o.status === 'completed' || o.status === 'delivered');
        const cancelledOrdersArr = orders.filter((o: any) => o.status === 'cancelled');
        
        const totalOrdersSum = orders.reduce((sum: number, o: any) => sum + (parseFloat(o.totalAmount) || 0), 0);
        const newOrdersSum = newOrdersArr.reduce((sum: number, o: any) => sum + (parseFloat(o.totalAmount) || 0), 0);
        const processingOrdersSum = processingOrdersArr.reduce((sum: number, o: any) => sum + (parseFloat(o.totalAmount) || 0), 0);
        const deliveryOrdersSum = deliveryOrdersArr.reduce((sum: number, o: any) => sum + (parseFloat(o.totalAmount) || 0), 0);
        const completedOrdersSum = completedOrdersArr.reduce((sum: number, o: any) => sum + (parseFloat(o.totalAmount) || 0), 0);
        const cancelledOrdersSum = cancelledOrdersArr.reduce((sum: number, o: any) => sum + (parseFloat(o.totalAmount) || 0), 0);
        
        const averageOrderValue = orders.length > 0 ? totalOrdersSum / orders.length : 0;

        setStats({
          totalOrders: orders.length,
          totalOrdersSum,
          newOrders: newOrdersArr.length,
          newOrdersSum,
          processingOrders: processingOrdersArr.length,
          processingOrdersSum,
          deliveryOrders: deliveryOrdersArr.length,
          deliveryOrdersSum,
          completedOrders: completedOrdersArr.length,
          completedOrdersSum,
          cancelledOrders: cancelledOrdersArr.length,
          cancelledOrdersSum,
          totalRevenue: completedOrdersSum,
          averageOrderValue,
          totalProducts: allFurnitureSets.length
        });
      }
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icon name="Loader2" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего заказов</CardTitle>
            <Icon name="ShoppingCart" size={20} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">{formatCurrency(stats.totalOrdersSum)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Новые заказы</CardTitle>
            <Icon name="AlertCircle" size={20} className="text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">{formatCurrency(stats.newOrdersSum)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">В работе</CardTitle>
            <Icon name="Clock" size={20} className="text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.processingOrders + stats.deliveryOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">{formatCurrency(stats.processingOrdersSum + stats.deliveryOrdersSum)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Выполнено</CardTitle>
            <Icon name="CheckCircle" size={20} className="text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">{formatCurrency(stats.completedOrdersSum)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Общая выручка</CardTitle>
            <Icon name="TrendingUp" size={20} className="text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">Из завершённых заказов</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Средний чек</CardTitle>
            <Icon name="DollarSign" size={20} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.averageOrderValue)}</div>
            <p className="text-xs text-muted-foreground mt-1">На один заказ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Товаров в каталоге</CardTitle>
            <Icon name="Package" size={20} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">Активных позиций</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Статистика по статусам</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm">Новые</span>
              </div>
              <span className="font-medium">{stats.newOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-sm">В обработке</span>
              </div>
              <span className="font-medium">{stats.processingOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-sm">В доставке</span>
              </div>
              <span className="font-medium">{stats.deliveryOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Завершены</span>
              </div>
              <span className="font-medium">{stats.completedOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm">Отменены</span>
              </div>
              <span className="font-medium">{stats.cancelledOrders}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsTab;