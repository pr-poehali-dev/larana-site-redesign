import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Stats {
  totalOrders: number;
  newOrders: number;
  processingOrders: number;
  deliveryOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalProducts: number;
}

const StatisticsTab = () => {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    newOrders: 0,
    processingOrders: 0,
    deliveryOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    totalProducts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/f363b242-7b94-4530-a6e9-e75c166d29e0?admin=true');
      
      if (response.ok) {
        const data = await response.json();
        const orders = data.orders || [];
        
        const newOrders = orders.filter((o: any) => o.status === 'new').length;
        const processingOrders = orders.filter((o: any) => o.status === 'in_processing').length;
        const deliveryOrders = orders.filter((o: any) => o.status === 'in_delivery').length;
        const completedOrders = orders.filter((o: any) => o.status === 'completed' || o.status === 'delivered').length;
        const cancelledOrders = orders.filter((o: any) => o.status === 'cancelled').length;
        
        const totalRevenue = orders
          .filter((o: any) => o.status === 'completed' || o.status === 'delivered')
          .reduce((sum: number, o: any) => sum + (parseFloat(o.total_price) || 0), 0);
        
        const averageOrderValue = orders.length > 0 
          ? orders.reduce((sum: number, o: any) => sum + (parseFloat(o.total_price) || 0), 0) / orders.length
          : 0;

        setStats({
          totalOrders: orders.length,
          newOrders,
          processingOrders,
          deliveryOrders,
          completedOrders,
          cancelledOrders,
          totalRevenue,
          averageOrderValue,
          totalProducts: 10
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
            <p className="text-xs text-muted-foreground mt-1">За всё время</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Новые заказы</CardTitle>
            <Icon name="AlertCircle" size={20} className="text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">Требуют внимания</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">В работе</CardTitle>
            <Icon name="Clock" size={20} className="text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.processingOrders + stats.deliveryOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">Обработка и доставка</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Выполнено</CardTitle>
            <Icon name="CheckCircle" size={20} className="text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">Завершённые заказы</p>
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
