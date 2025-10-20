# Анализ и группировка вариантов товаров

## Обзор

Создана система для автоматического поиска и группировки товаров с похожими названиями в базе данных `t_p46240159_larana_site_redesign.products`.

## Результаты анализа

- **Всего товаров без `variant_group_id`**: 998
- **Найдено групп для объединения**: 34
- **Товаров будет сгруппировано**: ~100+

## Файлы проекта

### Backend функция
- `backend/product-variants-analysis/index.py` - Python функция для анализа
- `backend/product-variants-analysis/requirements.txt` - Зависимости
- `backend/product-variants-analysis/tests.json` - Тесты
- **API URL**: https://functions.poehali.dev/2654b969-f5e1-447b-9dc1-cce40403afb5

### Инструменты для просмотра результатов
- `analyze-variants.html` - **Рекомендуется!** HTML интерфейс с визуализацией
- `fetch-variants.js` - Node.js скрипт для вывода в консоль
- `get-full-report.py` - Python скрипт для создания текстового отчета
- `analyze-variants-report.js` - Node.js скрипт с сохранением в JSON

### Документация
- `VARIANTS_ANALYSIS_REPORT.md` - Краткий отчет с примерами
- `FULL_VARIANTS_LIST.txt` - Детальный список первых групп
- `VARIANTS_README.md` - Этот файл

## Как получить полный список всех 34 групп

### Способ 1: HTML интерфейс (самый простой)

```bash
# Откройте в браузере
open analyze-variants.html
```

Или просто откройте файл `analyze-variants.html` двойным кликом.

**Инструкция:**
1. Нажмите кнопку "Загрузить данные"
2. Просмотрите все группы с красивым форматированием
3. Откройте консоль браузера (F12) для текстового вывода

### Способ 2: Python скрипт

```bash
python3 get-full-report.py
```

Или сохранить в файл:
```bash
python3 get-full-report.py > full-report.txt
```

### Способ 3: Node.js скрипт

```bash
node fetch-variants.js
```

Или сохранить в файл:
```bash
node fetch-variants.js > full-report.txt
```

### Способ 4: cURL запрос

```bash
# Просто JSON
curl https://functions.poehali.dev/2654b969-f5e1-447b-9dc1-cce40403afb5

# С красивым форматированием (требуется jq)
curl https://functions.poehali.dev/2654b969-f5e1-447b-9dc1-cce40403afb5 | jq .
```

### Способ 5: Браузер

Откройте URL в браузере:
https://functions.poehali.dev/2654b969-f5e1-447b-9dc1-cce40403afb5

## Структура результата

Каждая группа содержит:

```
ГРУППА: variant_group_id
Базовое название: "..."
Количество вариантов: N

  - ID товара → color_variant: "значение"
    Название товара
    Остаток: X | Категория: Y | Артикул: Z
```

### Пример

```
ГРУППА: veshalka-ayden-ldsp-вш06
Базовое название: "Вешалка Айден ЛДСП / ЛДСП"
Количество вариантов: 3

  - ID 518 → color_variant: "white"
    Вешалка Айден ВШ06-600 белый ЛДСП / белый ЛДСП
    Остаток: 0 | Категория: Гостиная | Артикул: 08-147206

  - ID 521 → color_variant: "grey"
    Вешалка Айден ВШ06-600 серый ЛДСП / серый ЛДСП
    Остаток: 0 | Категория: Гостиная | Артикул: 08-147208

  - ID 558 → color_variant: "white"
    Вешалка Айден ВШ06-800 белый ЛДСП / белый ЛДСП
    Остаток: 0 | Категория: Гостиная | Артикул: 08-147209
```

## Как применить изменения в базе данных

### ⚠️ ВАЖНО
SQL UPDATE запросы **НЕ создаются автоматически**. Вам нужно:

1. Просмотреть каждую группу
2. Убедиться, что товары действительно варианты
3. Создать SQL UPDATE для каждого товара

### Пример SQL запросов

```sql
-- Для группы veshalka-ayden-ldsp-вш06

UPDATE products SET 
  variant_group_id = 'veshalka-ayden-ldsp-вш06',
  color_variant = 'white'
WHERE id = 518;

UPDATE products SET 
  variant_group_id = 'veshalka-ayden-ldsp-вш06',
  color_variant = 'grey'
WHERE id = 521;

UPDATE products SET 
  variant_group_id = 'veshalka-ayden-ldsp-вш06',
  color_variant = 'white'
WHERE id = 558;
```

