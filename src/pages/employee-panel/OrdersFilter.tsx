import { Button } from '@/components/ui/button';
import { EmployeeData, OrderData, EMPLOYEE_TYPES, EMPLOYEE_TYPES_COLORS, STATUS_BY_TYPE } from './types';

interface OrdersFilterProps {
  employee: EmployeeData;
  orders: OrderData[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const OrdersFilter = ({
  employee,
  orders,
  activeFilter,
  onFilterChange
}: OrdersFilterProps) => {
  if (!employee?.employeeTypes || employee.employeeTypes.length <= 1) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button
        variant={activeFilter === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('all')}
      >
        Все ({orders.length})
      </Button>
      {employee.employeeTypes.map((type: string) => {
        const statusForType = STATUS_BY_TYPE[type as keyof typeof STATUS_BY_TYPE];
        const count = orders.filter(order => order.status === statusForType).length;
        
        return (
          <Button
            key={type}
            variant={activeFilter === type ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange(type)}
            className="flex items-center gap-2"
          >
            <div className={`w-2 h-2 rounded-full ${EMPLOYEE_TYPES_COLORS[type as keyof typeof EMPLOYEE_TYPES_COLORS]}`} />
            {EMPLOYEE_TYPES[type as keyof typeof EMPLOYEE_TYPES]} ({count})
          </Button>
        );
      })}
    </div>
  );
};
