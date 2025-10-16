-- Обновляем существующие заказы со статусом pending на new
UPDATE orders SET status = 'new' WHERE status = 'pending';