### Массовое обновление

Если вы уверены в результатах, можете создать скрипт:

```sql
-- Группа 1
UPDATE products SET variant_group_id = 'veshalka-ayden-ldsp-вш06', color_variant = 'white' WHERE id = 518;
UPDATE products SET variant_group_id = 'veshalka-ayden-ldsp-вш06', color_variant = 'grey' WHERE id = 521;
UPDATE products SET variant_group_id = 'veshalka-ayden-ldsp-вш06', color_variant = 'white' WHERE id = 558;

-- Группа 2
UPDATE products SET variant_group_id = 'gostinaya-alfa', color_variant = 'white' WHERE id = 971;
UPDATE products SET variant_group_id = 'gostinaya-alfa', color_variant = 'white' WHERE id = 979;
UPDATE products SET variant_group_id = 'gostinaya-alfa', color_variant = 'oak' WHERE id = 947;

-- ... и так для всех 34 групп
```

## Алгоритм группировки

Товары группируются автоматически, если:

1. **Похожее базовое название** - после удаления цветов, размеров, артикулов
2. **Разные варианты** - отличаются цветом, размером или артикулом
3. **Есть в наличии** - `stock_quantity > 0` ИЛИ явно разные варианты

### Что удаляется при поиске базового названия:

- Артикулы: `ВШ06-600`, `КМ-800`, `ОБ-600`
- Размеры: `(1400)`, `(1600)`, `1400х2000`
- Цвета: `белый`, `черный`, `серый`, `венге`, `дуб`, `white`, `black`, etc.

### Примеры группировки:

✅ **Будут сгруппированы:**
- "Вешалка Айден ВШ06-600 белый" + "Вешалка Айден ВШ06-600 серый"
- "ГАРДА Prime Кровать (1400)" + "ГАРДА Prime Кровать (1600)"
- "Гостиная Альфа (Белый)" + "Гостиная Альфа (Венге)"

❌ **НЕ будут сгруппированы:**
- "Стол офисный" + "Стул офисный" (разные типы мебели)
- "Диван Комфорт" + "Диван Престиж" (разные модели)

## Формат variant_group_id

Генерируется автоматически в kebab-case:

- **"Вешалка Айден ВШ06"** → `veshalka-ayden-вш06`
- **"Гостиная Альфа"** → `gostinaya-alfa`
- **"ГАРДА Prime Кровать"** → `garda-prime-krovat`

## Формат color_variant

Извлекается из названия товара:

- **"белый"** → `white`
- **"серый"** → `grey`
- **"венге"** → `wenge`
- **"(1400)"** → `1400`
- **"ВШ06-600"** → `вш06-600`
- По умолчанию → `default`

## API Response структура

```json
{
  "total_products": 998,
  "groups_found": 34,
  "groups": {
    "variant-group-id": {
      "base_name": "Базовое название",
      "products": [
        {
          "id": 123,
          "title": "Полное название",
          "color_variant": "white",
          "stock_quantity": 0,
          "category": "Категория",
          "supplier_article": "Артикул"
        }
      ]
    }
  }
}
```

## Обновление логики группировки

Если нужно изменить алгоритм:

1. Отредактируйте `backend/product-variants-analysis/index.py`
2. Измените функции:
   - `extract_base_name()` - извлечение базового названия
   - `extract_color_variant()` - извлечение варианта
   - `generate_variant_group_id()` - генерация ID группы
   - `analyze_variants()` - логика группировки
3. Задеплойте изменения:
   ```bash
   # В Claude Code
   sync_backend
   ```
4. Проверьте результаты

## Проверка результатов

После применения SQL UPDATE запросов:

1. Проверьте в базе данных:
   ```sql
   SELECT id, title, variant_group_id, color_variant 
   FROM products 
   WHERE variant_group_id IS NOT NULL 
   ORDER BY variant_group_id, color_variant;
   ```

2. Проверьте на фронтенде:
   - Откройте страницу товара
   - Убедитесь, что варианты отображаются корректно
   - Проверьте переключение между вариантами

## Поддержка

- Backend функция: `backend/product-variants-analysis/`
- Runtime: Python 3.11
- База данных: PostgreSQL
- API: https://functions.poehali.dev/2654b969-f5e1-447b-9dc1-cce40403afb5

## Лицензия

Внутренний проект Larana
