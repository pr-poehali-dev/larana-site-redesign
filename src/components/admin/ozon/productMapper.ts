import { OzonProduct } from './types';

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

export const convertOzonToProduct = (ozonProduct: OzonProduct, catalogProducts: any[]): any => {
  const maxId = catalogProducts.length > 0 ? Math.max(...catalogProducts.map(p => p.id)) : 0;
  const category = mapOzonCategory(ozonProduct.ozonCategory || '', ozonProduct.name);

  // Все изображения товара
  const allImages = ozonProduct.images?.map(img => img.url).filter(url => url) || [];

  // "Название цвета" → "Цвет"
  const singleColor = ozonProduct.color || '';

  // ID группы вариантов из "Название модели" Ozon
  const variantGroupId = ozonProduct.modelName || null;

  // Форматируем цену
  const priceValue = typeof ozonProduct.price === 'string'
    ? ozonProduct.price.replace(/[^\d]/g, '')
    : ozonProduct.price;

  return {
    id: maxId + 1,
    title: ozonProduct.name,
    category: category,
    price: `${priceValue} ₽`,
    style: 'Современный',
    description: ozonProduct.description || `${ozonProduct.name}. Товар импортирован из Ozon.`,
    image: allImages[0] || '',
    supplierArticle: ozonProduct.offer_id,
    inStock: (ozonProduct.stocks?.present ?? 0) > 0,
    stockQuantity: ozonProduct.stocks?.present ?? null,
    images: allImages,
    colors: singleColor ? [singleColor] : [],
    items: [],
    variantGroupId: variantGroupId,
    colorVariant: singleColor || null
  };
};
