-- Добавляем тип "new" в допустимые значения employee_type
ALTER TABLE employees DROP CONSTRAINT IF EXISTS employees_employee_type_check;
ALTER TABLE employees ADD CONSTRAINT employees_employee_type_check 
  CHECK (employee_type IN ('new', 'order_processing', 'delivery', 'assembly'));