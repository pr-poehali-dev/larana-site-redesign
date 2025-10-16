import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useCartLogic = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const { toast } = useToast();

  const handleAddToCart = (set: any) => {
    const existingItem = cartItems.find(item => item.id === set.id);
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === set.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...set, quantity: 1 }]);
    }
    toast({ 
      title: "Комплект добавлен в корзину!", 
      description: `${set.title} успешно добавлен`
    });
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast({ title: "Товар удален из корзины" });
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return {
    cartItems,
    handleAddToCart,
    handleRemoveFromCart,
    handleUpdateQuantity,
    clearCart
  };
};
