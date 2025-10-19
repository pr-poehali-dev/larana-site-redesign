-- Создаём таблицу для товаров
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price VARCHAR(50) NOT NULL,
    image TEXT,
    images TEXT[], -- массив URL изображений
    items TEXT[], -- массив элементов комплекта
    style VARCHAR(100),
    description TEXT,
    colors TEXT[], -- массив доступных цветов
    in_stock BOOLEAN DEFAULT true,
    supplier_article VARCHAR(200),
    stock_quantity INTEGER,
    variant_group_id VARCHAR(100),
    color_variant VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_style ON products(style);