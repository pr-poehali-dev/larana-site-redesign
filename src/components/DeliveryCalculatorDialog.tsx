import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface DeliveryCalculatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeliveryCalculatorDialog = ({ open, onOpenChange }: DeliveryCalculatorDialogProps) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [furnitureType, setFurnitureType] = useState('');
  const [floor, setFloor] = useState('');
  const [hasElevator, setHasElevator] = useState<'yes' | 'no' | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const request = {
        name,
        phone,
        city,
        address,
        furnitureType,
        floor,
        hasElevator: hasElevator === 'yes',
        timestamp: new Date().toISOString(),
      };

      const existingRequests = JSON.parse(localStorage.getItem('deliveryCalculations') || '[]');
      localStorage.setItem('deliveryCalculations', JSON.stringify([...existingRequests, request]));

      toast({
        title: 'Заявка отправлена!',
        description: 'Мы свяжемся с вами в ближайшее время для расчёта стоимости доставки.',
      });

      setName('');
      setPhone('');
      setCity('');
      setAddress('');
      setFurnitureType('');
      setFloor('');
      setHasElevator('');
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить заявку. Попробуйте позже.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Calculator" size={24} />
            Рассчитать стоимость доставки
          </DialogTitle>
          <DialogDescription>
            Заполните форму, и мы свяжемся с вами для точного расчёта
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Имя *</Label>
            <Input
              id="name"
              placeholder="Ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Телефон *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+7 (___) ___-__-__"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Город / Населённый пункт *</Label>
            <Input
              id="city"
              placeholder="Например: Екатеринбург"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Адрес доставки</Label>
            <Input
              id="address"
              placeholder="Улица, дом, квартира"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="furnitureType">Тип мебели</Label>
            <Textarea
              id="furnitureType"
              placeholder="Например: Кухня 3 метра, угловой диван, кровать"
              value={furnitureType}
              onChange={(e) => setFurnitureType(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="floor">Этаж</Label>
              <Input
                id="floor"
                type="number"
                placeholder="1"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label>Лифт</Label>
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant={hasElevator === 'yes' ? 'default' : 'outline'}
                  onClick={() => setHasElevator('yes')}
                  className="flex-1"
                >
                  Есть
                </Button>
                <Button
                  type="button"
                  variant={hasElevator === 'no' ? 'default' : 'outline'}
                  onClick={() => setHasElevator('no')}
                  className="flex-1"
                >
                  Нет
                </Button>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Icon name="Loader2" className="mr-2 animate-spin" size={16} />
                Отправка...
              </>
            ) : (
              <>
                <Icon name="Send" className="mr-2" size={16} />
                Отправить заявку
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryCalculatorDialog;
