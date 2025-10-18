import { OzonProduct } from './types';

const OZON_API_URL = 'https://functions.poehali.dev/41fcd72f-4164-49f0-8cf6-315f1a291c00';

export const loadOzonProductsFromAPI = async (
  onProgress: (message: string) => void
): Promise<OzonProduct[]> => {
  onProgress('Загружаем все товары с Ozon, это может занять время');

  let allProducts: any[] = [];
  let lastId = '';
  let hasMore = true;

  while (hasMore) {
    const url = lastId
      ? `${OZON_API_URL}?limit=1000&last_id=${lastId}`
      : `${OZON_API_URL}?limit=1000`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Ozon API error:', errorData);
      throw new Error(errorData.error || 'Ошибка загрузки товаров с Ozon');
    }

    const data = await response.json();
    const items = data.result?.items || [];

    if (items.length === 0) {
      hasMore = false;
      break;
    }

    allProducts = [...allProducts, ...items];
    lastId = data.result?.last_id || '';
    hasMore = !!lastId && items.length === 1000;

    console.log(`Загружено ${allProducts.length} товаров...`);
  }

  const productIds = allProducts.map((item: any) => item.product_id);

  if (productIds.length === 0) {
    throw new Error('Товары не найдены в каталоге Ozon');
  }

  onProgress(`Загружаем детали для ${productIds.length} товаров`);

  let allDetails: any[] = [];
  const batchSize = 100;

  for (let i = 0; i < productIds.length; i += batchSize) {
    const batch = productIds.slice(i, i + batchSize);

    const detailsResponse = await fetch(OZON_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_ids: batch
      })
    });

    if (!detailsResponse.ok) {
      console.error('Ошибка загрузки батча', i);
      continue;
    }

    const detailsData = await detailsResponse.json();
    const items = detailsData.result?.items || detailsData.result || [];
    allDetails = [...allDetails, ...items];

    console.log(`Загружено деталей: ${allDetails.length}/${productIds.length}`);
  }

  return mapOzonProducts(allDetails);
};

const mapOzonProducts = (rawItems: any[]): OzonProduct[] => {
  return rawItems.map((item: any) => {
    const name = item.name || item.title || `Товар ${item.offer_id}`;

    console.log('🔍 Товар:', name);
    console.log('💰 Структура цены:', {
      marketing_price: item.marketing_price,
      price: item.price,
      old_price: item.old_price
    });

    // Правильно извлекаем ВСЕ изображения и очищаем URL
    const images = item.images?.map((img: any) => {
      let url = img.default || img.url || '';
      // Убираем лишние символы из URL (валюты, пробелы и т.д.)
      url = url.split(' ')[0].trim();
      return {
        file_name: img.file_name || '',
        url: url
      };
    }).filter((img: any) => img.url && img.url.startsWith('http')) || [];

    console.log('🖼️ Изображений:', images.length);

    // "Название цвета" из Ozon → "Цвет" в нашей карточке
    const colorNameAttr = item.attributes?.find((attr: any) =>
      attr.attribute_name?.toLowerCase().includes('название цвета') ||
      attr.attribute_id === 10096
    );
    const colorName = colorNameAttr?.values?.[0]?.value || '';

    // "Название модели" из Ozon → "ID группы вариантов"
    const modelNameAttr = item.attributes?.find((attr: any) =>
      attr.attribute_name?.toLowerCase().includes('название модели') ||
      attr.attribute_name?.toLowerCase().includes('модель') ||
      attr.attribute_id === 9048
    );
    const modelName = modelNameAttr?.values?.[0]?.value || '';

    // "Аннотация" из Ozon → "Описание" в нашей карточке
    const annotationAttr = item.attributes?.find((attr: any) =>
      attr.attribute_name?.toLowerCase().includes('аннотация') ||
      attr.attribute_id === 4191
    );
    const annotation = annotationAttr?.values?.[0]?.value || item.description || item.rich_text || '';

    // "Категория и тип" из Ozon → "Категория" в нашей карточке
    const categoryAttr = item.attributes?.find((attr: any) =>
      attr.attribute_name?.toLowerCase().includes('тип') ||
      attr.attribute_id === 8229
    );
    const ozonCategory = categoryAttr?.values?.[0]?.value || '';

    // Правильно извлекаем цену
    let price = '0';
    if (typeof item.marketing_price === 'string') {
      price = item.marketing_price;
    } else if (typeof item.price === 'string') {
      price = item.price;
    } else if (typeof item.old_price === 'string') {
      price = item.old_price;
    }

    console.log('✅ Итоговая цена:', price);

    return {
      product_id: item.id || item.product_id,
      offer_id: item.offer_id,
      name: name,
      price: price,
      old_price: item.old_price || '',
      currency_code: item.currency_code || 'RUB',
      visible: item.visible || item.status?.state === 'processed',
      images: images,
      stocks: item.stocks || { present: 0, reserved: 0 },
      description: annotation,
      attributes: item.attributes || [],
      color: colorName,
      modelName: modelName,
      ozonCategory: ozonCategory
    };
  });
};