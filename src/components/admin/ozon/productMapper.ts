import { OzonProduct } from './types';
import { FieldMapping } from './FieldMappingDialog';

export const mapOzonCategory = (ozonCategory: string, productName: string): string => {
  // Сначала проверяем категорию из Ozon "Категория и тип"
  if (ozonCategory) {
    const categoryLower = ozonCategory.toLowerCase();

    if (categoryLower.includes('диван') || categoryLower.includes('кресло') || categoryLower.includes('пуф')) {
      return 'Гостиная';
    }
    if (categoryLower.includes('кровать') || categoryLower.includes('матрас')) {
      return 'Спальня';
    }
    if (categoryLower.includes('стол') || categoryLower.includes('стул') || categoryLower.includes('табурет')) {
      return 'Кухня';
    }
    if (categoryLower.includes('шкаф') || categoryLower.includes('комод') || categoryLower.includes('тумба')) {
      return 'Прихожая';
    }
    if (categoryLower.includes('детск')) {
      return 'Детская';
    }
  }

  // Если категория не определена, пробуем по названию товара
  const nameLower = productName.toLowerCase();

  if (nameLower.includes('диван') || nameLower.includes('кресло') || nameLower.includes('пуф')) {
    return 'Гостиная';
  }
  if (nameLower.includes('кровать') || nameLower.includes('матрас')) {
    return 'Спальня';
  }
  if (nameLower.includes('стол') || nameLower.includes('стул') || nameLower.includes('табурет')) {
    return 'Кухня';
  }
  if (nameLower.includes('шкаф') || nameLower.includes('комод') || nameLower.includes('тумба')) {
    return 'Прихожая';
  }
  if (nameLower.includes('детск')) {
    return 'Детская';
  }

  return 'Гостиная';
};

const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

export const convertOzonToProduct = (
  ozonProduct: OzonProduct, 
  catalogProducts: any[],
  mappings?: FieldMapping[]
): any => {
  const maxId = catalogProducts.length > 0 ? Math.max(...catalogProducts.map(p => p.id)) : 0;

  // Все изображения товара - очищаем от лишних символов
  const allImages = ozonProduct.images
    ?.map(img => {
      let url = img.url || '';
      url = url.split(' ')[0];
      url = url.replace(/[₽₸₴€$£¥].*$/, '');
      return url.trim();
    })
    .filter(url => url && url.startsWith('http')) || [];

  // Загружаем сохраненные маппинги
  const savedMappings = mappings || (() => {
    try {
      const saved = localStorage.getItem('ozonFieldMappings');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const result: any = {
    id: maxId + 1,
    image: allImages[0] || '',
    images: allImages,
    inStock: (ozonProduct.stocks?.present ?? 0) > 0,
    colors: [],
    items: [],
    style: 'Современный',
  };

  if (savedMappings) {
    savedMappings.forEach((mapping: FieldMapping) => {
      if (!mapping.enabled || mapping.catalogField === 'skip') return;

      const ozonValue = getNestedValue(ozonProduct, mapping.ozonField);

      if (mapping.catalogField === 'category' && mapping.ozonField === 'ozonCategory') {
        result.category = mapOzonCategory(ozonValue || '', ozonProduct.name);
      } else if (mapping.catalogField === 'price') {
        const priceValue = typeof ozonValue === 'string'
          ? ozonValue.replace(/[^\d]/g, '')
          : ozonValue;
        result.price = `${priceValue} ₽`;
      } else if (mapping.catalogField === 'colors' && ozonValue) {
        result.colors = Array.isArray(ozonValue) ? ozonValue : [ozonValue];
      } else if (mapping.catalogField === 'colorVariant' && ozonValue) {
        result.colorVariant = ozonValue;
        if (!result.colors || result.colors.length === 0) {
          result.colors = [ozonValue];
        }
      } else if (ozonValue !== undefined && ozonValue !== null) {
        result[mapping.catalogField] = ozonValue;
      }
    });
  } else {
    const category = mapOzonCategory(ozonProduct.ozonCategory || '', ozonProduct.name);
    const singleColor = ozonProduct.color || '';
    const variantGroupId = ozonProduct.modelName || null;
    const priceValue = typeof ozonProduct.price === 'string'
      ? ozonProduct.price.replace(/[^\d]/g, '')
      : ozonProduct.price;

    result.title = ozonProduct.name;
    result.category = category;
    result.price = `${priceValue} ₽`;
    result.description = ozonProduct.description || `${ozonProduct.name}. Товар импортирован из Ozon.`;
    result.supplierArticle = ozonProduct.offer_id;
    result.stockQuantity = ozonProduct.stocks?.present ?? null;
    result.colors = singleColor ? [singleColor] : [];
    result.variantGroupId = variantGroupId;
    result.colorVariant = singleColor || null;
  }

  // Значения по умолчанию если не заданы
  if (!result.title) result.title = 'Товар без названия';
  if (!result.category) result.category = 'Гостиная';
  if (!result.price) result.price = '0 ₽';
  if (!result.description) result.description = result.title;

  return result;
};