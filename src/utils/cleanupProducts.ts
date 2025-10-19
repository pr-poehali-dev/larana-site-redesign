import { Product } from '@/types/admin';

const articlesToDelete = [
  'Ц0084746', 'Ц0084980', 'Ц0064609', 'Ц0081949', 'Ц0084981', 'Ц0065338',
  'Ц0084961', 'Ц0063649', 'Ц0063627', 'Ц0084979', 'Ц0084978', 'Ц0084972',
  'Ц0050205', 'Ц0067418', 'Ц0081444', 'Ц0063873', 'Ц0075504', 'Ц0083200',
  'Ц0063628', 'Ц0077915', 'Ц0084722', 'Ц0050203', 'Ц0075505', 'Ц0084927',
  'Ц0050216', 'Ц0069392', 'Ц0050220', 'Ц0083692', 'Ц0084000', 'Ц0076594',
  'Ц0064606', 'Ц0050207', 'Ц0081610', 'Ц0083202', 'Ц0067414', 'Ц0082327',
  'Ц0067416', 'Ц0084445', 'Ц0084984', 'Ц0063875', 'Ц0064222', 'Ц0084977',
  'Ц0050217', 'Ц0067420', 'Ц0082326', 'Ц0084975', 'Ц0065348', 'Ц0065347',
  'Ц0064231', 'Ц0064227', 'PR-0018.1544', 'Ц0064237', 'Ц0075135', 'Ц0064225',
  'Ц0064219', 'Ц0064238', 'Ц0081428', 'Ц0064228', 'Ц0065333', 'Ц0064263',
  'Ц0064218', 'KM-0216.0133', 'NKL02S1.2.1623', 'KM-0216.1747', 'Ц0064239',
  'Ц0084974', 'Ц0065344', 'SPV-1.05.1544', 'KM-0216.2120', 'Ц0084848',
  'Ц0067523', 'TM-001.2.2173', 'Ц0064223', 'LMN-02.2342', 'P-014.1544',
  'Ц0064347', 'Ц0064226', 'Ц0083414', 'Ц0066543', 'Ц0075137', 'KM-0216.1544',
  'Ц0064229', 'Ц0075141', 'Ц0064232', 'KM-0216.0144', 'Ц0064230', 'Ц0074620',
  'Ц0064235', 'TM-001.2.2172', 'Ц0064220', 'PR-0018.0739', 'PR-0018.0144',
  'Ц0064217', 'LMN-02.1797', 'Ц0084847', 'Ц0075132'
];

export const cleanupProductsByArticle = (): { removed: number; remaining: number } => {
  console.log('\n🧹 ОЧИСТКА ТОВАРОВ ПО АРТИКУЛАМ');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const saved = localStorage.getItem('adminProducts') || localStorage.getItem('larana-products');
  
  if (!saved) {
    console.log('⚠️ Нет товаров в localStorage');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    return { removed: 0, remaining: 0 };
  }

  try {
    const products: Product[] = JSON.parse(saved);
    const initialCount = products.length;
    
    console.log(`📦 Найдено товаров: ${initialCount}`);
    
    const cleanedProducts = products.filter((product: Product) => {
      const shouldDelete = articlesToDelete.includes(product.supplierArticle || '');
      if (shouldDelete) {
        console.log(`   🗑️ Удаляю: ${product.title} (${product.supplierArticle})`);
      }
      return !shouldDelete;
    });
    
    const removedCount = initialCount - cleanedProducts.length;
    
    localStorage.setItem('adminProducts', JSON.stringify(cleanedProducts));
    localStorage.setItem('larana-products', JSON.stringify(cleanedProducts));
    localStorage.setItem('larana-products-version', Date.now().toString());
    
    window.dispatchEvent(new CustomEvent('larana-products-updated', {
      detail: { count: cleanedProducts.length, timestamp: new Date().toISOString() }
    }));
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 РЕЗУЛЬТАТЫ ОЧИСТКИ:');
    console.log(`   🗑️ Удалено: ${removedCount}`);
    console.log(`   ✅ Осталось: ${cleanedProducts.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    return { removed: removedCount, remaining: cleanedProducts.length };
  } catch (error) {
    console.error('❌ Ошибка очистки:', error);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    return { removed: 0, remaining: 0 };
  }
};
