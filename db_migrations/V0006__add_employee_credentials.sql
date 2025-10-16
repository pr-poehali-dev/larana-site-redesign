-- Добавляем логин и пароль для сотрудников
ALTER TABLE employees ADD COLUMN login VARCHAR(100) UNIQUE;
ALTER TABLE employees ADD COLUMN password_hash VARCHAR(255);

-- Генерируем логины для существующих сотрудников (emp1, emp2, emp3...)
UPDATE employees SET login = 'emp' || id WHERE login IS NULL;