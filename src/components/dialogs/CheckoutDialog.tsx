import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SavedAddress } from '@/components/SavedAddresses';
import ContactStep from './checkout/ContactStep';
import DeliveryStep from './checkout/DeliveryStep';
import ConfirmationStep from './checkout/ConfirmationStep';

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
            <ContactStep
              formData={formData}
              setFormData={setFormData}
              user={user}
            />
          )}

          {step === 2 && (
            <DeliveryStep
              formData={formData}
              setFormData={setFormData}
              savedAddresses={savedAddresses}
              hasSavedAddress={hasSavedAddress}
              onSelectAddress={handleSelectAddress}
              onAddAddress={handleAddAddress}
              onDeleteAddress={handleDeleteAddress}
              onSetDefaultAddress={handleSetDefaultAddress}
            />
          )}

          {step === 3 && (
            <ConfirmationStep
              formData={formData}
              cartItems={cartItems}
              total={total}
            />
          )}

          <div className="flex gap-2">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                <Icon name="ChevronLeft" size={20} className="mr-1" />
                Назад
              </Button>
            )}
            <Button type="submit" className="flex-1">
              {step === 3 ? 'Подтвердить заказ' : 'Продолжить'}
              {step < 3 && <Icon name="ChevronRight" size={20} className="ml-1" />}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
