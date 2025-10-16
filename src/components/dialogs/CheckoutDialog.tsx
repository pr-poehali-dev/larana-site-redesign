import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ContactStep from './checkout/ContactStep';
import DeliveryStep from './checkout/DeliveryStep';
import ConfirmationStep from './checkout/ConfirmationStep';
import CheckoutProgress from './checkout/CheckoutProgress';
import { useCheckoutAudio } from './checkout/useCheckoutAudio';
import { useCheckoutSwipe } from './checkout/useCheckoutSwipe';
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
  const [step, setStep] = useState(1);
  
  const { playSound } = useCheckoutAudio();
  
  const {
    formData,
    setFormData,
    saveAddress,
    setSaveAddress,
    hasSavedAddress,
    setHasSavedAddress,
    savedAddresses,
    handleAddAddress,
    handleSelectAddress,
    handleDeleteAddress,
    handleSetDefaultAddress,
    isStep1Valid,
    isStep2Valid,
    calculateProgress
  } = useCheckoutData(open, user);

  const {
    containerRef,
    swipeHintVisible,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = useCheckoutSwipe({
    open,
    step,
    isStep1Valid,
    isStep2Valid,
    setStep,
    playSound
  });

  const total = cartItems.reduce((sum, item) => {
    const price = parseInt(item.price.replace(/\D/g, ''));
    return sum + (price * item.quantity);
  }, 0);

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
      playSound('forward');
    } else if (step === 2) {
      if (!isStep2Valid()) {
        return;
      }
      setStep(3);
      playSound('forward');
    } else {
      const savedUserData = {
        ...user,
        name: formData.name,
        phone: formData.phone,
        email: formData.email
      };
      localStorage.setItem('userData', JSON.stringify(savedUserData));
      playSound('success');
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

        <CheckoutProgress 
          step={step} 
          progress={calculateProgress()} 
          swipeHintVisible={swipeHintVisible}
        />

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
                saveAddress={saveAddress}
                setSaveAddress={setSaveAddress}
              />
            </div>

            <div
              className={`absolute inset-0 transition-all duration-500 ${
                step === 3
                  ? 'opacity-100 translate-x-0'
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
                onClick={() => {
                  setStep(step - 1);
                  playSound('back');
                }}
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
