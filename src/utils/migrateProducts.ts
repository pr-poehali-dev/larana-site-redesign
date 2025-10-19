import { createProduct } from '@/api/products';

export async function migrateProductsToDatabase() {
  console.log('\n🚀 МИГРАЦИЯ ТОВАРОВ В БАЗУ ДАННЫХ');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const saved = localStorage.getItem('larana-products');
  if (!saved) {
    console.log('⚠️ Нет товаров в localStorage для миграции');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    return { success: 0, failed: 0 };
  }

  try {
    const products = JSON.parse(saved);
    console.log(`📦 Найдено товаров: ${products.length}`);
    
    let success = 0;
    let failed = 0;

    for (const product of products) {
      try {
        console.log(`\n➡️ Мигрирую: ${product.title || 'Без названия'}`);
        const created = await createProduct(product);
        
        if (created) {
          success++;
          console.log(`   ✅ Успешно (ID: ${created.id})`);
        } else {
          failed++;
          console.log(`   ❌ Не удалось создать`);
        }
      } catch (error) {
        failed++;
        console.log(`   ❌ Ошибка:`, error);
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 РЕЗУЛЬТАТЫ МИГРАЦИИ:');
    console.log(`   ✅ Успешно: ${success}`);
    console.log(`   ❌ Ошибок: ${failed}`);
    console.log(`   📦 Всего: ${products.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return { success, failed };
  } catch (error) {
    console.error('❌ Критическая ошибка миграции:', error);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    return { success: 0, failed: 0 };
  }
}
