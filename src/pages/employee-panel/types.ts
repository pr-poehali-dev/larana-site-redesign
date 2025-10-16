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

export const STATUS_BY_TYPE = {
  new: 'new',
  order_processing: 'in_processing',
  delivery: 'in_delivery',
  assembly: 'delivered'
};

export interface EmployeeData {
  id: number;
  name: string;
  phone: string;
  email?: string;
  employeeType: string;
  employeeTypes?: string[];
  status: string;
  login?: string;
  requirePasswordChange?: boolean;
}

export interface OrderData {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  items?: any[];
  [key: string]: any;
}