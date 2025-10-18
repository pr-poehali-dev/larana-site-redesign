import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminStatsCardsProps {
  productsCount: number;
}

const AdminStatsCards = ({ productsCount }: AdminStatsCardsProps) => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/f363b242-7b94-4530-a6e9-e75c166d29e0?admin=true');
      if (response.ok) {
        const data = await response.json();
        const orders = data.orders || [];
        setStats({
          total: orders.length,
          pending: orders.filter((o: any) => o.status === 'pending' || o.status === 'new').length,
          completed: orders.filter((o: any) => o.status === 'completed').length
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
      <Card>
        <CardHeader className="pb-2 p-3 md:p-6">
          <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">Всего заказов</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
          <div className="text-xl md:text-2xl font-bold">{stats.total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2 p-3 md:p-6">
          <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">В обработке</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
          <div className="text-xl md:text-2xl font-bold text-yellow-600">{stats.pending}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2 p-3 md:p-6">
          <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">Завершено</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
          <div className="text-xl md:text-2xl font-bold text-green-600">{stats.completed}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2 p-3 md:p-6">
          <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">Товаров</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
          <div className="text-xl md:text-2xl font-bold">{productsCount}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStatsCards;
