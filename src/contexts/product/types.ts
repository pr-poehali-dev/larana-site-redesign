export interface ProductVariant {
  id: number;
  colorVariant: string;
  stockQuantity: number;
  images: string[];
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
  variants?: ProductVariant[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ProductContextType {
  allFurnitureSets: Product[];
  availableProducts: Product[];
  bundles: any[];
  isLoading: boolean;
  setAllFurnitureSets: (products: Product[]) => void;
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  reloadProducts: () => Promise<void>;
  loadBundles: () => Promise<void>;
}
