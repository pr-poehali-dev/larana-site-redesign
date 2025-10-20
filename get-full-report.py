#!/usr/bin/env python3
"""
Скрипт для получения полного отчета по вариантам товаров
"""
import requests
import json

API_URL = 'https://functions.poehali.dev/2654b969-f5e1-447b-9dc1-cce40403afb5'

def main():
    print("Загрузка данных из API...")
    print()
    
    try:
        response = requests.get(API_URL)
        response.raise_for_status()
        data = response.json()
        
        print("=" * 100)
        print("АНАЛИЗ ВАРИАНТОВ ТОВАРОВ - ПОЛНЫЙ ОТЧЕТ")
        print("=" * 100)
        print()
        
        print("СТАТИСТИКА:")
        print(f"  Всего товаров без variant_group_id: {data['total_products']}")
        print(f"  Найдено групп: {data['groups_found']}")
        
        total_in_groups = sum(len(g['products']) for g in data['groups'].values())
        print(f"  Товаров в группах: {total_in_groups}")
        print()
        print("=" * 100)
        print()
        
        # Сортируем группы по количеству товаров
        sorted_groups = sorted(
            data['groups'].items(), 
            key=lambda x: len(x[1]['products']), 
            reverse=True
        )
        
        for idx, (group_id, group_data) in enumerate(sorted_groups, 1):
            print(f"\nГРУППА {idx}: {group_id}")
            print(f"Базовое название: \"{group_data['base_name']}\"")
            print(f"Количество вариантов: {len(group_data['products'])}")
            print("-" * 100)
            
            for product in group_data['products']:
                stock_icon = "✓" if product['stock_quantity'] > 0 else "✗"
                print(f"  [{stock_icon}] ID {product['id']} → color_variant: \"{product['color_variant']}\"")
                print(f"      Название: {product['title']}")
                print(f"      Остаток: {product['stock_quantity']} | " 
                      f"Категория: {product['category'] or 'не указана'} | "
                      f"Артикул: {product['supplier_article'] or 'нет'}")
                print()
        
        print()
        print("=" * 100)
        print("ГОТОВО!")
        print("=" * 100)
        print()
        print("СЛЕДУЮЩИЕ ШАГИ:")
        print("1. Просмотрите группы выше")
        print("2. Для каждой группы создайте SQL UPDATE запросы")
        print("3. Пример запроса:")
        print()
        
        if sorted_groups:
            first_group_id, first_group_data = sorted_groups[0]
            first_product = first_group_data['products'][0]
            print("   UPDATE products SET")
            print(f"     variant_group_id = '{first_group_id}',")
            print(f"     color_variant = '{first_product['color_variant']}'")
            print(f"   WHERE id = {first_product['id']};")
        
        print()
        print("=" * 100)
        
        # Сохраняем в JSON
        with open('variants-full-data.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print()
        print("Данные сохранены в: variants-full-data.json")
        
    except requests.RequestException as e:
        print(f"Ошибка при запросе к API: {e}")
        return 1
    except Exception as e:
        print(f"Ошибка: {e}")
        return 1
    
    return 0

if __name__ == '__main__':
    exit(main())
