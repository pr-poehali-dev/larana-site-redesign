-- Добавляем поля для артикула поставщика, остатков и вариантов товара
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS supplier_article VARCHAR(200),
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER,
ADD COLUMN IF NOT EXISTS variant_group_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS color_variant VARCHAR(100);

-- Индекс для быстрого поиска по артикулу
CREATE INDEX IF NOT EXISTS idx_products_supplier_article ON products(supplier_article);

-- Индекс для группировки вариантов товара
CREATE INDEX IF NOT EXISTS idx_products_variant_group ON products(variant_group_id);