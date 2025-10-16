-- Добавить колонку require_password_change для обязательной смены пароля при первом входе
ALTER TABLE employees ADD COLUMN IF NOT EXISTS require_password_change BOOLEAN DEFAULT FALSE;

-- Обновить существующих сотрудников с паролями - пусть они не меняют пароль
UPDATE employees SET require_password_change = FALSE WHERE password_hash IS NOT NULL;

-- Создать индекс для ускорения поиска по логину
CREATE INDEX IF NOT EXISTS idx_employees_login ON employees(login);
