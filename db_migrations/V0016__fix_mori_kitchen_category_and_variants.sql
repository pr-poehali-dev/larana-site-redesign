-- Исправляем категорию для кухни МОРИ 2.0 с Гостиная на Кухни
-- Объединяем варианты в одну группу
UPDATE t_p46240159_larana_site_redesign.products 
SET 
  category = 'Кухни',
  variant_group_id = 'mori-2-0-kitchen',
  color_variant = CASE 
    WHEN supplier_article = 'Ц0083414' THEN 'Белая'
    WHEN supplier_article = '0810230004' THEN 'Белая (city)'
    WHEN supplier_article = '1910230006' THEN 'Белая (ND)'
    ELSE color_variant
  END
WHERE supplier_article IN ('Ц0083414', '0810230004', '1910230006');