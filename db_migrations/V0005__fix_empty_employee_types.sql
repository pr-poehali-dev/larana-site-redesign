-- Обновляем пустые массивы employee_types
UPDATE employees 
SET employee_types = ARRAY[employee_type] 
WHERE employee_types IS NULL OR employee_types = '{}';