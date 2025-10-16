import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

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

interface Employee {
  id: number;
  name: string;
  phone: string;
  email?: string;
  employeeType: 'order_processing' | 'delivery' | 'assembly';
  employeeTypes?: string[]; // Множественный выбор типов
  status: 'active' | 'inactive';
  login?: string;
  hasPassword?: boolean;
  createdAt: string;
}

const EmployeesTab = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [generatedCredentials, setGeneratedCredentials] = useState<{login: string; password: string} | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    employeeType: 'order_processing' as 'order_processing' | 'delivery' | 'assembly',
    employeeTypes: [] as string[],
    status: 'active' as 'active' | 'inactive',
    generatePassword: false
  });
  const [filterType, setFilterType] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const url = 'https://functions.poehali.dev/a54029b9-3fca-4a20-83eb-49d7fb6412e2';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setEmployees(data.employees || []);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить сотрудников",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        name: employee.name,
        phone: employee.phone,
        email: employee.email || '',
        employeeType: employee.employeeType,
        employeeTypes: employee.employeeTypes || [],
        status: employee.status
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        name: '',
        phone: '',
        email: '',
        employeeType: 'order_processing',
        employeeTypes: [],
        status: 'active'
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingEmployee(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      employeeType: 'order_processing',
      employeeTypes: [],
      status: 'active'
    });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || formData.employeeTypes.length === 0) {
      toast({
        title: "Ошибка",
        description: "Заполните обязательные поля и выберите хотя бы одну категорию",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const url = 'https://functions.poehali.dev/a54029b9-3fca-4a20-83eb-49d7fb6412e2';
      const method = editingEmployee ? 'PUT' : 'POST';
      const body = editingEmployee 
        ? { ...formData, id: editingEmployee.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const data = await response.json();
        
        // Если были сгенерированы учетные данные
        if (data.generatedPassword && data.login) {
          setGeneratedCredentials({
            login: data.login,
            password: data.generatedPassword
          });
          setIsPasswordDialogOpen(true);
        }
        
        toast({
          title: "Успешно",
          description: editingEmployee 
            ? "Сотрудник обновлен" 
            : "Сотрудник добавлен"
        });
        handleCloseDialog();
        fetchEmployees();
      } else {
        throw new Error('Failed to save employee');
      }
    } catch (error) {
      console.error('Error saving employee:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить сотрудника",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (employee: Employee) => {
    if (!confirm(`Сбросить пароль для ${employee.name}? Будет сгенерирован новый пароль.`)) {
      return;
    }

    setLoading(true);
    try {
      const url = 'https://functions.poehali.dev/a54029b9-3fca-4a20-83eb-49d7fb6412e2?action=reset_password';
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: employee.id })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.newPassword) {
          setSelectedEmployee(employee);
          setGeneratedCredentials({
            login: employee.login || '',
            password: data.newPassword
          });
          setIsPasswordDialogOpen(true);
        }
        
        toast({
          title: "Успешно",
          description: "Пароль сброшен"
        });
      } else {
        throw new Error('Failed to reset password');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сбросить пароль",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
      return;
    }

    setLoading(true);
    try {
      const url = `https://functions.poehali.dev/a54029b9-3fca-4a20-83eb-49d7fb6412e2?id=${id}`;
      const response = await fetch(url, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: "Успешно",
          description: "Сотрудник удален"
        });
        fetchEmployees();
      } else {
        throw new Error('Failed to delete employee');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить сотрудника",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = filterType === 'all' 
    ? employees 
    : employees.filter(emp => emp.employeeType === filterType);

  const groupedEmployees = {
    order_processing: filteredEmployees.filter(e => e.employeeType === 'order_processing'),
    delivery: filteredEmployees.filter(e => e.employeeType === 'delivery'),
    assembly: filteredEmployees.filter(e => e.employeeType === 'assembly')
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Сотрудники</h2>
          <p className="text-muted-foreground">Управление персоналом</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Icon name="Plus" size={20} className="mr-2" />
          Добавить сотрудника
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant={filterType === 'all' ? 'default' : 'outline'}
          onClick={() => setFilterType('all')}
        >
          Все ({employees.length})
        </Button>
        {Object.entries(EMPLOYEE_TYPES).map(([type, label]) => (
          <Button
            key={type}
            variant={filterType === type ? 'default' : 'outline'}
            onClick={() => setFilterType(type)}
          >
            {label} ({employees.filter(e => e.employeeType === type).length})
          </Button>
        ))}
      </div>

      {loading && employees.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      ) : (
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
                      onEdit={() => handleOpenDialog(employee)}
                      onDelete={() => handleDelete(employee.id)}
                      onResetPassword={handleResetPassword}
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
                  onEdit={() => handleOpenDialog(employee)}
                  onDelete={() => handleDelete(employee.id)}
                  onResetPassword={handleResetPassword}
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
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEmployee ? 'Редактировать сотрудника' : 'Добавить сотрудника'}
            </DialogTitle>
            <DialogDescription>
              Заполните информацию о сотруднике
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">ФИО *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Иван Петров"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Телефон *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+7 999 123-45-67"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ivan@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label>Категории работы *</Label>
              <p className="text-sm text-muted-foreground">Выберите одну или несколько категорий</p>
              <div className="space-y-3 border rounded-lg p-4">
                {Object.entries(EMPLOYEE_TYPES).map(([type, label]) => {
                  const isChecked = formData.employeeTypes.includes(type);
                  return (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              employeeTypes: [...formData.employeeTypes, type],
                              employeeType: type as any
                            });
                          } else {
                            const newTypes = formData.employeeTypes.filter(t => t !== type);
                            setFormData({
                              ...formData,
                              employeeTypes: newTypes,
                              employeeType: (newTypes[0] || 'order_processing') as any
                            });
                          }
                        }}
                      />
                      <Label
                        htmlFor={type}
                        className="text-sm font-normal cursor-pointer flex items-center gap-2"
                      >
                        <div className={`w-3 h-3 rounded-full ${EMPLOYEE_TYPES_COLORS[type as keyof typeof EMPLOYEE_TYPES_COLORS]}`} />
                        {label}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Статус</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Активен</SelectItem>
                  <SelectItem value="inactive">Неактивен</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {!editingEmployee && (
              <div className="flex items-center space-x-2 border rounded-lg p-4">
                <Checkbox
                  id="generatePassword"
                  checked={formData.generatePassword}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, generatePassword: !!checked })
                  }
                />
                <Label
                  htmlFor="generatePassword"
                  className="text-sm font-normal cursor-pointer"
                >
                  Сгенерировать логин и пароль автоматически
                </Label>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Отмена
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог с учетными данными */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Учетные данные сотрудника</DialogTitle>
            <DialogDescription>
              Сохраните эти данные! Они больше не будут показаны.
            </DialogDescription>
          </DialogHeader>

          {generatedCredentials && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Логин</Label>
                <div className="flex gap-2">
                  <Input 
                    value={generatedCredentials.login} 
                    readOnly 
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedCredentials.login);
                      toast({ title: "Скопировано", description: "Логин скопирован" });
                    }}
                  >
                    <Icon name="Copy" size={16} />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Пароль</Label>
                <div className="flex gap-2">
                  <Input 
                    value={generatedCredentials.password} 
                    readOnly 
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedCredentials.password);
                      toast({ title: "Скопировано", description: "Пароль скопирован" });
                    }}
                  >
                    <Icon name="Copy" size={16} />
                  </Button>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={() => {
                  const text = `Логин: ${generatedCredentials.login}\nПароль: ${generatedCredentials.password}\nСсылка: ${window.location.origin}/employee`;
                  navigator.clipboard.writeText(text);
                  toast({ title: "Скопировано", description: "Все данные скопированы" });
                }}
              >
                <Icon name="Copy" size={16} className="mr-2" />
                Скопировать все данные
              </Button>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => {
              setIsPasswordDialogOpen(false);
              setGeneratedCredentials(null);
            }}>
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const EmployeeCard = ({ 
  employee, 
  onEdit, 
  onDelete,
  onResetPassword
}: { 
  employee: Employee; 
  onEdit: () => void; 
  onDelete: () => void;
  onResetPassword: (employee: Employee) => void;
}) => {
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

export default EmployeesTab;