import { useMemo } from 'react';

interface Product {
  id: number;
  title: string;
  variantGroupId?: string;
  colorVariant?: string;
  colors: string[];
  image: string;
  price: string;
  inStock: boolean;
  [key: string]: any;
}

/**
 * Получает все варианты цветов для товара
 */
export function useProductVariants(product: Product, allProducts: Product[]) {
  const variants = useMemo(() => {
    if (!product.variantGroupId || product.variantGroupId.trim() === '') {
      return [product];
    }

    // Находим все товары с таким же variantGroupId
    return allProducts.filter(p => p.variantGroupId === product.variantGroupId);
  }, [product, allProducts]);

  const hasVariants = variants.length > 1;

  const allAvailableColors = useMemo(() => {
    if (!hasVariants) {
      return product.colors;
    }

    // Собираем все уникальные цвета из вариантов
    const colorSet = new Set<string>();
    variants.forEach(v => {
      if (v.colorVariant) {
        colorSet.add(v.colorVariant);
      }
    });

    return Array.from(colorSet);
  }, [variants, hasVariants, product.colors]);

  return {
    variants,
    hasVariants,
    allAvailableColors,
    currentVariant: product
  };
}