import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Employee, EmployeeFormData, EMPLOYEE_TYPES, EMPLOYEE_TYPES_COLORS } from './types';

interface EmployeeFormDialogProps {
  isOpen: boolean;
  editingEmployee: Employee | null;
  formData: EmployeeFormData;
  loading: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onFormDataChange: (data: EmployeeFormData) => void;
}

export const EmployeeFormDialog = ({
  isOpen,
  editingEmployee,
  formData,
  loading,
  onClose,
  onSubmit,
  onFormDataChange
}: EmployeeFormDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
              onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
              placeholder="Иван Петров"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Телефон *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => onFormDataChange({ ...formData, phone: e.target.value })}
              placeholder="+7 999 123-45-67"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onFormDataChange({ ...formData, email: e.target.value })}
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
                          onFormDataChange({
                            ...formData,
                            employeeTypes: [...formData.employeeTypes, type],
                            employeeType: type as any
                          });
                        } else {
                          const newTypes = formData.employeeTypes.filter(t => t !== type);
                          onFormDataChange({
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
              onValueChange={(value: any) => onFormDataChange({ ...formData, status: value })}
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
                  onFormDataChange({ ...formData, generatePassword: !!checked })
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
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={onSubmit} disabled={loading}>
            {loading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
