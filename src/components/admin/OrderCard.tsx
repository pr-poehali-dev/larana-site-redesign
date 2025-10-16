import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OrderCardProps {
  order: any;
  onUpdateStatus: (orderId: string, newStatus: string) => void;
}

const OrderCard = ({ order, onUpdateStatus }: OrderCardProps) => {
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      pending: { label: 'Новый', variant: 'default' },
      processing: { label: 'В обработке', variant: 'secondary' },
      completed: { label: 'Выполнен', variant: 'outline' },
      cancelled: { label: 'Отменен', variant: 'destructive' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">
              Заказ #{order.id}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {getStatusBadge(order.status)}
            <p className="text-lg font-bold">{order.totalAmount} ₽</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Клиент</p>
                <p className="font-medium">{order.fullName}</p>
              </div>
              
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Email</p>
                <p className="text-sm">{order.email}</p>
              </div>
              
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Телефон</p>
                <p className="text-sm">{order.phone}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Адрес доставки</p>
                <p className="text-sm">{order.address}</p>
              </div>
              
              {order.deliveryDate && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Дата доставки</p>
                  <p className="text-sm">{order.deliveryDate}</p>
                </div>
              )}
              
              {order.deliveryTime && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Время доставки</p>
                  <p className="text-sm">{order.deliveryTime}</p>
                </div>
              )}

              {order.paymentMethod && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Способ оплаты</p>
                  <p className="text-sm">{order.paymentMethod}</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t">
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Состав заказа</p>
            <div className="space-y-2">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex items-start justify-between gap-4 text-sm bg-muted/30 p-2 rounded">
                  <div className="flex-1">
                    <p className="font-medium">{item.title}</p>
                    {item.category && (
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    )}
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <p className="font-medium">{item.quantity} шт</p>
                    <p className="text-xs text-muted-foreground">{item.price} ₽ / шт</p>
                  </div>
                  <div className="text-right font-semibold whitespace-nowrap">
                    {item.price * item.quantity} ₽
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t">
              <p className="font-semibold">Итого:</p>
              <p className="text-xl font-bold">{order.totalAmount} ₽</p>
            </div>
          </div>

          {order.comment && (
            <div className="pt-3 border-t">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Комментарий клиента</p>
              <p className="text-sm bg-muted/30 p-3 rounded">{order.comment}</p>
            </div>
          )}

          {order.createdAt && (
            <div className="pt-3 border-t">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Дата создания заказа</p>
              <p className="text-sm">
                {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Select
              value={order.status}
              onValueChange={(value) => onUpdateStatus(order.id, value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Новый</SelectItem>
                <SelectItem value="processing">В обработке</SelectItem>
                <SelectItem value="completed">Выполнен</SelectItem>
                <SelectItem value="cancelled">Отменен</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;