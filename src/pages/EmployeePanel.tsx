import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { LoginForm } from './employee-panel/LoginForm';
import { PanelHeader } from './employee-panel/PanelHeader';
import { OrdersStatistics } from './employee-panel/OrdersStatistics';
import { OrdersFilter } from './employee-panel/OrdersFilter';
import { OrdersList } from './employee-panel/OrdersList';
import { ChangePasswordDialog } from './employee-panel/ChangePasswordDialog';
import { EmployeeData, OrderData } from './employee-panel/types';

const EmployeePanel = () => {
  const [searchParams] = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [employeeId, setEmployeeId] = useState('');
  const [loginData, setLoginData] = useState({ login: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedEmployeeId = localStorage.getItem('employeeId');
    if (storedEmployeeId) {
      setEmployeeId(storedEmployeeId);
      setIsAuthenticated(true);
      loadEmployee(storedEmployeeId);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && employee) {
      fetchOrders();
    }
  }, [isAuthenticated, employee]);

  const loadEmployee = async (id: string) => {
    try {
      const response = await fetch('https://functions.poehali.dev/a54029b9-3fca-4a20-83eb-49d7fb6412e2');
      if (response.ok) {
        const data = await response.json();
        const foundEmployee = data.employees.find((emp: any) => emp.id.toString() === id);
        if (foundEmployee && foundEmployee.status === 'active') {
          setEmployee(foundEmployee);
        } else {
          handleLogout();
          toast({
            title: "Ошибка",
            description: "Сотрудник не найден или неактивен",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Error loading employee:', error);
    }
  };

  const fetchOrders = async () => {
    if (!employee) return;

    setLoading(true);
    try {
      const types = employee.employeeTypes && employee.employeeTypes.length > 0 
        ? employee.employeeTypes.join(',') 
        : employee.employeeType;
      
      const url = `https://functions.poehali.dev/f363b242-7b94-4530-a6e9-e75c166d29e0?employeeType=${types}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить заказы",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (loginData.login && loginData.password) {
        const response = await fetch('https://functions.poehali.dev/4ea75d0c-6fc5-4fcc-81e4-f0fdf7ee65b2', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            login: loginData.login,
            password: loginData.password
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.employee) {
            localStorage.setItem('employeeId', data.employee.id.toString());
            setEmployee(data.employee);
            setIsAuthenticated(true);
            
            if (data.employee.requirePasswordChange) {
              setChangePasswordOpen(true);
              toast({
                title: "Смена пароля",
                description: "Пожалуйста, установите новый пароль",
                variant: "default"
              });
            } else {
              toast({
                title: "Успешный вход",
                description: `Добро пожаловать, ${data.employee.name}`
              });
            }
            return;
          }
        } else if (response.status === 401) {
          toast({
            title: "Ошибка входа",
            description: "Неверный логин или пароль",
            variant: "destructive"
          });
          return;
        }
      }
      
      if (employeeId) {
        const response = await fetch('https://functions.poehali.dev/a54029b9-3fca-4a20-83eb-49d7fb6412e2');
        if (response.ok) {
          const data = await response.json();
          const foundEmployee = data.employees.find((emp: any) => emp.id.toString() === employeeId && emp.status === 'active');
          
          if (foundEmployee) {
            localStorage.setItem('employeeId', employeeId);
            setEmployee(foundEmployee);
            setIsAuthenticated(true);
            toast({
              title: "Успешный вход",
              description: `Добро пожаловать, ${foundEmployee.name}`
            });
            return;
          } else {
            toast({
              title: "Ошибка входа",
              description: "Неверный ID сотрудника или сотрудник неактивен",
              variant: "destructive"
            });
          }
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось войти в систему",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setEmployeeId('');
      setLoginData({ login: '', password: '' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('employeeId');
    setIsAuthenticated(false);
    setEmployee(null);
    setOrders([]);
    toast({
      title: "Выход выполнен",
      description: "Вы вышли из системы"
    });
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const employeeTypes = employee?.employeeTypes?.join(',') || employee?.employeeType || '';
      const requestBody = {
        orderId: orderId,
        status: newStatus
      };
      console.log('Updating order status:', requestBody);
      
      const response = await fetch(`https://functions.poehali.dev/f363b242-7b94-4530-a6e9-e75c166d29e0?employeeType=${employeeTypes}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': 'employee'
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        toast({
          title: "Успешно",
          description: "Статус заказа обновлен"
        });
        fetchOrders();
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Update failed:', response.status, errorData);
        throw new Error(errorData.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус",
        variant: "destructive"
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <LoginForm
        loading={loading}
        onLogin={handleLogin}
        loginData={loginData}
        onLoginDataChange={setLoginData}
        employeeId={employeeId}
        onEmployeeIdChange={setEmployeeId}
      />
    );
  }

  if (!employee) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <PanelHeader
        employee={employee}
        loading={loading}
        onRefresh={fetchOrders}
        onLogout={handleLogout}
        onChangePassword={() => setChangePasswordOpen(true)}
      />

      <ChangePasswordDialog
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
        employeeId={employee.id.toString()}
        requirePasswordChange={employee.requirePasswordChange}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Мои заказы</h2>
          <p className="text-muted-foreground mb-4">
            {orders.length === 0 
              ? 'У вас пока нет заказов для обработки' 
              : `Всего заказов: ${orders.length}`}
          </p>

          <OrdersStatistics
            employee={employee}
            orders={orders}
          />

          <OrdersFilter
            employee={employee}
            orders={orders}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>

        <OrdersList
          orders={orders}
          loading={loading}
          activeFilter={activeFilter}
          expandedOrderId={expandedOrderId}
          onToggleExpand={(orderId) => setExpandedOrderId(
            expandedOrderId === orderId ? null : orderId
          )}
          onUpdateStatus={handleUpdateStatus}
        />
      </main>
    </div>
  );
};

export default EmployeePanel;