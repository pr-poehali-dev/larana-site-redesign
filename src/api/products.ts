import funcUrls from '../../backend/func2url.json';

const PRODUCTS_API = funcUrls.products;

export interface DBProduct {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  discount_price: number | null;
  category: string;
  style: string;
  colors: string[];
  images: string[];
  items: string[];
  in_stock: boolean;
  is_new: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  title: string;
  category: string;
  price: string;
  image: string;
  images?: string[];
  items: string[];
  style: string;
  description: string;
  colors: string[];
  inStock: boolean;
  supplierArticle?: string;
  stockQuantity?: number | null;
  variantGroupId?: string;
  colorVariant?: string;
}

function dbProductToFrontend(dbProduct: DBProduct): Product {
  return {
    id: dbProduct.id,
    title: dbProduct.title,
    category: dbProduct.category,
    price: dbProduct.discount_price 
      ? `${dbProduct.discount_price.toLocaleString('ru-RU')} ₽`
      : `${dbProduct.price.toLocaleString('ru-RU')} ₽`,
    image: dbProduct.images[0] || '',
    images: dbProduct.images,
    items: dbProduct.items,
    style: dbProduct.style,
    description: dbProduct.description,
    colors: dbProduct.colors,
    inStock: dbProduct.in_stock
  };
}

function frontendToDbProduct(product: Partial<Product>): Partial<DBProduct> {
  const priceStr = product.price?.replace(/[^\d]/g, '') || '0';
  const price = parseInt(priceStr, 10);
  
  return {
    title: product.title,
    slug: product.title?.toLowerCase().replace(/[^а-яa-z0-9]+/g, '-') || '',
    description: product.description || '',
    price: price,
    discount_price: null,
    category: product.category,
    style: product.style || 'Современный',
    colors: product.colors || ['Базовый'],
    images: product.images || [product.image || ''],
    items: product.items || [],
    in_stock: product.inStock !== undefined ? product.inStock : true,
    is_new: false
  };
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const response = await fetch(PRODUCTS_API);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const dbProducts: DBProduct[] = await response.json();
    return dbProducts.map(dbProductToFrontend);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function createProduct(product: Partial<Product>): Promise<Product | null> {
  try {
    const dbProduct = frontendToDbProduct(product);
    const response = await fetch(PRODUCTS_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dbProduct),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const created: DBProduct = await response.json();
    return dbProductToFrontend(created);
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
}

export async function updateProduct(id: number, product: Partial<Product>): Promise<Product | null> {
  try {
    const dbProduct = frontendToDbProduct(product);
    const response = await fetch(`${PRODUCTS_API}?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dbProduct),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const updated: DBProduct = await response.json();
    return dbProductToFrontend(updated);
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
}

export async function deleteProduct(id: number): Promise<boolean> {
  try {
    const response = await fetch(`${PRODUCTS_API}?id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
}
