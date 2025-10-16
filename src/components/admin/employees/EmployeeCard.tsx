import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Employee, EMPLOYEE_TYPES, EMPLOYEE_TYPES_COLORS } from './types';

interface EmployeeCardProps {
  employee: Employee;
  onEdit: () => void;
  onDelete: () => void;
  onResetPassword: (employee: Employee) => void;
}

export const EmployeeCard = ({ 
  employee, 
  onEdit, 
  onDelete,
  onResetPassword
}: EmployeeCardProps) => {
  const { toast } = useToast();

  const copyEmployeeLink = () => {
    const link = `${window.location.origin}/employee`;
    const loginInfo = employee.login ? `\nЛогин: ${employee.login}` : `\nВаш ID: ${employee.id}`;
    const text = `Ссылка для входа: ${link}${loginInfo}`;
    navigator.clipboard.writeText(text);
    toast({
      title: "Скопировано",
      description: "Ссылка для входа скопирована"
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{employee.name}</CardTitle>
            <CardDescription className="mt-2 flex flex-wrap gap-1">
              {employee.employeeTypes && employee.employeeTypes.length > 0 ? (
                employee.employeeTypes.map((type) => (
                  <Badge 
                    key={type}
                    variant="secondary" 
                    className={`${EMPLOYEE_TYPES_COLORS[type as keyof typeof EMPLOYEE_TYPES_COLORS]} text-white`}
                  >
                    {EMPLOYEE_TYPES[type as keyof typeof EMPLOYEE_TYPES]}
                  </Badge>
                ))
              ) : (
                <Badge 
                  variant="secondary" 
                  className={`${EMPLOYEE_TYPES_COLORS[employee.employeeType]} text-white`}
                >
                  {EMPLOYEE_TYPES[employee.employeeType]}
                </Badge>
              )}
            </CardDescription>
          </div>
          <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
            {employee.status === 'active' ? 'Активен' : 'Неактивен'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Icon name="Phone" size={16} className="text-muted-foreground" />
          <span>{employee.phone}</span>
        </div>
        {employee.email && (
          <div className="flex items-center gap-2 text-sm">
            <Icon name="Mail" size={16} className="text-muted-foreground" />
            <span className="truncate">{employee.email}</span>
          </div>
        )}
        {employee.login && (
          <div className="flex items-center gap-2 text-sm">
            <Icon name="User" size={16} className="text-muted-foreground" />
            <span className="font-mono">{employee.login}</span>
            {employee.hasPassword && (
              <Badge variant="outline" className="text-xs">
                <Icon name="Key" size={12} className="mr-1" />
                Есть пароль
              </Badge>
            )}
          </div>
        )}
        <div className="flex flex-col gap-2 mt-4">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={copyEmployeeLink}
            className="w-full"
          >
            <Icon name="Link" size={16} className="mr-1" />
            Скопировать ссылку
          </Button>
          {employee.login && employee.hasPassword && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onResetPassword(employee)}
              className="w-full"
            >
              <Icon name="KeyRound" size={16} className="mr-1" />
              Сбросить пароль
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit} className="flex-1">
              <Icon name="Pencil" size={16} className="mr-1" />
              Изменить
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete}>
              <Icon name="Trash2" size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
