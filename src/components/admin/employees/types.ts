export const EMPLOYEE_TYPES = {
  new: 'Новый',
  order_processing: 'Обработка заказов',
  delivery: 'Доставка',
  assembly: 'Сборка'
};

export const EMPLOYEE_TYPES_COLORS = {
  new: 'bg-gray-500',
  order_processing: 'bg-blue-500',
  delivery: 'bg-green-500',
  assembly: 'bg-orange-500'
};

export interface Employee {
  id: number;
  name: string;
  phone: string;
  email?: string;
  employeeType: 'new' | 'order_processing' | 'delivery' | 'assembly';
  employeeTypes?: string[];
  status: 'active' | 'inactive';
  login?: string;
  hasPassword?: boolean;
  createdAt: string;
}

export interface EmployeeFormData {
  name: string;
  phone: string;
  email: string;
  employeeType: 'new' | 'order_processing' | 'delivery' | 'assembly';
  employeeTypes: string[];
  status: 'active' | 'inactive';
  generatePassword?: boolean;
}