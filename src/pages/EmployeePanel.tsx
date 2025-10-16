import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import OrderCard from '@/components/admin/OrderCard';

const EMPLOYEE_TYPES = {
  order_processing: 'Обработка заказов',
  delivery: 'Доставка',
  assembly: 'Сборка'
};

const EMPLOYEE_TYPES_COLORS = {
  order_processing: 'bg-blue-500',
  delivery: 'bg-green-500',
  assembly: 'bg-orange-500'
};

const STATUS_BY_TYPE = {
  order_processing: 'in_processing',
  delivery: 'in_delivery',
  assembly: 'delivered'
};

const EmployeePanel = () => {
  const [searchParams] = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [employeeId, setEmployeeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
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
      // Используем либо массив типов, либо один тип
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
        } else {
          toast({
            title: "Ошибка входа",
            description: "Неверный ID сотрудника или сотрудник неактивен",
            variant: "destructive"
          });
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
      const response = await fetch('https://functions.poehali.dev/f363b242-7b94-4530-a6e9-e75c166d29e0', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId,
          status: newStatus
        })
      });

      if (response.ok) {
        toast({
          title: "Успешно",
          description: "Статус заказа обновлен"
        });
        fetchOrders();
      } else {
        throw new Error('Failed to update status');
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

  const getNextStatus = () => {
    if (!employee) return [];
    
    const types = employee.employeeTypes && employee.employeeTypes.length > 0 
      ? employee.employeeTypes 
      : [employee.employeeType];
    
    const allStatuses: { value: string; label: string }[] = [];
    const statusSet = new Set<string>();
    
    types.forEach((type: string) => {
      switch (type) {
        case 'order_processing':
          if (!statusSet.has('in_processing')) {
            allStatuses.push({ value: 'in_processing', label: 'В обработке' });
            statusSet.add('in_processing');
          }
          if (!statusSet.has('in_delivery')) {
            allStatuses.push({ value: 'in_delivery', label: 'Передать в доставку' });
            statusSet.add('in_delivery');
          }
          break;
        case 'delivery':
          if (!statusSet.has('in_delivery')) {
            allStatuses.push({ value: 'in_delivery', label: 'В доставке' });
            statusSet.add('in_delivery');
          }
          if (!statusSet.has('delivered')) {
            allStatuses.push({ value: 'delivered', label: 'Доставлен' });
            statusSet.add('delivered');
          }
          break;
        case 'assembly':
          if (!statusSet.has('delivered')) {
            allStatuses.push({ value: 'delivered', label: 'Доставлен' });
            statusSet.add('delivered');
          }
          if (!statusSet.has('completed')) {
            allStatuses.push({ value: 'completed', label: 'Завершить' });
            statusSet.add('completed');
          }
          break;
      }
    });
    
    // Добавляем возможность отменить для всех
    if (!statusSet.has('cancelled')) {
      allStatuses.push({ value: 'cancelled', label: 'Отменить' });
    }
    
    return allStatuses;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
              <Icon name="UserCog" size={32} className="text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Панель сотрудника</CardTitle>
            <CardDescription>Введите ваш ID для доступа</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="ID сотрудника"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="text-center text-lg"
                  autoFocus
                />
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Получите ID у администратора
                </p>
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={loading || !employeeId}
              >
                {loading ? (
                  <>
                    <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                    Вход...
                  </>
                ) : (
                  <>
                    <Icon name="LogIn" size={20} className="mr-2" />
                    Войти
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/')}
              >
                <Icon name="Home" size={16} className="mr-2" />
                На главную
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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
                onClick={fetchOrders}
                disabled={loading}
              >
                <Icon name="RefreshCw" size={16} className={loading ? "animate-spin" : ""} />
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLogout}
              >
                <Icon name="LogOut" size={16} className="mr-2" />
                Выход
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Мои заказы</h2>
          <p className="text-muted-foreground mb-4">
            {orders.length === 0 
              ? 'У вас пока нет заказов для обработки' 
              : `Всего заказов: ${orders.length}`}
          </p>

          {/* Статистика по категориям */}
          {employee?.employeeTypes && employee.employeeTypes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {employee.employeeTypes.map((type: string) => {
                const statusForType = STATUS_BY_TYPE[type as keyof typeof STATUS_BY_TYPE];
                const count = orders.filter(order => order.status === statusForType).length;
                const totalAmount = orders
                  .filter(order => order.status === statusForType)
                  .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

                const isActive = activeFilter === type;

                return (
                  <Card 
                    key={type}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      isActive ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setActiveFilter(isActive ? 'all' : type)}
                  >
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
          )}

          {/* Кнопки фильтрации */}
          {employee?.employeeTypes && employee.employeeTypes.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant={activeFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('all')}
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
                    onClick={() => setActiveFilter(type)}
                    className="flex items-center gap-2"
                  >
                    <div className={`w-2 h-2 rounded-full ${EMPLOYEE_TYPES_COLORS[type as keyof typeof EMPLOYEE_TYPES_COLORS]}`} />
                    {EMPLOYEE_TYPES[type as keyof typeof EMPLOYEE_TYPES]} ({count})
                  </Button>
                );
              })}
            </div>
          )}
        </div>

        {loading && orders.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Loader2" size={48} className="mx-auto text-muted-foreground mb-2 animate-spin" />
            <p className="text-muted-foreground">Загрузка заказов...</p>
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Icon name="Package" size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Нет заказов для обработки</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {(() => {
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

              return filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isExpanded={expandedOrderId === order.id.toString()}
                  onToggleExpand={() => setExpandedOrderId(
                    expandedOrderId === order.id.toString() ? null : order.id.toString()
                  )}
                  onUpdateStatus={handleUpdateStatus}
                />
              ));
            })()}
          </div>
        )}
      </main>
    </div>
  );
};

export default EmployeePanel;