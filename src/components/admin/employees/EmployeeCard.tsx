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
      <CardHeader className="pb-2 md:pb-3 p-3 md:p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm md:text-lg truncate">{employee.name}</CardTitle>
            <CardDescription className="mt-1 md:mt-2 flex flex-wrap gap-1">
              {employee.employeeTypes && employee.employeeTypes.length > 0 ? (
                employee.employeeTypes.map((type) => (
                  <Badge 
                    key={type}
                    variant="secondary" 
                    className={`${EMPLOYEE_TYPES_COLORS[type as keyof typeof EMPLOYEE_TYPES_COLORS]} text-white text-[10px] md:text-xs px-1.5 md:px-2`}
                  >
                    {EMPLOYEE_TYPES[type as keyof typeof EMPLOYEE_TYPES]}
                  </Badge>
                ))
              ) : (
                <Badge 
                  variant="secondary" 
                  className={`${EMPLOYEE_TYPES_COLORS[employee.employeeType]} text-white text-[10px] md:text-xs px-1.5 md:px-2`}
                >
                  {EMPLOYEE_TYPES[employee.employeeType]}
                </Badge>
              )}
            </CardDescription>
          </div>
          <Badge variant={employee.status === 'active' ? 'default' : 'secondary'} className="text-[10px] md:text-xs whitespace-nowrap">
            {employee.status === 'active' ? 'Активен' : 'Неактивен'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 p-3 md:p-6 pt-0 md:pt-0">
        <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm">
          <Icon name="Phone" size={14} className="text-muted-foreground md:w-4 md:h-4 flex-shrink-0" />
          <span className="truncate">{employee.phone}</span>
        </div>
        {employee.email && (
          <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm">
            <Icon name="Mail" size={14} className="text-muted-foreground md:w-4 md:h-4 flex-shrink-0" />
            <span className="truncate">{employee.email}</span>
          </div>
        )}
        {employee.login && (
          <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm">
            <Icon name="User" size={14} className="text-muted-foreground md:w-4 md:h-4 flex-shrink-0" />
            <span className="font-mono truncate">{employee.login}</span>
            {employee.hasPassword && (
              <Badge variant="outline" className="text-[10px] md:text-xs flex-shrink-0">
                <Icon name="Key" size={10} className="mr-0.5 md:mr-1 md:w-3 md:h-3" />
                Пароль
              </Badge>
            )}
          </div>
        )}
        <div className="flex flex-col gap-1.5 md:gap-2 mt-3 md:mt-4">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={copyEmployeeLink}
            className="w-full text-xs md:text-sm h-8 md:h-9"
          >
            <Icon name="Link" size={14} className="mr-1 md:mr-1.5 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Скопировать ссылку</span>
            <span className="sm:hidden">Ссылка</span>
          </Button>
          {employee.login && employee.hasPassword && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onResetPassword(employee)}
              className="w-full text-xs md:text-sm h-8 md:h-9"
            >
              <Icon name="KeyRound" size={14} className="mr-1 md:mr-1.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Сбросить пароль</span>
              <span className="sm:hidden">Сброс</span>
            </Button>
          )}
          <div className="flex gap-1.5 md:gap-2">
            <Button variant="outline" size="sm" onClick={onEdit} className="flex-1 text-xs md:text-sm h-8 md:h-9">
              <Icon name="Pencil" size={14} className="mr-1 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Изменить</span>
              <span className="sm:hidden">Ред.</span>
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete} className="h-8 md:h-9 px-2 md:px-3">
              <Icon name="Trash2" size={14} className="md:w-4 md:h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};