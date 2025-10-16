import { useState, useEffect, useRef } from 'react';
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
  
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [swipeHintVisible, setSwipeHintVisible] = useState(true);

  useEffect(() => {
    if (open) {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        setFormData(prev => ({
          ...prev,
          name: userData.name || prev.name,
          phone: userData.phone || prev.phone,
          email: userData.email || prev.email
        }));
      }

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

  const isStep1Valid = () => {
    const phoneDigits = formData.phone.replace(/\D/g, '');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    return (
      formData.name.trim().length >= 2 &&
      phoneDigits.length === 11 &&
      emailRegex.test(formData.email)
    );
  };

  const isStep2Valid = () => {
    if (formData.deliveryType === 'delivery') {
      return formData.city.trim().length > 0 && formData.address.trim().length > 0;
    }
    return true;
  };

  const calculateProgress = () => {
    let filledFields = 0;
    const totalFields = 5;

    if (formData.name.trim().length >= 2) filledFields++;
    
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length === 11) filledFields++;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(formData.email)) filledFields++;

    if (formData.deliveryType === 'delivery') {
      if (formData.city.trim().length > 0) filledFields++;
      if (formData.address.trim().length > 0) filledFields++;
    } else {
      filledFields += 2;
    }

    return Math.round((filledFields / totalFields) * 100);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    if (swipeHintVisible) {
      setSwipeHintVisible(false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Свайп влево - следующий шаг
        if (step === 1 && isStep1Valid()) {
          setStep(2);
        } else if (step === 2 && isStep2Valid()) {
          setStep(3);
        }
      } else {
        // Свайп вправо - предыдущий шаг
        if (step > 1) {
          setStep(step - 1);
        }
      }
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  useEffect(() => {
    if (open) {
      setSwipeHintVisible(true);
      const timer = setTimeout(() => {
        setSwipeHintVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      const phoneDigits = formData.phone.replace(/\D/g, '');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      console.log('Validation Step 1:', {
        name: formData.name,
        nameValid: formData.name.trim().length >= 2,
        phone: formData.phone,
        phoneDigits: phoneDigits,
        phoneValid: phoneDigits.length === 11,
        email: formData.email,
        emailValid: emailRegex.test(formData.email)
      });
      
      if (!isStep1Valid()) {
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!isStep2Valid()) {
        return;
      }
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">Оформление заказа</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Шаг {step} из 3: {step === 1 ? 'Контактные данные' : step === 2 ? 'Доставка и оплата' : 'Подтверждение'}
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4 px-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">
              Заполнено полей
            </span>
            <span className="text-xs sm:text-sm font-bold text-primary">
              {calculateProgress()}%
            </span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${calculateProgress()}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
          {calculateProgress() === 100 && (
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-300">
              <Icon name="CheckCircle2" size={12} />
              Все обязательные поля заполнены!
            </p>
          )}
        </div>

        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {[
              { num: 1, label: 'Контакты' },
              { num: 2, label: 'Доставка' },
              { num: 3, label: 'Готово' }
            ].map((item) => (
              <div key={item.num} className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-bold transition-all duration-500 ${
                    item.num === step
                      ? 'bg-primary text-primary-foreground scale-110 shadow-lg'
                      : item.num < step
                      ? 'bg-primary/80 text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {item.num < step ? (
                    <Icon name="Check" size={16} className="sm:w-5 sm:h-5 animate-in fade-in zoom-in duration-300" />
                  ) : (
                    item.num
                  )}
                </div>
                <span
                  className={`text-[10px] sm:text-xs mt-1 sm:mt-2 transition-all duration-300 ${
                    item.num === step
                      ? 'text-primary font-semibold'
                      : item.num < step
                      ? 'text-primary/80'
                      : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                  s <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          
          {swipeHintVisible && (
            <div className="sm:hidden flex items-center justify-center gap-2 text-xs text-muted-foreground mt-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <Icon name="ChevronsLeft" size={14} className="animate-pulse" />
              <span>Свайпайте для переключения шагов</span>
              <Icon name="ChevronsRight" size={14} className="animate-pulse" />
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div 
            ref={containerRef}
            className="relative min-h-[350px] sm:min-h-[400px] touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className={`absolute inset-0 transition-all duration-500 ${
                step === 1
                  ? 'opacity-100 translate-x-0'
                  : step > 1
                  ? 'opacity-0 -translate-x-full pointer-events-none'
                  : 'opacity-0 translate-x-full pointer-events-none'
              }`}
            >
              <ContactStep
                formData={formData}
                setFormData={setFormData}
                user={user}
              />
            </div>

            <div
              className={`absolute inset-0 transition-all duration-500 ${
                step === 2
                  ? 'opacity-100 translate-x-0'
                  : step > 2
                  ? 'opacity-0 -translate-x-full pointer-events-none'
                  : 'opacity-0 translate-x-full pointer-events-none'
              }`}
            >
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
            </div>

            <div
              className={`absolute inset-0 transition-all duration-500 ${
                step === 3
                  ? 'opacity-100 translate-x-0'
                  : step > 3
                  ? 'opacity-0 -translate-x-full pointer-events-none'
                  : 'opacity-0 translate-x-full pointer-events-none'
              }`}
            >
              <ConfirmationStep
                formData={formData}
                cartItems={cartItems}
                total={total}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            {step > 1 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setStep(step - 1)}
                className="transition-all duration-300 hover:scale-105"
              >
                <Icon name="ChevronLeft" size={20} className="mr-1" />
                Назад
              </Button>
            )}
            <Button 
              type="submit" 
              className="flex-1 transition-all duration-300 hover:scale-105"
              disabled={step === 1 && !isStep1Valid() || step === 2 && !isStep2Valid()}
            >
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