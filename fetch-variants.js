// Простой скрипт для получения данных о вариантах
fetch('https://functions.poehali.dev/2654b969-f5e1-447b-9dc1-cce40403afb5')
  .then(res => res.json())
  .then(data => {
    console.log('='.repeat(100));
    console.log('РЕЗУЛЬТАТЫ АНАЛИЗА ВАРИАНТОВ ТОВАРОВ');
    console.log('='.repeat(100));
    console.log();
    
    console.log('СТАТИСТИКА:');
    console.log(`  Всего товаров без variant_group_id: ${data.total_products}`);
    console.log(`  Найдено групп: ${data.groups_found}`);
    
    let totalInGroups = 0;
    Object.values(data.groups).forEach(g => totalInGroups += g.products.length);
    console.log(`  Товаров в группах: ${totalInGroups}`);
    console.log();
    console.log('='.repeat(100));
    console.log();
    
    // Сортируем по количеству товаров
    const sorted = Object.entries(data.groups).sort((a, b) => b[1].products.length - a[1].products.length);
    
    sorted.forEach(([groupId, groupData], idx) => {
      console.log(`\nГРУППА ${idx + 1}: ${groupId}`);
      console.log(`Базовое название: "${groupData.base_name}"`);
      console.log(`Вариантов: ${groupData.products.length}`);
      console.log('-'.repeat(100));
      
      groupData.products.forEach(p => {
        console.log(`  - ID ${p.id} → color_variant: "${p.color_variant}"`);
        console.log(`    ${p.title}`);
        console.log(`    Остаток: ${p.stock_quantity} | Категория: ${p.category} | Артикул: ${p.supplier_article || 'нет'}`);
      });
    });
    
    console.log();
    console.log('='.repeat(100));
    console.log('ГОТОВО! Скопируйте результаты выше.');
    console.log('='.repeat(100));
  })
  .catch(err => console.error('Ошибка:', err));
