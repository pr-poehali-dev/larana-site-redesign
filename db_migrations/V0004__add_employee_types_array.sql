-- Добавляем колонку для множественных категорий работы
ALTER TABLE employees ADD COLUMN employee_types TEXT[];

-- Обновляем существующие записи, чтобы перенести значение из employee_type в employee_types
UPDATE employees SET employee_types = ARRAY[employee_type] WHERE employee_types IS NULL;