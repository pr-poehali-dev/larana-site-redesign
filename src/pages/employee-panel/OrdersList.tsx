import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import OrderCard from '@/components/admin/OrderCard';
import { OrderData, EMPLOYEE_TYPES, STATUS_BY_TYPE } from './types';

interface OrdersListProps {
  orders: OrderData[];
  loading: boolean;
  activeFilter: string;
  expandedOrderId: string | null;
  onToggleExpand: (orderId: string) => void;
  onUpdateStatus: (orderId: string, status: string) => void;
}

export const OrdersList = ({
  orders,
  loading,
  activeFilter,
  expandedOrderId,
  onToggleExpand,
  onUpdateStatus
}: OrdersListProps) => {
  if (loading && orders.length === 0) {
    return (
      <div className="text-center py-8">
        <Icon name="Loader2" size={48} className="mx-auto text-muted-foreground mb-2 animate-spin" />
        <p className="text-muted-foreground">Загрузка заказов...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Icon name="Package" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Нет заказов для обработки</p>
        </CardContent>
      </Card>
    );
  }

  const filteredOrders = activeFilter === 'all' 
    ? orders 
    : orders.filter(order => {
        const statusForFilter = STATUS_BY_TYPE[activeFilter as keyof typeof STATUS_BY_TYPE];
        return order.status === statusForFilter;
      });

  if (filteredOrders.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Icon name="Filter" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Нет заказов в категории "{EMPLOYEE_TYPES[activeFilter as keyof typeof EMPLOYEE_TYPES]}"
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {filteredOrders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          isExpanded={expandedOrderId === order.id.toString()}
          onToggleExpand={() => onToggleExpand(order.id.toString())}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </div>
  );
};
