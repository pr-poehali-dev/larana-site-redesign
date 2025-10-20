// Скрипт для анализа вариантов товаров
const API_URL = 'https://functions.poehali.dev/2654b969-f5e1-447b-9dc1-cce40403afb5';

async function analyzeVariants() {
    try {
        console.log('Загрузка данных из базы...\n');
        
        const response = await fetch(API_URL);
        const data = await response.json();
        
        console.log('='.repeat(80));
        console.log('АНАЛИЗ ВАРИАНТОВ ТОВАРОВ');
        console.log('='.repeat(80));
        console.log();
        
        console.log('СТАТИСТИКА:');
        console.log(`  Всего товаров без variant_group_id: ${data.total_products}`);
        console.log(`  Найдено групп для объединения: ${data.groups_found}`);
        
        let productsInGroups = 0;
        Object.values(data.groups).forEach(group => {
            productsInGroups += group.products.length;
        });
        console.log(`  Товаров будет сгруппировано: ${productsInGroups}`);
        console.log();
        console.log('='.repeat(80));
        console.log();
        
        // Сортируем группы по количеству товаров (от большего к меньшему)
        const sortedGroups = Object.entries(data.groups).sort((a, b) => {
            return b[1].products.length - a[1].products.length;
        });
        
        sortedGroups.forEach(([groupId, groupData], index) => {
            console.log(`ГРУППА ${index + 1}: ${groupId}`);
            console.log(`Базовое название: ${groupData.base_name}`);
            console.log(`Количество вариантов: ${groupData.products.length}`);
            console.log('-'.repeat(80));
            
            groupData.products.forEach(product => {
                const stockBadge = product.stock_quantity > 0 ? '✓' : '✗';
                console.log(`  [${stockBadge}] ID ${product.id} → color_variant: "${product.color_variant}"`);
                console.log(`      Название: ${product.title}`);
                console.log(`      Остаток: ${product.stock_quantity} | Категория: ${product.category || 'не указана'} | Артикул: ${product.supplier_article || 'нет'}`);
                console.log();
            });
            
            console.log();
        });
        
        console.log('='.repeat(80));
        console.log();
        console.log('ИНСТРУКЦИЯ ПО ПРИМЕНЕНИЮ:');
        console.log();
        console.log('Для каждой группы выполните SQL UPDATE:');
        console.log();
        console.log('UPDATE products SET');
        console.log('  variant_group_id = \'<group_id>\',');
        console.log('  color_variant = \'<color_variant>\'');
        console.log('WHERE id = <product_id>;');
        console.log();
        console.log('Например для первой группы:');
        if (sortedGroups.length > 0) {
            const [firstGroupId, firstGroupData] = sortedGroups[0];
            const firstProduct = firstGroupData.products[0];
            console.log();
            console.log(`UPDATE products SET`);
            console.log(`  variant_group_id = '${firstGroupId}',`);
            console.log(`  color_variant = '${firstProduct.color_variant}'`);
            console.log(`WHERE id = ${firstProduct.id};`);
        }
        console.log();
        console.log('='.repeat(80));
        
        // Сохраняем результат в JSON
        const fs = require('fs');
        fs.writeFileSync('variants-analysis-result.json', JSON.stringify(data, null, 2), 'utf8');
        console.log();
        console.log('Результаты сохранены в: variants-analysis-result.json');
        console.log('Откройте analyze-variants.html в браузере для визуального просмотра');
        
    } catch (error) {
        console.error('Ошибка:', error.message);
        process.exit(1);
    }
}

analyzeVariants();
