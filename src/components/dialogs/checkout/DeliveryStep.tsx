import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Icon from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import CityAutocomplete from '@/components/CityAutocomplete';
import SavedAddresses, { SavedAddress } from '@/components/SavedAddresses';

interface DeliveryStepProps {
  formData: {
    deliveryType: string;
    address: string;
    city: string;
    apartment: string;
    entrance: string;
    floor: string;
    intercom: string;
    paymentType: string;
    comment: string;
  };
  setFormData: (data: any) => void;
  savedAddresses: SavedAddress[];
  hasSavedAddress: boolean;
  onSelectAddress: (address: SavedAddress) => void;
  onAddAddress: (address: SavedAddress) => void;
  onDeleteAddress: (id: string) => void;
  onSetDefaultAddress: (id: string) => void;
}

const DeliveryStep = ({
  formData,
  setFormData,
  savedAddresses,
  hasSavedAddress,
  onSelectAddress,
  onAddAddress,
  onDeleteAddress,
  onSetDefaultAddress
}: DeliveryStepProps) => {
  return (
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
            onSelect={onSelectAddress}
            onAdd={onAddAddress}
            onDelete={onDeleteAddress}
            onSetDefault={onSetDefaultAddress}
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
  );
};

export default DeliveryStep;
