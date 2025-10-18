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
        className="flex items-center justify-between p-3 md:p-4 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            <Icon 
              name={isExpanded ? "ChevronDown" : "ChevronRight"} 
              size={16} 
              className="md:w-5 md:h-5 text-muted-foreground"
            />
            <span className="font-semibold text-xs md:text-base">#{order.orderNumber || order.id}</span>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate text-xs md:text-base">{order.userName || order.fullName || order.userEmail}</p>
            <p className="text-[10px] md:text-sm text-muted-foreground truncate">
              {order.items?.length || 0} {(order.items?.length || 0) === 1 ? 'товар' : 'товара'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-3 flex-shrink-0">
            <div className="scale-75 md:scale-100 origin-right">
              {getStatusBadge(order.status)}
            </div>
            <p className="font-bold text-sm md:text-lg whitespace-nowrap">{order.totalAmount} ₽</p>
          </div>
        </div>
      </div>

      {isExpanded && (
        <CardContent className="border-t pt-3 md:pt-4 p-3 md:p-6">
          <div className="space-y-3 md:space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-2 md:space-y-3">
                <div>
                  <p className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase mb-1">Номер заказа</p>
                  <p className="font-medium text-sm md:text-base">{order.orderNumber || order.id}</p>
                </div>

                <div>
                  <p className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase mb-1">Клиент</p>
                  <p className="font-medium text-sm md:text-base">{order.userName || order.fullName || 'Не указано'}</p>
                </div>
                
                <div>
                  <p className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase mb-1">Email</p>
                  <p className="text-xs md:text-sm break-all">{order.userEmail || order.email || 'Не указан'}</p>
                </div>
                
                <div>
                  <p className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase mb-1">Телефон</p>
                  <p className="text-xs md:text-sm">{order.userPhone || order.phone || 'Не указан'}</p>
                </div>
              </div>

              <div className="space-y-2 md:space-y-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Адрес доставки</p>
                  <p className="text-sm">{order.deliveryAddress || order.address || 'Не указан'}</p>
                  {order.deliveryApartment && (
                    <p className="text-xs text-muted-foreground mt-1">Квартира: {order.deliveryApartment}</p>
                  )}
                  {order.deliveryEntrance && (
                    <p className="text-xs text-muted-foreground">Подъезд: {order.deliveryEntrance}</p>
                  )}
                  {order.deliveryFloor && (
                    <p className="text-xs text-muted-foreground">Этаж: {order.deliveryFloor}</p>
                  )}
                  {order.deliveryIntercom && (
                    <p className="text-xs text-muted-foreground">Домофон: {order.deliveryIntercom}</p>
                  )}
                </div>
                
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

            <div className="pt-2 md:pt-3 border-t">
              <p className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase mb-2">Состав заказа</p>
              <div className="space-y-2">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 text-xs md:text-sm bg-muted/30 p-2 rounded">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs md:text-sm">{item.product_title || item.title}</p>
                      {item.category && (
                        <p className="text-[10px] md:text-xs text-muted-foreground">{item.category}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 self-end sm:self-auto">
                      <div className="text-right whitespace-nowrap">
                        <p className="font-medium text-xs md:text-sm">{item.quantity} шт</p>
                        <p className="text-[10px] md:text-xs text-muted-foreground">{item.product_price || item.price} ₽ / шт</p>
                      </div>
                      <div className="text-right font-semibold whitespace-nowrap text-xs md:text-sm">
                        {(item.product_price || item.price) * item.quantity} ₽
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-2 md:mt-3 pt-2 md:pt-3 border-t">
                <p className="font-semibold text-sm md:text-base">Итого:</p>
                <p className="text-lg md:text-xl font-bold">{order.totalAmount} ₽</p>
              </div>
            </div>

            {order.comment && (
              <div className="pt-2 md:pt-3 border-t">
                <p className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase mb-1">Комментарий клиента</p>
                <p className="text-xs md:text-sm bg-muted/30 p-2 md:p-3 rounded">{order.comment}</p>
              </div>
            )}

            {order.createdAt && (
              <div className="pt-2 md:pt-3 border-t">
                <p className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase mb-1">Дата создания заказа</p>
                <p className="text-xs md:text-sm">
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

            <div className="flex flex-col sm:flex-row gap-2 pt-2 md:pt-3 border-t">
              <Select
                value={order.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-full sm:w-[180px] text-xs md:text-sm">
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
              <Button variant="outline" size="sm" onClick={onToggleExpand} className="text-xs md:text-sm">
                <Icon name="ChevronUp" size={14} className="mr-1 md:mr-2 md:w-4 md:h-4" />
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