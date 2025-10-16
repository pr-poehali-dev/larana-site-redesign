import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useEffect, useState } from 'react';

interface OrderHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  user: any;
}

interface Order {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: string;
  deliveryType: string;
  paymentType: string;
  deliveryAddress?: string;
  deliveryApartment?: string;
  deliveryEntrance?: string;
  deliveryFloor?: string;
  deliveryIntercom?: string;
  comment?: string;
  createdAt: string;
  items: Array<{
    product_id: number;
    product_title: string;
    product_price: number;
    quantity: number;
  }>;
}

const OrderHistoryDialog = ({ open, onClose, user }: OrderHistoryDialogProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && user) {
      fetchOrders();
    }
  }, [open, user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/f363b242-7b94-4530-a6e9-e75c166d29e0', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.email
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      pending: { label: 'В обработке', variant: 'secondary' },
      processing: { label: 'Обрабатывается', variant: 'default' },
      shipped: { label: 'Отправлен', variant: 'default' },
      delivered: { label: 'Доставлен', variant: 'outline' },
      cancelled: { label: 'Отменен', variant: 'destructive' }
    };
    
    const statusInfo = statusMap[status] || { label: status, variant: 'secondary' };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">История заказов</DialogTitle>
          <DialogDescription>
            Все ваши заказы в одном месте
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">Загрузка...</div>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Icon name="Package" size={48} className="text-muted-foreground mb-4" />
              <p className="text-lg font-semibold mb-2">У вас пока нет заказов</p>
              <p className="text-muted-foreground">Оформите первый заказ, чтобы увидеть его здесь</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">Заказ {order.orderNumber}</h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{order.totalAmount.toLocaleString()} ₽</p>
                    </div>
                  </div>

                  <Separator className="my-3" />

                  <div className="space-y-2 mb-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.product_title} × {item.quantity}
                        </span>
                        <span className="font-medium">
                          {(item.product_price * item.quantity).toLocaleString()} ₽
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Icon name={order.deliveryType === 'delivery' ? 'Truck' : 'Store'} size={16} />
                      <span>{order.deliveryType === 'delivery' ? 'Доставка' : 'Самовывоз'}</span>
                    </div>
                    {order.deliveryType === 'delivery' && order.deliveryAddress && (
                      <div className="flex items-center gap-1">
                        <Icon name="MapPin" size={16} />
                        <span>{order.deliveryAddress}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Icon name={order.paymentType === 'card' ? 'CreditCard' : order.paymentType === 'cash' ? 'Wallet' : 'Calendar'} size={16} />
                      <span>
                        {order.paymentType === 'card' ? 'Картой онлайн' : 
                         order.paymentType === 'cash' ? 'Наличными' : 'Рассрочка'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default OrderHistoryDialog;