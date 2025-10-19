-- Таблица наборов товаров
CREATE TABLE product_bundles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('спальня', 'гостиная', 'детская', 'прихожая')),
    color VARCHAR(100),
    image_url TEXT,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица состава набора (связь с товарами по артикулу поставщика)
CREATE TABLE bundle_items (
    id SERIAL PRIMARY KEY,
    bundle_id INTEGER NOT NULL REFERENCES product_bundles(id),
    supplier_article VARCHAR(100) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для оптимизации
CREATE INDEX idx_bundles_type ON product_bundles(type);
CREATE INDEX idx_bundle_items_bundle_id ON bundle_items(bundle_id);
CREATE INDEX idx_bundle_items_article ON bundle_items(supplier_article);

-- Комментарии к таблицам
COMMENT ON TABLE product_bundles IS 'Наборы/комплекты товаров';
COMMENT ON TABLE bundle_items IS 'Состав наборов товаров';
COMMENT ON COLUMN bundle_items.supplier_article IS 'Артикул поставщика из таблицы товаров';
COMMENT ON COLUMN bundle_items.product_name IS 'Название товара для отображения покупателю';