import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EmployeeData, EMPLOYEE_TYPES } from './types';

interface PanelHeaderProps {
  employee: EmployeeData;
  loading: boolean;
  onRefresh: () => void;
  onLogout: () => void;
  onChangePassword: () => void;
}

export const PanelHeader = ({
  employee,
  loading,
  onRefresh,
  onLogout,
  onChangePassword
}: PanelHeaderProps) => {
  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="UserCog" size={24} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{employee?.name}</h1>
              <div className="flex flex-wrap gap-1">
                {employee?.employeeTypes && employee.employeeTypes.length > 0 ? (
                  employee.employeeTypes.map((type: string) => (
                    <Badge key={type} variant="secondary" className="text-xs">
                      {EMPLOYEE_TYPES[type as keyof typeof EMPLOYEE_TYPES]}
                    </Badge>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {EMPLOYEE_TYPES[employee?.employeeType as keyof typeof EMPLOYEE_TYPES]}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onRefresh}
              disabled={loading}
            >
              <Icon name="RefreshCw" size={16} className={loading ? "animate-spin" : ""} />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Icon name="User" size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onChangePassword}>
                  <Icon name="KeyRound" size={16} className="mr-2" />
                  Изменить пароль
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-destructive">
                  <Icon name="LogOut" size={16} className="mr-2" />
                  Выход
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};