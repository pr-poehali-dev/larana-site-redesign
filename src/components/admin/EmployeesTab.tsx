import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
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
  status: 'active' | 'inactive';
  createdAt: string;
}

const EmployeesTab = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    employeeType: 'order_processing' as 'order_processing' | 'delivery' | 'assembly',
    status: 'active' as 'active' | 'inactive'
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
        status: employee.status
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        name: '',
        phone: '',
        email: '',
        employeeType: 'order_processing',
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
      status: 'active'
    });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.employeeType) {
      toast({
        title: "Ошибка",
        description: "Заполните обязательные поля",
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
              <Label htmlFor="employeeType">Тип сотрудника *</Label>
              <Select
                value={formData.employeeType}
                onValueChange={(value: any) => setFormData({ ...formData, employeeType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(EMPLOYEE_TYPES).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
    </div>
  );
};

const EmployeeCard = ({ 
  employee, 
  onEdit, 
  onDelete 
}: { 
  employee: Employee; 
  onEdit: () => void; 
  onDelete: () => void; 
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{employee.name}</CardTitle>
            <CardDescription className="mt-1">
              <Badge 
                variant="secondary" 
                className={`${EMPLOYEE_TYPES_COLORS[employee.employeeType]} text-white`}
              >
                {EMPLOYEE_TYPES[employee.employeeType]}
              </Badge>
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
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={onEdit} className="flex-1">
            <Icon name="Pencil" size={16} className="mr-1" />
            Изменить
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete}>
            <Icon name="Trash2" size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeesTab;
