-- Add delivery details columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS delivery_apartment VARCHAR(50),
ADD COLUMN IF NOT EXISTS delivery_entrance VARCHAR(50),
ADD COLUMN IF NOT EXISTS delivery_floor VARCHAR(50),
ADD COLUMN IF NOT EXISTS delivery_intercom VARCHAR(50);

-- Add comment for clarity
COMMENT ON COLUMN orders.delivery_apartment IS 'Квартира покупателя';
COMMENT ON COLUMN orders.delivery_entrance IS 'Подъезд';
COMMENT ON COLUMN orders.delivery_floor IS 'Этаж';
COMMENT ON COLUMN orders.delivery_intercom IS 'Код домофона';