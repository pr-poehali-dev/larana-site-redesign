-- Автоматическое объединение товаров в группы вариантов (Часть 1/4)

-- Группа 1: Вешалка Айден
UPDATE t_p46240159_larana_site_redesign.products SET variant_group_id = 'veshalka-ayden-ldsp', color_variant = 'Белый 600' WHERE id = 518;
UPDATE t_p46240159_larana_site_redesign.products SET variant_group_id = 'veshalka-ayden-ldsp', color_variant = 'Серый 600' WHERE id = 521;
UPDATE t_p46240159_larana_site_redesign.products SET variant_group_id = 'veshalka-ayden-ldsp', color_variant = 'Белый 800' WHERE id = 558;

-- Группа 2: Гостиная Альфа
UPDATE t_p46240159_larana_site_redesign.products SET variant_group_id = 'gostinaya-alfa', color_variant = 'Белый/Белый глянец' WHERE id = 971;
UPDATE t_p46240159_larana_site_redesign.products SET variant_group_id = 'gostinaya-alfa', color_variant = 'Дуб/Белый глянец' WHERE id = 979;
UPDATE t_p46240159_larana_site_redesign.products SET variant_group_id = 'gostinaya-alfa', color_variant = 'Дуб/Графит' WHERE id = 947;

-- Группа 3: Гостиная МГС 8
UPDATE t_p46240159_larana_site_redesign.products SET variant_group_id = 'gostinaya-mgs-8', color_variant = 'Венге/Ясень' WHERE id = 916;
UPDATE t_p46240159_larana_site_redesign.products SET variant_group_id = 'gostinaya-mgs-8', color_variant = 'Ясень светлый' WHERE id = 907;

-- Группа 4: Гостиная ПЕКИН
UPDATE t_p46240159_larana_site_redesign.products SET variant_group_id = 'gostinaya-pekin', color_variant = 'Венге/Дуб' WHERE id = 976;
UPDATE t_p46240159_larana_site_redesign.products SET variant_group_id = 'gostinaya-pekin', color_variant = 'Дуб/Белый' WHERE id = 966;

-- Группа 5: Гостиная ТОКИО
UPDATE t_p46240159_larana_site_redesign.products SET variant_group_id = 'gostinaya-tokio', color_variant = 'Белфорт/Белый' WHERE id = 924;
UPDATE t_p46240159_larana_site_redesign.products SET variant_group_id = 'gostinaya-tokio', color_variant = 'Дуб/Белый' WHERE id = 956;

-- Группа 6: Диван Веста
UPDATE t_p46240159_larana_site_redesign.products SET variant_group_id = 'divan-vesta', color_variant = 'Коричневый' WHERE id = 807;
UPDATE t_p46240159_larana_site_redesign.products SET variant_group_id = 'divan-vesta', color_variant = 'Синий' WHERE id = 813;

-- Группа 7: Диван Виктория
UPDATE t_p46240159_larana_site_redesign.products SET variant_group_id = 'divan-viktoriya', color_variant = 'Коричневый' WHERE id = 819;
UPDATE t_p46240159_larana_site_redesign.products SET variant_group_id = 'divan-viktoriya', color_variant = 'Синий' WHERE id = 826;

-- Группа 8: Вега NEW модуль 71049/71050
UPDATE t_p46240159_larana_site_redesign.products SET variant_group_id = 'vega-new-modul-a', color_variant = 'Белый глянец' WHERE id = 839;
UPDATE t_p46240159_larana_site_redesign.products SET variant_group_id = 'vega-new-modul-a', color_variant = 'Дуб сонома' WHERE id = 841;