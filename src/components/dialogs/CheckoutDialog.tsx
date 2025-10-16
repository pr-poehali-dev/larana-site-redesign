import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import PhoneInput from '@/components/PhoneInput';
import EmailInput from '@/components/EmailInput';

interface CartItem {
  id: number;
  title: string;
  price: string;
  quantity: number;
}

interface CheckoutDialogProps {
  open: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onConfirmOrder: (orderData: any) => void;
  user?: any;
}

const CheckoutDialog = ({ open, onClose, cartItems, onConfirmOrder, user }: CheckoutDialogProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    comment: '',
    deliveryType: 'delivery',
    paymentType: 'card'
  });

  useEffect(() => {
    if (user && open) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        address: user.address || '',
        city: user.city || ''
      }));
    }
  }, [user, open]);

  const total = cartItems.reduce((sum, item) => {
    const price = parseInt(item.price.replace(/\D/g, ''));
    return sum + (price * item.quantity);
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      onConfirmOrder(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Оформление заказа</DialogTitle>
          <DialogDescription>
            Шаг {step} из 3: {step === 1 ? 'Контактные данные' : step === 2 ? 'Доставка и оплата' : 'Подтверждение'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`flex-1 h-2 rounded-full ${s <= step ? 'bg-primary' : 'bg-muted'}`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              {user && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Icon name="CheckCircle2" size={16} className="text-primary" />
                    Данные заполнены автоматически из вашего профиля
                  </p>
                </div>
              )}
              <div>
                <Label htmlFor="name">Имя и фамилия *</Label>
                <Input 
                  id="name" 
                  placeholder="Анна Иванова" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <PhoneInput
                value={formData.phone}
                onChange={(value) => setFormData({...formData, phone: value})}
                label="Телефон"
                required
              />
              <EmailInput
                value={formData.email}
                onChange={(value) => setFormData({...formData, email: value})}
                label="Email"
                placeholder="example@mail.ru"
                required
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <Label className="mb-3 block">Способ получения</Label>
                <RadioGroup 
                  value={formData.deliveryType} 
                  onValueChange={(value) => setFormData({...formData, deliveryType: value})}
                >
                  <div className="flex items-center space-x-2 border rounded-lg p-4">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Icon name="Truck" size={20} />
                        <div>
                          <p className="font-semibold">Доставка курьером</p>
                          <p className="text-sm text-muted-foreground">Бесплатно, 3-7 дней</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-4">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Icon name="Store" size={20} />
                        <div>
                          <p className="font-semibold">Самовывоз из магазина</p>
                          <p className="text-sm text-muted-foreground">Бесплатно, готов сегодня</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.deliveryType === 'delivery' && (
                <div className="space-y-4">
                  <AddressAutocomplete
                    value={formData.address}
                    onChange={(value, suggestion) => {
                      if (suggestion) {
                        setFormData({
                          ...formData,
                          address: suggestion.value,
                          city: suggestion.city || formData.city
                        });
                      } else {
                        setFormData({...formData, address: value});
                      }
                    }}
                    label="Адрес доставки"
                    placeholder="Начните вводить адрес..."
                    required
                  />
                  <div>
                    <Label htmlFor="city">Город *</Label>
                    <Input 
                      id="city" 
                      placeholder="Москва" 
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                </div>
              )}

              <div>
                <Label className="mb-3 block">Способ оплаты</Label>
                <RadioGroup 
                  value={formData.paymentType} 
                  onValueChange={(value) => setFormData({...formData, paymentType: value})}
                >
                  <div className="flex items-center space-x-2 border rounded-lg p-4">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Icon name="CreditCard" size={20} />
                        <span>Оплата картой онлайн</span>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-4">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Icon name="Wallet" size={20} />
                        <span>Наличными при получении</span>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-4">
                    <RadioGroupItem value="installment" id="installment" />
                    <Label htmlFor="installment" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Icon name="Calendar" size={20} />
                        <span>Рассрочка 0%</span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="comment">Комментарий к заказу</Label>
                <Textarea 
                  id="comment" 
                  placeholder="Укажите удобное время доставки или другие пожелания"
                  value={formData.comment}
                  onChange={(e) => setFormData({...formData, comment: e.target.value})}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-secondary rounded-lg p-4 space-y-2">
                <h4 className="font-semibold mb-3">Данные получателя</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Имя:</span>
                  <span>{formData.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Телефон:</span>
                  <span>{formData.phone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{formData.email}</span>
                </div>
              </div>

              <div className="bg-secondary rounded-lg p-4 space-y-2">
                <h4 className="font-semibold mb-3">Доставка</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Способ:</span>
                  <span>{formData.deliveryType === 'delivery' ? 'Доставка курьером' : 'Самовывоз'}</span>
                </div>
                {formData.deliveryType === 'delivery' && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Город:</span>
                      <span>{formData.city}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Адрес:</span>
                      <span>{formData.address}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="bg-secondary rounded-lg p-4 space-y-2">
                <h4 className="font-semibold mb-3">Оплата</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Способ:</span>
                  <span>
                    {formData.paymentType === 'card' ? 'Картой онлайн' : 
                     formData.paymentType === 'cash' ? 'Наличными' : 'Рассрочка 0%'}
                  </span>
                </div>
              </div>

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
            </div>
          )}

          <div className="flex gap-4">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                <Icon name="ArrowLeft" size={20} className="mr-2" />
                Назад
              </Button>
            )}
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-foreground">
              {step === 3 ? 'Подтвердить заказ' : 'Далее'}
              {step < 3 && <Icon name="ArrowRight" size={20} className="ml-2" />}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;