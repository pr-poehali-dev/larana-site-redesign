import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmployeeData, OrderData, EMPLOYEE_TYPES, EMPLOYEE_TYPES_COLORS, STATUS_BY_TYPE } from './types';

interface OrdersStatisticsProps {
  employee: EmployeeData;
  orders: OrderData[];
}

export const OrdersStatistics = ({
  employee,
  orders
}: OrdersStatisticsProps) => {
  if (!employee?.employeeTypes || employee.employeeTypes.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {employee.employeeTypes.map((type: string) => {
        const statusForType = STATUS_BY_TYPE[type as keyof typeof STATUS_BY_TYPE];
        const count = orders.filter(order => order.status === statusForType).length;
        const totalAmount = orders
          .filter(order => order.status === statusForType)
          .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        return (
          <Card key={type}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${EMPLOYEE_TYPES_COLORS[type as keyof typeof EMPLOYEE_TYPES_COLORS]}`} />
                {EMPLOYEE_TYPES[type as keyof typeof EMPLOYEE_TYPES]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{count}</span>
                  <span className="text-sm text-muted-foreground">
                    {count === 1 ? 'заказ' : count < 5 ? 'заказа' : 'заказов'}
                  </span>
                </div>
                {totalAmount > 0 && (
                  <p className="text-sm text-muted-foreground">
                    На сумму: {totalAmount.toLocaleString('ru-RU')} ₽
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
