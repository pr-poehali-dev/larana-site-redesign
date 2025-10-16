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
import CityAutocomplete from '@/components/CityAutocomplete';
import SavedAddresses, { SavedAddress } from '@/components/SavedAddresses';

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
    apartment: '',
    entrance: '',
    floor: '',
    intercom: '',
    comment: '',
    deliveryType: 'delivery',
    paymentType: 'card'
  });
  const [saveAddress, setSaveAddress] = useState(true);
  const [hasSavedAddress, setHasSavedAddress] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);

  useEffect(() => {
    if (open) {
      const storedAddresses = localStorage.getItem('savedAddresses');
      if (storedAddresses) {
        const addresses = JSON.parse(storedAddresses);
        setSavedAddresses(addresses);
        
        const defaultAddress = addresses.find((a: SavedAddress) => a.isDefault);
        if (defaultAddress) {
          setFormData(prev => ({
            ...prev,
            city: defaultAddress.city,
            address: defaultAddress.address,
            apartment: defaultAddress.apartment || '',
            entrance: defaultAddress.entrance || '',
            floor: defaultAddress.floor || '',
            intercom: defaultAddress.intercom || ''
          }));
          setHasSavedAddress(true);
        }
      }
      
      if (user) {
        setFormData(prev => ({
          ...prev,
          name: user.name || prev.name,
          phone: user.phone || prev.phone,
          email: user.email || prev.email
        }));
      }
    }
  }, [user, open]);

  const total = cartItems.reduce((sum, item) => {
    const price = parseInt(item.price.replace(/\D/g, ''));
    return sum + (price * item.quantity);
  }, 0);

  const handleAddAddress = (address: SavedAddress) => {
    const updatedAddresses = [...savedAddresses, address];
    setSavedAddresses(updatedAddresses);
    localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
  };

  const handleSelectAddress = (address: SavedAddress) => {
    setFormData({
      ...formData,
      city: address.city,
      address: address.address,
      apartment: address.apartment || '',
      entrance: address.entrance || '',
      floor: address.floor || '',
      intercom: address.intercom || ''
    });
    setHasSavedAddress(true);
  };

  const handleDeleteAddress = (id: string) => {
    const updatedAddresses = savedAddresses.filter(a => a.id !== id);
    setSavedAddresses(updatedAddresses);
    localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
  };

  const handleSetDefaultAddress = (id: string) => {
    const updatedAddresses = savedAddresses.map(a => ({
      ...a,
      isDefault: a.id === id
    }));
    setSavedAddresses(updatedAddresses);
    localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      const savedUserData = {
        ...user,
        name: formData.name,
        phone: formData.phone,
        email: formData.email
      };
      localStorage.setItem('userData', JSON.stringify(savedUserData));
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
                  <SavedAddresses
                    addresses={savedAddresses}
                    onSelect={handleSelectAddress}
                    onAdd={handleAddAddress}
                    onDelete={handleDeleteAddress}
                    onSetDefault={handleSetDefaultAddress}
                    currentFormData={formData}
                  />

                  <Separator />
                  
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Адрес доставки</Label>
                    {hasSavedAddress && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2 mb-3">
                        <Icon name="CheckCircle2" size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-900">Выбран сохранённый адрес</p>
                          <p className="text-xs text-green-700 mt-1">
                            {formData.city}, {formData.address}
                            {formData.apartment && `, кв. ${formData.apartment}`}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
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
                  <CityAutocomplete
                    value={formData.city}
                    onChange={(value) => setFormData({...formData, city: value})}
                    label="Город"
                    placeholder="Начните вводить название города..."
                    required
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="apartment">Квартира</Label>
                      <Input
                        id="apartment"
                        type="text"
                        placeholder="123"
                        value={formData.apartment}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d]/g, '');
                          setFormData({...formData, apartment: value});
                        }}
                        maxLength={6}
                      />
                      {formData.apartment && formData.apartment.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Icon name="Info" size={12} />
                          Только цифры
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="entrance">Подъезд</Label>
                      <Input
                        id="entrance"
                        type="text"
                        placeholder="2"
                        value={formData.entrance}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d]/g, '');
                          if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 99)) {
                            setFormData({...formData, entrance: value});
                          }
                        }}
                        maxLength={2}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="floor">Этаж</Label>
                      <Input
                        id="floor"
                        type="text"
                        placeholder="5"
                        value={formData.floor}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d-]/g, '');
                          if (value === '' || value === '-' || (parseInt(value) >= -5 && parseInt(value) <= 200)) {
                            setFormData({...formData, floor: value});
                          }
                        }}
                        maxLength={3}
                      />
                      {formData.floor && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {parseInt(formData.floor) < 0 ? '🅿️ Подвал/паркинг' : '🏢 Этаж'}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="intercom">Домофон</Label>
                      <Input
                        id="intercom"
                        type="text"
                        placeholder="123К456"
                        value={formData.intercom}
                        onChange={(e) => {
                          const value = e.target.value.toUpperCase().replace(/[^0-9A-ZА-ЯЁ]/g, '');
                          setFormData({...formData, intercom: value});
                        }}
                        maxLength={10}
                      />
                    </div>
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
                    {formData.apartment && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Квартира:</span>
                        <span>{formData.apartment}</span>
                      </div>
                    )}
                    {formData.entrance && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Подъезд:</span>
                        <span>{formData.entrance}</span>
                      </div>
                    )}
                    {formData.floor && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Этаж:</span>
                        <span>{formData.floor}</span>
                      </div>
                    )}
                    {formData.intercom && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Домофон:</span>
                        <span>{formData.intercom}</span>
                      </div>
                    )}
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