import { Separator } from '@/components/ui/separator';

interface CartItem {
  id: number;
  title: string;
  price: string;
  quantity: number;
}

interface ConfirmationStepProps {
  formData: {
    name: string;
    phone: string;
    email: string;
    deliveryType: string;
    city: string;
    address: string;
    apartment?: string;
    entrance?: string;
    floor?: string;
    intercom?: string;
    paymentType: string;
    comment?: string;
  };
  cartItems: CartItem[];
  total: number;
}

const ConfirmationStep = ({ formData, cartItems, total }: ConfirmationStepProps) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="bg-secondary rounded-lg p-3 sm:p-4 space-y-2">
        <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3">Данные получателя</h4>
        <div className="flex justify-between text-xs sm:text-sm gap-2">
          <span className="text-muted-foreground">Имя:</span>
          <span className="text-right">{formData.name}</span>
        </div>
        <div className="flex justify-between text-xs sm:text-sm gap-2">
          <span className="text-muted-foreground">Телефон:</span>
          <span className="text-right">{formData.phone}</span>
        </div>
        <div className="flex justify-between text-xs sm:text-sm gap-2">
          <span className="text-muted-foreground">Email:</span>
          <span className="text-right break-all">{formData.email}</span>
        </div>
      </div>

      <div className="bg-secondary rounded-lg p-3 sm:p-4 space-y-2">
        <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3">Доставка</h4>
        <div className="flex justify-between text-xs sm:text-sm gap-2">
          <span className="text-muted-foreground">Способ:</span>
          <span className="text-right">{formData.deliveryType === 'delivery' ? 'Доставка курьером' : 'Самовывоз'}</span>
        </div>
        {formData.deliveryType === 'delivery' && (
          <>
            <div className="flex justify-between text-xs sm:text-sm gap-2">
              <span className="text-muted-foreground">Город:</span>
              <span className="text-right">{formData.city}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm gap-2">
              <span className="text-muted-foreground">Адрес:</span>
              <span className="text-right">{formData.address}</span>
            </div>
            {formData.apartment && (
              <div className="flex justify-between text-xs sm:text-sm gap-2">
                <span className="text-muted-foreground">Квартира:</span>
                <span className="text-right">{formData.apartment}</span>
              </div>
            )}
            {formData.entrance && (
              <div className="flex justify-between text-xs sm:text-sm gap-2">
                <span className="text-muted-foreground">Подъезд:</span>
                <span className="text-right">{formData.entrance}</span>
              </div>
            )}
            {formData.floor && (
              <div className="flex justify-between text-xs sm:text-sm gap-2">
                <span className="text-muted-foreground">Этаж:</span>
                <span className="text-right">{formData.floor}</span>
              </div>
            )}
            {formData.intercom && (
              <div className="flex justify-between text-xs sm:text-sm gap-2">
                <span className="text-muted-foreground">Домофон:</span>
                <span className="text-right">{formData.intercom}</span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="bg-secondary rounded-lg p-3 sm:p-4 space-y-2">
        <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3">Оплата</h4>
        <div className="flex justify-between text-xs sm:text-sm gap-2">
          <span className="text-muted-foreground">Способ:</span>
          <span className="text-right">
            {formData.paymentType === 'card' ? 'Картой онлайн' : 
             formData.paymentType === 'cash' ? 'Наличными' : 'Рассрочка 0%'}
          </span>
        </div>
      </div>

      {formData.comment && (
        <div className="bg-secondary rounded-lg p-4">
          <h4 className="font-semibold mb-2">Комментарий</h4>
          <p className="text-sm text-muted-foreground">{formData.comment}</p>
        </div>
      )}

      <Separator />

      <div className="bg-primary/10 rounded-lg p-4">
        <div className="flex justify-between mb-2">
          <span>Товары ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} шт.):</span>
          <span>{total} ₽</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Доставка:</span>
          <span className="text-green-600">Бесплатно</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between text-xl font-bold">
          <span>Итого:</span>
          <span>{total} ₽</span>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold">Состав заказа</h4>
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between text-sm py-2 border-b">
            <span>{item.title} × {item.quantity}</span>
            <span>{parseInt(item.price.replace(/\D/g, '')) * item.quantity} ₽</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConfirmationStep;