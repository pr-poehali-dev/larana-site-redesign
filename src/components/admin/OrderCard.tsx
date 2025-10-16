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
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Клиент</p>
              <p className="font-medium">{order.fullName}</p>
              <p className="text-muted-foreground">{order.email}</p>
              <p className="text-muted-foreground">{order.phone}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Адрес доставки</p>
              <p className="font-medium">{order.address}</p>
              {order.deliveryDate && (
                <p className="text-muted-foreground mt-1">
                  Дата доставки: {order.deliveryDate}
                </p>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Товары:</p>
            <div className="space-y-1">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{item.title} x {item.quantity}</span>
                  <span className="font-medium">{item.price * item.quantity} ₽</span>
                </div>
              ))}
            </div>
          </div>

          {order.comment && (
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">Комментарий:</p>
              <p className="text-sm">{order.comment}</p>
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
