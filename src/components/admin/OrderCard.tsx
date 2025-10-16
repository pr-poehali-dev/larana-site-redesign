import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

interface OrderCardProps {
  order: any;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdateStatus: (orderId: string, newStatus: string) => void;
}

const OrderCard = ({ order, isExpanded, onToggleExpand, onUpdateStatus }: OrderCardProps) => {
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      new: { label: 'Новый', variant: 'default' },
      pending: { label: 'Новый', variant: 'default' },
      in_processing: { label: 'В обработке', variant: 'secondary' },
      in_delivery: { label: 'Передан в доставку', variant: 'secondary' },
      delivered: { label: 'Доставлен', variant: 'outline' },
      completed: { label: 'Завершен', variant: 'outline' },
      cancelled: { label: 'Отменен', variant: 'destructive' }
    };
    
    const config = statusConfig[status] || statusConfig.new;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      new: 'Новый',
      pending: 'Новый',
      in_processing: 'В обработке',
      in_delivery: 'Передан в доставку',
      delivered: 'Доставлен',
      completed: 'Завершен',
      cancelled: 'Отменен'
    };
    return labels[status] || status;
  };

  const handleStatusChange = (newStatus: string) => {
    const currentStatusLabel = getStatusLabel(order.status);
    const newStatusLabel = getStatusLabel(newStatus);
    
    if (confirm(`Изменить статус заказа #${order.id} с "${currentStatusLabel}" на "${newStatusLabel}"?`)) {
      onUpdateStatus(String(order.id), newStatus);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            <Icon 
              name={isExpanded ? "ChevronDown" : "ChevronRight"} 
              size={20} 
              className="text-muted-foreground"
            />
            <span className="font-semibold">#{order.orderNumber || order.id}</span>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{order.userName || order.fullName || order.userEmail}</p>
            <p className="text-sm text-muted-foreground truncate">
              {order.items?.length || 0} {(order.items?.length || 0) === 1 ? 'товар' : 'товара'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {getStatusBadge(order.status)}
            <p className="font-bold text-lg">{order.totalAmount} ₽</p>
          </div>
        </div>
      </div>

      {isExpanded && (
        <CardContent className="border-t pt-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Номер заказа</p>
                  <p className="font-medium">{order.orderNumber || order.id}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Клиент</p>
                  <p className="font-medium">{order.userName || order.fullName || 'Не указано'}</p>
                </div>
                
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Email</p>
                  <p className="text-sm">{order.userEmail || order.email || 'Не указан'}</p>
                </div>
                
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Телефон</p>
                  <p className="text-sm">{order.userPhone || order.phone || 'Не указан'}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Адрес доставки</p>
                  <p className="text-sm">{order.deliveryAddress || order.address || 'Не указан'}</p>
                </div>

                {order.deliveryCity && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Город</p>
                    <p className="text-sm">{order.deliveryCity}</p>
                  </div>
                )}
                
                {order.deliveryType && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Тип доставки</p>
                    <p className="text-sm">
                      {order.deliveryType === 'delivery' ? 'Доставка' : 
                       order.deliveryType === 'pickup' ? 'Самовывоз' : 
                       order.deliveryType}
                    </p>
                  </div>
                )}

                {order.paymentType && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Способ оплаты</p>
                    <p className="text-sm">
                      {order.paymentType === 'card' ? 'Картой онлайн' : 
                       order.paymentType === 'cash' ? 'Наличными' : 
                       order.paymentType === 'card_courier' ? 'Картой курьеру' :
                       order.paymentType}
                    </p>
                  </div>
                )}
                
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
              </div>
            </div>

            <div className="pt-3 border-t">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Состав заказа</p>
              <div className="space-y-2">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-start justify-between gap-4 text-sm bg-muted/30 p-2 rounded">
                    <div className="flex-1">
                      <p className="font-medium">{item.product_title || item.title}</p>
                      {item.category && (
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                      )}
                    </div>
                    <div className="text-right whitespace-nowrap">
                      <p className="font-medium">{item.quantity} шт</p>
                      <p className="text-xs text-muted-foreground">{item.product_price || item.price} ₽ / шт</p>
                    </div>
                    <div className="text-right font-semibold whitespace-nowrap">
                      {(item.product_price || item.price) * item.quantity} ₽
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

            <div className="flex gap-2 pt-3 border-t">
              <Select
                value={order.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Новый</SelectItem>
                  <SelectItem value="in_processing">В обработке</SelectItem>
                  <SelectItem value="in_delivery">Передан в доставку</SelectItem>
                  <SelectItem value="delivered">Доставлен</SelectItem>
                  <SelectItem value="completed">Завершен</SelectItem>
                  <SelectItem value="cancelled">Отменен</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={onToggleExpand}>
                <Icon name="ChevronUp" size={16} className="mr-2" />
                Свернуть
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default OrderCard;