import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import OrderCard from './OrderCard';

const OrdersTab = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await fetch('https://functions.poehali.dev/f363b242-7b94-4530-a6e9-e75c166d29e0?admin=true', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        console.error('Failed to fetch orders:', response.status);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить заказы",
        variant: "destructive"
      });
    } finally {
      setLoadingOrders(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch('https://functions.poehali.dev/f363b242-7b94-4530-a6e9-e75c166d29e0', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId,
          status: newStatus
        })
      });

      if (response.ok) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        toast({
          title: "Статус обновлен",
          description: `Заказ #${orderId} обновлен`
        });
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус",
        variant: "destructive"
      });
    }
  };

  const filteredOrders = orders.filter(order => 
    statusFilter === 'all' || order.status === statusFilter
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Все заказы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все заказы</SelectItem>
            <SelectItem value="pending">Новые</SelectItem>
            <SelectItem value="processing">В обработке</SelectItem>
            <SelectItem value="completed">Выполненные</SelectItem>
            <SelectItem value="cancelled">Отмененные</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={fetchAllOrders}>
          <Icon name="RefreshCw" size={16} className="mr-2" />
          Обновить
        </Button>
        <div className="ml-auto text-sm text-muted-foreground">
          Всего заказов: {filteredOrders.length}
        </div>
      </div>

      <ScrollArea className="h-[500px] pr-4">
        {loadingOrders ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Загрузка заказов...</div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Icon name="ShoppingBag" size={48} className="text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Нет заказов</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onUpdateStatus={updateOrderStatus}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default OrdersTab;