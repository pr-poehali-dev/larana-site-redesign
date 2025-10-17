/**
 * Группировка товаров по базовому названию для отображения вариантов цвета
 */

interface Product {
  id: number;
  title: string;
  category: string;
  price: string;
  image: string;
  images?: string[];
  items: string[];
  style: string;
  description: string;
  colors: string[];
  inStock: boolean;
  supplierArticle?: string;
  stockQuantity?: number | null;
}

interface GroupedProduct extends Product {
  variants?: Product[];
  allColors?: string[];
}

/**
 * Извлекает базовое название товара без указания цвета
 * Например: 'Кухня "Лара 180" белый глянец' -> 'Кухня "Лара 180"'
 */
export function getBaseTitle(title: string): string {
  // Убираем распространенные указания цвета в конце названия
  const colorPatterns = [
    /\s+(белый|черный|серый|синий|красный|зеленый|желтый|коричневый|бежевый|венге|дуб|сонома|глянец|матовый|глянцевый).*$/i,
    /\s+\([^)]+\)$/,  // Убираем скобки в конце
  ];
  
  let baseTitle = title;
  for (const pattern of colorPatterns) {
    baseTitle = baseTitle.replace(pattern, '');
  }
  
  return baseTitle.trim();
}

/**
 * Группирует товары по базовому названию
 * Товары с одинаковым базовым названием объединяются в группу с вариантами цветов
 */
export function groupProductsByVariants(products: Product[]): GroupedProduct[] {
  const grouped = new Map<string, GroupedProduct>();
  
  products.forEach(product => {
    const baseTitle = getBaseTitle(product.title);
    
    if (grouped.has(baseTitle)) {
      const group = grouped.get(baseTitle)!;
      
      // Добавляем товар как вариант
      if (!group.variants) {
        group.variants = [group];
      }
      group.variants.push(product);
      
      // Объединяем цвета
      if (!group.allColors) {
        group.allColors = [...group.colors];
      }
      product.colors.forEach(color => {
        if (!group.allColors!.includes(color)) {
          group.allColors!.push(color);
        }
      });
      
      // Обновляем основную информацию если нужно
      if (product.inStock && !group.inStock) {
        group.inStock = true;
      }
      
    } else {
      // Первый товар с таким названием
      grouped.set(baseTitle, {
        ...product,
        allColors: [...product.colors]
      });
    }
  });
  
  return Array.from(grouped.values());
}

/**
 * Получает все доступные цвета для группы товаров
 */
export function getAvailableColors(product: GroupedProduct): string[] {
  if (product.allColors && product.allColors.length > 0) {
    return product.allColors;
  }
  return product.colors;
}

/**
 * Проверяет, является ли товар группой с вариантами
 */
export function hasVariants(product: GroupedProduct): boolean {
  return !!(product.variants && product.variants.length > 1);
}
