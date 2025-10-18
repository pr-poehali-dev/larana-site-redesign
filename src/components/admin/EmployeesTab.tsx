import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Employee, EmployeeFormData, EMPLOYEE_TYPES } from './employees/types';
import { EmployeeCard } from './employees/EmployeeCard';
import { EmployeeFormDialog } from './employees/EmployeeFormDialog';
import { GeneratedPasswordDialog } from '@/pages/employee-panel/GeneratedPasswordDialog';
import { EmployeesList } from './employees/EmployeesList';

const EmployeesTab = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [generatedCredentials, setGeneratedCredentials] = useState<{login: string; password: string} | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    phone: '',
    email: '',
    employeeType: 'order_processing',
    employeeTypes: [],
    status: 'active',
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
        status: employee.status,
        generatePassword: false
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        name: '',
        phone: '',
        email: '',
        employeeType: 'order_processing',
        employeeTypes: [],
        status: 'active',
        generatePassword: false
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
      status: 'active',
      generatePassword: false
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
        const errorData = await response.json().catch(() => ({}));
        console.error('Save failed:', response.status, errorData);
        throw new Error(errorData.error || 'Failed to save employee');
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

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Сотрудники</h2>
          <p className="text-sm md:text-base text-muted-foreground">Управление персоналом</p>
        </div>
        <Button onClick={() => handleOpenDialog()} size="sm" className="w-full sm:w-auto text-xs md:text-sm">
          <Icon name="Plus" size={16} className="mr-1 md:mr-2 md:w-5 md:h-5" />
          <span className="hidden sm:inline">Добавить сотрудника</span>
          <span className="sm:hidden">Добавить</span>
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={filterType === 'all' ? 'default' : 'outline'}
          onClick={() => setFilterType('all')}
          size="sm"
          className="text-xs md:text-sm whitespace-nowrap flex-shrink-0"
        >
          Все ({employees.length})
        </Button>
        {Object.entries(EMPLOYEE_TYPES).map(([type, label]) => (
          <Button
            key={type}
            variant={filterType === type ? 'default' : 'outline'}
            onClick={() => setFilterType(type)}
            size="sm"
            className="text-xs md:text-sm whitespace-nowrap flex-shrink-0"
          >
            {label} ({employees.filter(e => e.employeeType === type).length})
          </Button>
        ))}
      </div>

      <EmployeesList
        employees={employees}
        loading={loading}
        filterType={filterType}
        onEdit={handleOpenDialog}
        onDelete={handleDelete}
        onResetPassword={handleResetPassword}
      />

      <EmployeeFormDialog
        isOpen={isDialogOpen}
        editingEmployee={editingEmployee}
        formData={formData}
        loading={loading}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        onFormDataChange={setFormData}
      />

      {generatedCredentials && (
        <GeneratedPasswordDialog
          open={isPasswordDialogOpen}
          onOpenChange={(open) => {
            setIsPasswordDialogOpen(open);
            if (!open) setGeneratedCredentials(null);
          }}
          login={generatedCredentials.login}
          password={generatedCredentials.password}
        />
      )}
    </div>
  );
};

export default EmployeesTab;