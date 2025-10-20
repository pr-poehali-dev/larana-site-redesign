import { CartItem, Product } from './types';

export const loadCartFromStorage = (): CartItem[] => {
  try {
    const saved = localStorage.getItem('larana-cart');
    if (!saved) return [];
    
    const parsed = JSON.parse(saved);
    
    if (!Array.isArray(parsed)) return [];
    
    const validated = parsed.filter(item => 
      item && 
      typeof item === 'object' && 
      typeof item.id === 'number' &&
      typeof item.title === 'string' &&
      typeof item.price === 'string' &&
      typeof item.quantity === 'number'
    );
    
    return validated;
  } catch (error) {
    console.error('Ошибка загрузки корзины:', error);
    return [];
  }
};

export const saveCartToStorage = (cartItems: CartItem[]): void => {
  try {
    localStorage.setItem('larana-cart', JSON.stringify(cartItems));
  } catch (error) {
    console.error('Ошибка сохранения корзины:', error);
  }
};

export const addProductToCart = (cartItems: CartItem[], product: Product): CartItem[] => {
  console.log('🛒 Добавление в корзину:', product.title, 'ID:', product.id);
  const existing = cartItems.find(item => item.id === product.id);
  
  if (existing) {
    console.log('✅ Товар уже в корзине, увеличиваем количество');
    return cartItems.map(item =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  }
  
  console.log('✅ Добавлен новый товар в корзину');
  return [...cartItems, { ...product, quantity: 1 }];
};

export const removeProductFromCart = (cartItems: CartItem[], id: number): CartItem[] => {
  console.log('🗑️ Удаление из корзины ID:', id);
  return cartItems.filter(item => item.id !== id);
};

export const updateProductQuantity = (cartItems: CartItem[], id: number, quantity: number): CartItem[] => {
  console.log('🔢 Обновление количества ID:', id, 'Новое количество:', quantity);
  
  if (quantity <= 0) {
    return removeProductFromCart(cartItems, id);
  }
  
  return cartItems.map(item =>
    item.id === id ? { ...item, quantity } : item
  );
};
