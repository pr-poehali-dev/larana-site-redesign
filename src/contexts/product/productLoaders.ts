import { Product } from './types';
import { initialProducts } from './initialProducts';

export const loadProductsFromDB = async (): Promise<Product[]> => {
  console.log('\n🚀 ЗАГРУЗКА КАТАЛОГА ИЗ БАЗЫ ДАННЫХ');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    const response = await fetch('https://functions.poehali.dev/eecf4811-c6f1-4f6c-be05-ab02dae44689');
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const data = await response.json();
    const products = Array.isArray(data) ? data : [];
    
    console.log('📦 Загружено товаров из БД:', products.length);
    
    if (products.length === 0) {
      console.log('⚠️ БД пуста - использую дефолтные товары');
      return initialProducts;
    }
    
    const normalized = products.map((p: any) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      price: typeof p.price === 'number' ? `${p.price} ₽` : p.price,
      image: p.images?.[0] || '',
      images: p.images || [],
      items: p.items || [],
      style: p.style || 'Современный',
      description: p.description || '',
      colors: p.colors || [],
      inStock: p.in_stock !== false,
      supplierArticle: p.supplier_article || '',
      stockQuantity: p.stock_quantity || null,
      variantGroupId: p.variant_group_id || '',
      colorVariant: p.color_variant || '',
      variants: []
    }));
    
    const grouped = new Map<string, any>();
    const standalone: any[] = [];
    
    normalized.forEach((product: any) => {
      if (product.variantGroupId) {
        if (!grouped.has(product.variantGroupId)) {
          grouped.set(product.variantGroupId, {
            ...product,
            variants: [{
              id: product.id,
              colorVariant: product.colorVariant,
              stockQuantity: product.stockQuantity,
              images: product.images
            }]
          });
        } else {
          const mainProduct = grouped.get(product.variantGroupId);
          mainProduct.variants.push({
            id: product.id,
            colorVariant: product.colorVariant,
            stockQuantity: product.stockQuantity,
            images: product.images
          });
        }
      } else {
        standalone.push(product);
      }
    });
    
    const finalProducts = [...Array.from(grouped.values()), ...standalone];
    
    console.log('✅ Каталог готов:', finalProducts.length, 'товаров (после группировки из', normalized.length, ')');
    console.log('📊 Сгруппировано:', grouped.size, 'групп,', standalone.length, 'отдельных товаров');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    return finalProducts;
  } catch (error) {
    console.error('❌ Ошибка загрузки из БД:', error);
    console.log('⚠️ Использую дефолтные товары');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    return initialProducts;
  }
};

export const loadBundlesFromDB = async (): Promise<any[]> => {
  console.log('\n📦 ЗАГРУЗКА НАБОРОВ ИЗ БАЗЫ ДАННЫХ');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    const response = await fetch('https://functions.poehali.dev/e73f89da-d34f-4de2-ab51-fc42b74e5a69');
    
    if (!response.ok) {
      throw new Error('Failed to fetch bundles');
    }
    
    const data = await response.json();
    const bundles = Array.isArray(data) ? data : [];
    
    console.log('📦 Загружено наборов из БД:', bundles.length);
    
    const normalized = bundles.map((b: any) => ({
      id: b.id,
      title: b.title,
      category: 'Наборы',
      price: typeof b.price === 'number' ? `${b.price} ₽` : b.price,
      image: b.image_url || '',
      images: b.image_url ? [b.image_url] : [],
      items: b.product_ids || [],
      style: 'Современный',
      description: b.description || '',
      colors: [],
      inStock: true,
      supplierArticle: '',
      stockQuantity: null,
      variantGroupId: '',
      colorVariant: '',
      variants: []
    }));
    
    console.log('✅ Наборы готовы:', normalized.length);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    return normalized;
  } catch (error) {
    console.error('❌ Ошибка загрузки наборов:', error);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    return [];
  }
};
