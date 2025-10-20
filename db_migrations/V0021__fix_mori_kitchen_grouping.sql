-- Исправление группировки кухонь МОРИ 2.0

-- Убираем неправильные группировки
UPDATE t_p46240159_larana_site_redesign.products 
SET variant_group_id = '', color_variant = null 
WHERE variant_group_id = 'milan-2-8';

-- Правильная группировка кухонь МОРИ 2.0
-- ID 91: Кухня Мори 2.0 (Ц0074620) - основная
UPDATE t_p46240159_larana_site_redesign.products 
SET variant_group_id = 'mori-2-0-kitchen', color_variant = 'Венге', category = 'Кухни'
WHERE id = 91;

-- ID 82: Кухня МОРИ 2.0 Белая (уже в группе)
-- ID 324, 340: city и ND варианты (уже в группе)

-- Добавляем графитовые варианты в группу
UPDATE t_p46240159_larana_site_redesign.products 
SET variant_group_id = 'mori-2-0-kitchen', color_variant = 'Графит (city)', category = 'Кухни'
WHERE id = 332;

UPDATE t_p46240159_larana_site_redesign.products 
SET variant_group_id = 'mori-2-0-kitchen', color_variant = 'Графит (ND)', category = 'Кухни'
WHERE id = 352;