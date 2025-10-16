import { useToast } from '@/hooks/use-toast';

export const useOrderLogic = (cartItems: any[], clearCart: () => void, user: any) => {
  const { toast } = useToast();

  const handleConfirmOrder = async (orderData: any) => {
    try {
      const totalAmount = cartItems.reduce((sum, item) => {
        const price = parseInt(item.price.replace(/\D/g, ''));
        return sum + (price * item.quantity);
      }, 0);

      const userEmail = user?.email || orderData.email;

      const response = await fetch('https://functions.poehali.dev/f363b242-7b94-4530-a6e9-e75c166d29e0', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userEmail
        },
        body: JSON.stringify({
          ...orderData,
          totalAmount,
          items: cartItems.map(item => ({
            id: item.id,
            title: item.title,
            price: parseInt(item.price.replace(/\D/g, '')),
            quantity: item.quantity
          }))
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Order created successfully:', data);
        
        const fullAddress = [
          orderData.address,
          orderData.apartment ? `кв. ${orderData.apartment}` : '',
          orderData.entrance ? `подъезд ${orderData.entrance}` : '',
          orderData.floor ? `этаж ${orderData.floor}` : '',
          orderData.intercom ? `домофон ${orderData.intercom}` : ''
        ].filter(Boolean).join(', ');
        
        fetch('https://functions.poehali.dev/5bb39c34-5468-4f00-906c-c2bed52f18d9', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order: {
              orderNumber: data.orderNumber,
              name: orderData.name,
              email: userEmail,
              phone: orderData.phone,
              deliveryType: orderData.deliveryType,
              paymentType: orderData.paymentType,
              address: orderData.address,
              apartment: orderData.apartment,
              entrance: orderData.entrance,
              floor: orderData.floor,
              intercom: orderData.intercom,
              totalAmount,
              items: cartItems.map(item => ({
                title: item.title,
                price: parseInt(item.price.replace(/\D/g, '')),
                quantity: item.quantity
              })),
              comment: orderData.comment
            }
          })
        }).catch(err => console.log('Telegram notification failed:', err));
        
        toast({ 
          title: "Заказ успешно оформлен!", 
          description: `Номер заказа: ${data.orderNumber}. Мы свяжемся с вами в ближайшее время.`,
          duration: 5000
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Order creation failed:', response.status, errorData);
        toast({ 
          title: "Ошибка оформления заказа", 
          description: errorData.error || "Попробуйте снова или свяжитесь с нами",
          variant: "destructive",
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Order request error:', error);
      toast({ 
        title: "Ошибка оформления заказа", 
        description: "Проверьте подключение к интернету",
        variant: "destructive",
        duration: 5000
      });
    }
    clearCart();
  };

  return {
    handleConfirmOrder
  };
};