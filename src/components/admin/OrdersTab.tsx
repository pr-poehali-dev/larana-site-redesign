import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import OrderCard from './OrderCard';

const OrdersTab = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
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

  const searchInOrder = (order: any, query: string): boolean => {
    const lowerQuery = query.toLowerCase();
    
    const searchableFields = [
      order.id,
      order.fullName,
      order.email,
      order.phone,
      order.address,
      order.comment,
      order.deliveryDate,
      order.deliveryTime,
      order.paymentMethod,
      order.totalAmount?.toString(),
      order.status,
      ...order.items.map((item: any) => [item.title, item.category].join(' '))
    ];

    return searchableFields.some(field => 
      field?.toString().toLowerCase().includes(lowerQuery)
    );
  };

  const filteredOrders = orders
    .filter(order => statusFilter === 'all' || order.status === statusFilter)
    .filter(order => !searchQuery || searchInOrder(order, searchQuery));

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по номеру, клиенту, телефону, товару..."
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
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
        </div>
        <div className="text-sm text-muted-foreground">
          Найдено заказов: {filteredOrders.length}
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
            <p className="text-muted-foreground">
              {searchQuery ? 'Ничего не найдено' : 'Нет заказов'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredOrders.map((order) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                isExpanded={expandedOrderId === order.id}
                onToggleExpand={() => toggleOrderExpand(order.id)}
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
