-- Добавление полей для детальной информации о доставке и подъёме на этаж

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS items_total INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS delivery_price INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_free_delivery BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS delivery_distance VARCHAR(100),
ADD COLUMN IF NOT EXISTS delivery_estimated_days VARCHAR(50),
ADD COLUMN IF NOT EXISTS carry_price INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS carry_category VARCHAR(100),
ADD COLUMN IF NOT EXISTS carry_details TEXT;

-- Добавление комментария к таблице
COMMENT ON COLUMN orders.items_total IS 'Стоимость товаров без доставки';
COMMENT ON COLUMN orders.delivery_price IS 'Стоимость доставки (0 если бесплатно)';
COMMENT ON COLUMN orders.is_free_delivery IS 'Бесплатная доставка (Екб, Среднеуральск, В.Пышма)';
COMMENT ON COLUMN orders.delivery_distance IS 'Расстояние доставки (км или "точка")';
COMMENT ON COLUMN orders.delivery_estimated_days IS 'Ориентировочный срок доставки';
COMMENT ON COLUMN orders.carry_price IS 'Стоимость подъёма на этаж';
COMMENT ON COLUMN orders.carry_category IS 'Категория мебели для подъёма';
COMMENT ON COLUMN orders.carry_details IS 'Детали расчёта подъёма (этаж, лифт)';
