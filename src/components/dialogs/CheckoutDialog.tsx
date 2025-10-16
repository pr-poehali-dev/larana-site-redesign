import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import PhoneInput from '@/components/PhoneInput';
import EmailInput from '@/components/EmailInput';
import NameInput from '@/components/NameInput';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import CityAutocomplete from '@/components/CityAutocomplete';
import SavedAddresses from '@/components/SavedAddresses';
import { useCheckoutAudio } from './checkout/useCheckoutAudio';
import { useCheckoutData } from './checkout/useCheckoutData';

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
  const { playSound } = useCheckoutAudio();
  
  const {
    formData,
    setFormData,
    savedAddresses,
    hasSavedAddress,
    handleSelectAddress,
    handleAddAddress,
    handleDeleteAddress,
    handleSetDefaultAddress,
    isFormValid
  } = useCheckoutData(open, user);

  const total = cartItems.reduce((sum, item) => {
    const price = parseInt(item.price.replace(/\D/g, ''));
    return sum + (price * item.quantity);
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      playSound('error');
      return;
    }

    const savedUserData = {
      ...user,
      name: formData.name,
      phone: formData.phone,
      email: formData.email
    };
    localStorage.setItem('userData', JSON.stringify(savedUserData));
    playSound('success');
    onConfirmOrder(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">Оформление заказа</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Заполните данные для оформления заказа
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Icon name="User" size={20} />
              Контактные данные
            </h3>
            
            {user && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Icon name="CheckCircle2" size={16} className="text-primary" />
                  Данные заполнены из вашего профиля
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NameInput
                value={formData.name}
                onChange={(value) => setFormData(prev => ({...prev, name: value}))}
                label="Имя и фамилия"
                placeholder="Анна Иванова"
                required
              />
              <PhoneInput
                value={formData.phone}
                onChange={(value) => setFormData(prev => ({...prev, phone: value}))}
                label="Телефон"
                required
              />
            </div>
            
            <EmailInput
              value={formData.email}
              onChange={(value) => setFormData(prev => ({...prev, email: value}))}
              label="Email"
              placeholder="example@mail.ru"
              required
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Icon name="Package" size={20} />
              Способ получения
            </h3>
            
            <RadioGroup 
              value={formData.deliveryType} 
              onValueChange={(value) => setFormData(prev => ({...prev, deliveryType: value}))}
            >
              <div className="flex items-center space-x-2 border rounded-lg p-3 sm:p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="delivery" id="delivery" />
                <Label htmlFor="delivery" className="flex-1 cursor-pointer mb-0">
                  <div className="flex items-center gap-2">
                    <Icon name="Truck" size={18} className="flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm sm:text-base">Доставка курьером</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Бесплатно, 3-7 дней</p>
                    </div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3 sm:p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="pickup" id="pickup" />
                <Label htmlFor="pickup" className="flex-1 cursor-pointer mb-0">
                  <div className="flex items-center gap-2">
                    <Icon name="Store" size={18} className="flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm sm:text-base">Самовывоз из магазина</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Бесплатно, готов сегодня</p>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {formData.deliveryType === 'delivery' && (
            <>
              <SavedAddresses
                addresses={savedAddresses}
                onSelect={handleSelectAddress}
                onAdd={handleAddAddress}
                onDelete={handleDeleteAddress}
                onSetDefault={handleSetDefaultAddress}
                currentFormData={formData}
              />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Icon name="MapPin" size={20} />
                  Адрес доставки
                </h3>

                {hasSavedAddress && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CityAutocomplete
                    value={formData.city}
                    onChange={(value) => setFormData(prev => ({...prev, city: value}))}
                    label="Город"
                    required
                  />
                  <AddressAutocomplete
                    value={formData.address}
                    onChange={(value) => setFormData(prev => ({...prev, address: value}))}
                    city={formData.city}
                    label="Улица и дом"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <Label htmlFor="apartment" className="text-sm">Квартира</Label>
                    <Input
                      id="apartment"
                      value={formData.apartment}
                      onChange={(e) => setFormData(prev => ({...prev, apartment: e.target.value}))}
                      placeholder="12"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="entrance" className="text-sm">Подъезд</Label>
                    <Input
                      id="entrance"
                      value={formData.entrance}
                      onChange={(e) => setFormData(prev => ({...prev, entrance: e.target.value}))}
                      placeholder="2"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="floor" className="text-sm">Этаж</Label>
                    <Input
                      id="floor"
                      value={formData.floor}
                      onChange={(e) => setFormData(prev => ({...prev, floor: e.target.value}))}
                      placeholder="5"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="intercom" className="text-sm">Домофон</Label>
                    <Input
                      id="intercom"
                      value={formData.intercom}
                      onChange={(e) => setFormData(prev => ({...prev, intercom: e.target.value}))}
                      placeholder="123"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Icon name="CreditCard" size={20} />
              Способ оплаты
            </h3>
            
            <RadioGroup 
              value={formData.paymentType} 
              onValueChange={(value) => setFormData(prev => ({...prev, paymentType: value}))}
            >
              <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex-1 cursor-pointer mb-0">
                  <div className="flex items-center gap-2">
                    <Icon name="CreditCard" size={18} />
                    <span className="text-sm sm:text-base">Картой онлайн</span>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex-1 cursor-pointer mb-0">
                  <div className="flex items-center gap-2">
                    <Icon name="Banknote" size={18} />
                    <span className="text-sm sm:text-base">Наличными при получении</span>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="comment" className="text-sm">Комментарий к заказу (необязательно)</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({...prev, comment: e.target.value}))}
              placeholder="Дополнительная информация для курьера..."
              className="mt-1 min-h-[80px]"
            />
          </div>

          <Separator />

          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Icon name="ShoppingCart" size={20} />
              Ваш заказ
            </h3>
            
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm py-2 border-b border-border/50 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-muted-foreground text-xs">{item.quantity} шт × {item.price}</p>
                  </div>
                  <p className="font-semibold">
                    {(parseInt(item.price.replace(/\D/g, '')) * item.quantity).toLocaleString('ru-RU')} ₽
                  </p>
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Итого:</span>
              <span className="text-primary">{total.toLocaleString('ru-RU')} ₽</span>
            </div>
          </div>

          <Button 
            type="submit" 
            size="lg"
            className="w-full text-base transition-all duration-300 hover:scale-105"
            disabled={!isFormValid()}
          >
            <Icon name="ShoppingBag" size={20} className="mr-2" />
            Подтвердить заказ на {total.toLocaleString('ru-RU')} ₽
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
