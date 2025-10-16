import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { EmployeeCard } from './EmployeeCard';
import { Employee, EMPLOYEE_TYPES, EMPLOYEE_TYPES_COLORS } from './types';

interface EmployeesListProps {
  employees: Employee[];
  loading: boolean;
  filterType: string;
  onEdit: (employee: Employee) => void;
  onDelete: (id: number) => void;
  onResetPassword: (employee: Employee) => void;
}

export const EmployeesList = ({
  employees,
  loading,
  filterType,
  onEdit,
  onDelete,
  onResetPassword
}: EmployeesListProps) => {
  const filteredEmployees = filterType === 'all' 
    ? employees 
    : employees.filter(emp => emp.employeeType === filterType);

  const groupedEmployees = {
    new: filteredEmployees.filter(e => e.employeeType === 'new'),
    order_processing: filteredEmployees.filter(e => e.employeeType === 'order_processing'),
    delivery: filteredEmployees.filter(e => e.employeeType === 'delivery'),
    assembly: filteredEmployees.filter(e => e.employeeType === 'assembly')
  };

  if (loading && employees.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {filterType === 'all' ? (
        Object.entries(groupedEmployees).map(([type, emps]) => (
          <div key={type}>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${EMPLOYEE_TYPES_COLORS[type as keyof typeof EMPLOYEE_TYPES_COLORS]}`} />
              {EMPLOYEE_TYPES[type as keyof typeof EMPLOYEE_TYPES]} ({emps.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {emps.map(employee => (
                <EmployeeCard
                  key={employee.id}
                  employee={employee}
                  onEdit={() => onEdit(employee)}
                  onDelete={() => onDelete(employee.id)}
                  onResetPassword={onResetPassword}
                />
              ))}
            </div>
            {emps.length === 0 && (
              <p className="text-muted-foreground text-sm">Нет сотрудников</p>
            )}
          </div>
        ))
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map(employee => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onEdit={() => onEdit(employee)}
              onDelete={() => onDelete(employee.id)}
              onResetPassword={onResetPassword}
            />
          ))}
        </div>
      )}

      {filteredEmployees.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Нет сотрудников</p>
        </div>
      )}
    </div>
  );
};