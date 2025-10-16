import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface StatsData {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  popularProducts: Array<{
    title: string;
    quantity: number;
    revenue: number;
  }>;
  revenueByStatus: {
    new: number;
    in_processing: number;
    in_delivery: number;
    delivered: number;
    completed: number;
    cancelled: number;
  };
}

const StatsTab = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/f363b242-7b94-4530-a6e9-e75c166d29e0?admin=true', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const orders = data.orders || [];
        
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);
        
        const productMap = new Map<string, { quantity: number; revenue: number }>();
        orders.forEach((order: any) => {
          order.items?.forEach((item: any) => {
            const title = item.product_title || item.title;
            const existing = productMap.get(title) || { quantity: 0, revenue: 0 };
            productMap.set(title, {
              quantity: existing.quantity + (item.quantity || 0),
              revenue: existing.revenue + ((item.product_price || item.price || 0) * (item.quantity || 0))
            });
          });
        });

        const popularProducts = Array.from(productMap.entries())
          .map(([title, data]) => ({ title, ...data }))
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5);

        const revenueByStatus = {
          new: 0,
          in_processing: 0,
          in_delivery: 0,
          delivered: 0,
          completed: 0,
          cancelled: 0
        };

        orders.forEach((order: any) => {
          const status = order.status || 'new';
          if (status in revenueByStatus) {
            revenueByStatus[status as keyof typeof revenueByStatus] += order.totalAmount || 0;
          }
        });

        setStats({
          totalOrders,
          totalRevenue,
          totalProducts: productMap.size,
          popularProducts,
          revenueByStatus
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить статистику",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      new: 'Новые',
      in_processing: 'В обработке',
      in_delivery: 'В доставке',
      delivered: 'Доставлены',
      completed: 'Завершены',
      cancelled: 'Отменены'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader2" size={48} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Нет данных для отображения</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего заказов</CardTitle>
            <Icon name="ShoppingCart" size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Общая выручка</CardTitle>
            <Icon name="DollarSign" size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Уникальных товаров</CardTitle>
            <Icon name="Package" size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="TrendingUp" size={20} />
              Популярные товары
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.popularProducts.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{product.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Продано: {product.quantity} шт
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(product.revenue)}</p>
                  </div>
                </div>
              ))}
              {stats.popularProducts.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Нет данных о продажах
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="BarChart3" size={20} />
              Выручка по статусам
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.revenueByStatus).map(([status, revenue]) => {
                if (revenue === 0) return null;
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-sm">{getStatusLabel(status)}</span>
                    </div>
                    <span className="font-semibold">{formatCurrency(revenue)}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatsTab;
